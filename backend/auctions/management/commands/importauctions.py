from django.core.management.base import BaseCommand, CommandError
from base.models import MyUser, Address
from auctions.models import Item, Bid, Category
import xml.etree.ElementTree as ET
import datetime
from django.utils.timezone import make_aware
from random import randrange

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
            start_date = now - delta2
            end_date = now + delta1
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
                new_item = Item.objects.create(name=name, first_bid=first_bid, currently=currently, description=description, seller=user, address=address, started=start_date, ended=end_date)
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
                    now = make_aware(datetime.datetime.now())
                    bid = Bid.objects.create(bidder=users[bidder], amount=float(i.find('Amount').text.replace('$', '')), time=now, item=new_item)
                    bid.save()
                remaining = user_count - len(touched)
                if remaining != 0:
                    max_allowed_visitors = int(0.3*remaining)
                    print('Max allowed visitors ', max_allowed_visitors)
                    if max_allowed_visitors != 0:
                        no_of_visitors = randrange(max_allowed_visitors)
                        print('Number of visitors ', no_of_visitors)
                        for i in range(no_of_visitors):
                            visitor = randrange(user_count)
                            while visitor in touched:
                                visitor = randrange(user_count)
                            new_item.visitors.add(users[visitor])
                            touched.append(visitor)
