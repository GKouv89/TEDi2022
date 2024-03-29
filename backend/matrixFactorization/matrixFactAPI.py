import numpy as np
import math

from base.models import MyUser
from auctions.models import Item, Bid
from django.db.models import Q

import time
import datetime

LATENT_FEATURES = 5 # Τhis is for running cross-validation.

def update_auctions_status():
    acquired_items = Item.objects.filter(ended__lt=datetime.datetime.now())
    for item in acquired_items:
        if item.number_of_bids > 0:
            highest_bid = item.items_bids.all().order_by('-amount').first()
            item.buyer = highest_bid.bidder
        item.status = Item.ACQUIRED
        item.save()
    Item.objects.filter(Q(started__lt=datetime.datetime.now()) & Q(ended__gt=datetime.datetime.now()) & ~Q(status=Item.ACQUIRED)).update(status=Item.RUNNING)

class MatrixFactorization():
    def __init__(self):
        Item.recommended_to.through.objects.all().delete() # Delete all former recommendations
        update_auctions_status()
        self.items = Item.objects.all().order_by('id')
        self.users = MyUser.objects.all().exclude(is_superuser=True).order_by('id')
        self.N = self.users.count()
        self.M = self.items.count()
        self.R = np.zeros((self.N, self.M))
        self.item_dict = {item.id:index for index, item in enumerate(self.items)}
        self.user_dict = {user.id:index for index, user in enumerate(self.users)}
        for user in self.users:
            visited = user.visited_items.all()
            bidded = user.bidded_items.all()
            sold = user.sold_items.all()
            bought = user.bought_items.all()
            for item in visited:
                self.R[self.user_dict[user.id], self.item_dict[item.id]] = 1
            for item in bidded:
                self.R[self.user_dict[user.id], self.item_dict[item.id]] = 2
                bids_on_item = Bid.objects.filter(item=item, bidder=user).count()
                if bids_on_item > 1: # Greater interest if multiple bids present
                    self.R[self.user_dict[user.id], self.item_dict[item.id]] += 0.1*(bids_on_item - 1)
            for item in sold: # Indicate some interest for items similar to ones sold, too
                self.R[self.user_dict[user.id], self.item_dict[item.id]] = 1.5
            for item in bought: # Indicate some interest for items similar to ones sold, too
                if item.rating != 0:
                    self.R[self.user_dict[user.id], self.item_dict[item.id]] = item.rating
                else:
                    print('Edge case')
                    self.R[self.user_dict[user.id], self.item_dict[item.id]] = 2.5 # A little higher interest than if he had just bid
    
    def calculate_cost(self):
        MSE = 0
        observations = 0
        for i in range(self.N):
            for j in range(self.M):
                if self.R[i][j] > 0:
                    observations += 1
                    MSE += pow(self.R[i][j] - np.dot(self.V[i, :], self.F[:, j]), 2)
        if observations != 0:
            MSE /= observations
        RMSE = math.sqrt(MSE)
        return RMSE

    def factorize(self, k, eta=0.001, max_iter=25000):
        self.V = 2*np.random.rand(self.N, k)
        self.F = 2*np.random.rand(k, self.M)

        old_RMSE = -1
        reps_done = 0
        while(True):
            for i in range(self.N): # For each row
                for j in range(self.M): # For each column
                    if self.R[i][j] > 0:
                        eij = self.R[i][j] - np.dot(self.V[i, :], self.F[:, j]) #error
                        for feature in range(k):    #gradient
                            self.V[i][feature] += eta * 2 * eij * self.F[feature][j]
                            self.F[feature][j] += eta * 2 * eij * self.V[i][feature]

            RMSE = self.calculate_cost()
            reps_done += 1

            if (old_RMSE != -1 and old_RMSE - RMSE < 0.00001) or reps_done==max_iter:
                print('Reps done: ', reps_done)
                print(RMSE)
                print('Bye bye')
                break
            old_RMSE = RMSE

        return RMSE

    def cv_matrices(self, fold):
        # Create a dict with the slicing indices
        rows = self.R.shape[0]
        cols = self.R.shape[1]
        mid_rows = int(rows/2)
        mid_cols = int(cols/2)
        
        idx_dict = {
                    0: [[0,mid_rows],[0, mid_cols]],
                    1: [[0,mid_rows],[mid_cols, cols]],
                    2: [[mid_rows, rows], [0, mid_cols]],
                    3: [[mid_rows, rows], [mid_cols, cols]]
        }
        
        idexes = idx_dict[fold]
        # Create masks
        train_mask = np.full((rows, cols), 1)
        train_mask[idexes[0][0]:idexes[0][1], idexes[1][0]:idexes[1][1]] = 0
        test_mask = 1 - train_mask
        
        # Create X_train
        X_train = self.R.copy()
        X_train[train_mask==0] = 0
        
        # Create X_test
        X_test = self.R.copy()
        X_test[train_mask==1] = 0
            
        return X_train, X_test, train_mask, test_mask

    def nmf_cv(self, latent_features):

        mask = ~np.isnan(self.R)
        trainErrors = {}
        testErrors = {}
        for fold in range(4):
            print("fold => "+str(fold))
            X_train, X_test, train_mask, test_mask = self.cv_matrices(fold)
            train_null_mask = mask * train_mask
            test_null_mask = mask * test_mask

            #train
            masked_X = train_null_mask * X_train    #get only train values
            original_array = self.R.copy()
            self.R = masked_X
            print("training... train error")
            trainError = self.factorize(latent_features)
            print(trainError) 
            trainErrors[fold] = trainError

            #validate
            masked_X = test_null_mask * X_test
            self.R = masked_X
            print("testing... test error")
            testError = self.calculate_cost()
            print(testError)
            testErrors[fold] = testError

            self.R = original_array

        #find average train & test error
        avg_testError = 0
        for i in range(4):
            avg_testError += testErrors.get(i)

        avg_testError /= 4

        return avg_testError


    def make_recommendations(self):
        R_new = np.dot(self.V, self.F)
        threshold = 2.5
        user_dict = {}
        for user in self.users:
            u_index = self.user_dict[user.id]
            user_dict[u_index] = {}
        # null_values = 0
        # for i in range(self.N):
        #     for j in range(self.M):
        #         if self.R[i][j] == 0:
        #             null_values += 1
        for item in self.items:
            if item.status == Item.RUNNING:
                i_index = self.item_dict[item.id]
                for user in self.users:
                    u_index = self.user_dict[user.id]
                    if self.R[u_index][i_index] == 0 and R_new[u_index][i_index] > threshold:
                        user_dict[u_index][item.id] = R_new[u_index][i_index]
        # print('Null values ', null_values)
        for user in self.users:
            u_index = self.user_dict[user.id]
            print('For user ', user.username)
            ten_best = [key for key, _ in sorted(user_dict[u_index].items(), key=lambda item: item[1], reverse=True)][0:10]
            for item_id in ten_best:
                item = Item.objects.get(id=item_id)
                item.recommended_to.add(user)
                item.save()
            print('Ten best: ', ten_best)

def update_recommendations():
    print('UPDATING RECOMMENDATIONS')
    # print("Optimal number of latent features => "+str(LATENT_FEATURES))
    start_time = time.time()
    instance = MatrixFactorization()
    end_time = time.time()
    print('Initialization: ', end_time - start_time)
    start_time = time.time()
    instance.factorize(k=2, eta=0.001) # K's value was chosen after running cross-validation.
    end_time = time.time()
    print('Factorization: ', end_time - start_time)
    start_time = time.time()
    instance.make_recommendations()
    end_time = time.time()
    print('Recommendation creation: ', end_time - start_time)

def cross_validate():
    print('CROSS VALIDATING')
    start_time = time.time()
    instance = MatrixFactorization()
    end_time = time.time()
    print(instance.R)
    null_mask = np.isnan(instance.R)
    mask = ~np.isnan(instance.R)
    avg_testErrors = {}
    for k in range(1, LATENT_FEATURES +1):   #find optimal number of latent features
        avg = instance.nmf_cv(k)
        avg_testErrors[k] = avg
        
    #find best test error and set optimal V,F for this # of latent features
    temp = min(avg_testErrors.values())
    res = [key for key in avg_testErrors if avg_testErrors[key] == temp]
    print(res)

    print("Optimal number of latent features => "+str(res))
