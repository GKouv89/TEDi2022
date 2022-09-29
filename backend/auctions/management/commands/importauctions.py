from django.core.management.base import BaseCommand, CommandError
from base.models import MyUser, Address
from auctions.models import Item, Bid, Category
import xml.etree.ElementTree as ET
import datetime
from django.utils.timezone import make_aware
from random import randint, randrange

class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument('file_names', nargs='+', type=str)

    def handle(self, *args, **kwargs):
        for file_name in kwargs['file_names']:
            tree = ET.parse(file_name)
            root = tree.getroot()
            all_items = list(root.iter('Item'))
            now = make_aware(datetime.datetime.now())
            delta1 = datetime.timedelta(days=30)
            delta2 = datetime.timedelta(days=1)
            delta3 = datetime.timedelta(days=10)
            
            start_date_for_active = now - delta2
            end_date_for_active = now + delta1
            start_date_for_acquired = now - delta1
            end_date_for_acquired = now - delta3

            users = MyUser.objects.all().exclude(is_superuser=True).order_by('id')
            user_count = users.count()
            address = Address.objects.first()
            for item in all_items:
                all_categories = list(category.text for category in item.iter('Category'))
                name = item.find('Name').text
                first_bid = float(item.find('First_Bid').text.replace('$', ''))
                currently = float(item.find('Currently').text.replace('$', ''))
                description = item.find('Description').text
                if description is None: # Handle case of no description, as we require it
                    description = "abc"

                user = users[randrange(user_count)]
            
                number_of_bids = int(item.find('Number_of_Bids').text)
                if number_of_bids == 0:
                    active = 1 # Set item as active, we can't use it to generate rating for matrix factorization as there are no bids.
                else:
                    active = randrange(2) # Toss a random coin as to whether it is active or acquired

                if active == 0: # Item will be acquired
                    new_item = Item.objects.create(name=name, first_bid=first_bid, currently=currently, description=description, seller=user, address=address, started=start_date_for_acquired, ended=end_date_for_acquired, status=Item.ACQUIRED)                    
                else: # Item will be running
                    new_item = Item.objects.create(name=name, first_bid=first_bid, currently=currently, description=description, seller=user, address=address, started=start_date_for_active, ended=end_date_for_active, status=Item.RUNNING)
                
                # The following information is necessary whether the item is acquired or not
                new_item.number_of_bids = number_of_bids
                new_item.save()
                for category in all_categories:
                    category_object, _ = Category.objects.get_or_create(name=category)
                    new_item.category.add(category_object)

                touched = [user.id] # we don't want the creator of the auction to come up as a bidder or visitor (initially)
                all_bids = item.iter('Bid')
                for i in all_bids:
                    bidder = randrange(user_count)
                    while bidder == user.id: # Excluding seller
                        bidder = randrange(user_count)
                    if bidder not in touched:
                        touched.append(bidder)
                    now = make_aware(datetime.datetime.now()) # For active auctions
                    bid_time_old = end_date_for_acquired - delta1 # For acquired auctions, all bids took place a day before the end of the auction
                    if active == 0: # Item will be acquired
                        bid = Bid.objects.create(bidder=users[bidder], amount=float(i.find('Amount').text.replace('$', '')), time=bid_time_old, item=new_item)
                    else:
                        bid = Bid.objects.create(bidder=users[bidder], amount=float(i.find('Amount').text.replace('$', '')), time=now, item=new_item)
                    bid.save()

                # The following is required for auctions that are acquired
                # Find bidder with highest bid, make them buyer
                # and assign a rating to the item (and the item's seller)
                # so it can be used for matrix factorization

                if active == 0 and new_item.number_of_bids > 0: # A lot of auctions when acquired have no bids, and therefore no buyer, so we don't bother with those
                    highest_bid = new_item.items_bids.all().order_by('-amount').first()
                    new_item.buyer = highest_bid.bidder
                    rating = randrange(1, 6) # generate a random number from 1 to 5 
                    new_item.rating = rating
                    new_item.seller.seller_rating += rating
                    new_item.save()
                    new_item.seller.save()

                # The following is necessary for all items
                remaining = user_count - len(touched)
                if remaining != 0:
                    max_allowed_visitors = int(0.3*remaining)
                    if max_allowed_visitors != 0:
                        no_of_visitors = randrange(max_allowed_visitors)
                        for i in range(no_of_visitors):
                            visitor = randrange(user_count)
                            while visitor in touched:
                                visitor = randrange(user_count)
                            new_item.visitors.add(users[visitor])
                            touched.append(visitor)
