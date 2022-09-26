import numpy as np
import math

from base.models import MyUser
from auctions.models import Item, Bid
from django.db.models import Q

import time
import datetime

def update_auctions_status():
    Item.objects.filter(ended__lt=datetime.datetime.now()).update(status=Item.ACQUIRED)
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
            for item in visited:
                self.R[self.user_dict[user.id], self.item_dict[item.id]] = 1
            for item in bidded:
                self.R[self.user_dict[user.id], self.item_dict[item.id]] = 2
                bids_on_item = Bid.objects.filter(item=item, bidder=user).count()
                if bids_on_item > 1: # Greater interest if multiple bids present
                    self.R[self.user_dict[user.id], self.item_dict[item.id]] += 0.1*(bids_on_item - 1)
            for item in sold: # Indicate some interest for items similar to ones sold, too
                self.R[self.user_dict[user.id], self.item_dict[item.id]] = 1.5
    def factorize(self, k, eta):
        self.V = 2*np.random.rand(self.N, k)
        self.F = 2*np.random.rand(k, self.M)

        old_RMSE = -1
        reps_done = 0
        while(True):
            for i in range(self.N): # For each row
                for j in range(self.M): # For each column
                    if self.R[i][j] > 0:
                        eij = self.R[i][j] - np.dot(self.V[i, :], self.F[:, j])
                        for feature in range(k):
                            self.V[i][feature] += eta * 2 * eij * self.F[feature][j]
                            self.F[feature][j] += eta * 2 * eij * self.V[i][feature]

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
            reps_done += 1

            if old_RMSE != -1 and old_RMSE - RMSE < 0.00001:
                print('Reps done: ', reps_done)
                print('Bye bye')
                break
            old_RMSE = RMSE

        print('MSE: ', MSE)

    def make_recommendations(self):
        R_new = np.dot(self.V, self.F)
        threshold = 1.3
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
    start_time = time.time()
    instance = MatrixFactorization()
    end_time = time.time()
    print('Initialization: ', end_time - start_time)
    start_time = time.time()
    instance.factorize(k=3, eta=0.001)
    end_time = time.time()
    print('Factorization: ', end_time - start_time)
    start_time = time.time()
    instance.make_recommendations()
    end_time = time.time()
    print('Recommendation creation: ', end_time - start_time)