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
            # self.stdout.write(root.tag)
            all_items = list(root.iter('Item'))
            # self.stdout.write(str(len(all_items)))
            now = make_aware(datetime.datetime.now())
            delta = datetime.timedelta(days=30)
            end_date = now + delta
            users = MyUser.objects.all().exclude(is_superuser=True).order_by('id')
            user_count = users.count()
            address = Address.objects.first()
            for item in all_items:
                all_categories = list(category.text for category in item.iter('Category'))
                name = item.find('Name').text
                first_bid = float(item.find('First_Bid').text.replace('$', ''))
                currently = float(item.find('Currently').text.replace('$', ''))
                description = item.find('Description').text
                user = users[randrange(user_count)]
                new_item = Item.objects.create(name=name, first_bid=first_bid, currently=currently, description=description, seller=user, address=address, started=now, ended=end_date)
                new_item.save()
                for category in all_categories:
                    category_object, _ = Category.objects.get_or_create(name=category)
                    new_item.category.add(category_object)
                touched = []
                all_bids = item.iter('Bid')
                for i in all_bids:
                    bidder = randrange(user_count)
                    if bidder not in touched:
                        touched.append(bidder)
                    now = make_aware(datetime.datetime.now())
                    bid = Bid.objects.create(bidder=users[bidder], amount=float(i.find('Amount').text.replace('$', '')), time=now, item=new_item)
                    bid.save()
                no_of_visitors = randrange(user_count - len(touched))
                for i in range(no_of_visitors):
                    visitor = randrange(user_count)
                    while visitor in touched:
                        visitor = randrange(user_count)
                    new_item.visitors.add(users[visitor])
                    touched.append(visitor)
