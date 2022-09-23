from django.shortcuts import render
import numpy as np
import math
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from base.models import MyUser
from auctions.models import Item

# Create your views here.
class MatrixFactorization():
    def __init__(self):
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
            for item in visited:
                self.R[self.user_dict[user.id], self.item_dict[item.id]] = 1
            for item in bidded:
                self.R[self.user_dict[user.id], self.item_dict[item.id]] = 2

    def factorize(self, k, eta):
        self.V = 2*np.random.rand(self.N, k)
        self.F = 2*np.random.rand(k, self.M)

        old_RMSE = -1
        reps_done = 0
        # for rep in range(reps): 
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
            MSE /= observations
            RMSE = math.sqrt(MSE)
            reps_done += 1
            # if reps_done % 100 == 0: 
            #   print('Reps done: ', reps_done)
            #   print('old RMSE: ', old_RMSE)
            #   print('RMSE: ', RMSE)

            if old_RMSE != -1 and old_RMSE - RMSE < 0.00001:
                print('Reps done: ', reps_done)
                # print('old RMSE: ', old_RMSE)
                # print('RMSE: ', RMSE)
                print('Bye bye')
                break
            old_RMSE = RMSE

        print('MSE: ', MSE)
    
    def make_recommendations(self):
        R_new = np.dot(self.V, self.F)
        threshold = 1.3
        for item in self.items:
            if item.status == Item.RUNNING:
                i_index = self.item_dict[item.id]
                for user in self.users:
                    u_index = self.user_dict[user.id]
                    if self.R[u_index][i_index] == 0 and R_new[u_index][i_index] > threshold:
                        item.recommended_to.add(user)
                item.save()
        for user in self.users:
            print('For user ', user.username)
            print('Recommended ', user.recommended_items.all())


class FactorizeView(APIView):
    def post(self, request):
        instance = MatrixFactorization()
        print(instance.R)
        instance.factorize(k=3, eta=0.001)
        new_R = np.dot(instance.V, instance.F)
        print(np.dot(instance.V, instance.F))
        instance.make_recommendations()
        return Response(status=status.HTTP_200_OK)
