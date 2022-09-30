from email.policy import default
from django.db import models
from base.models import MyUser, Address

def upload_to(instance, filename):
    return 'images/{filename}'.format(filename=filename)

# Create your models here.
class Item(models.Model):
    ACQUIRED = 'AC'
    RUNNING = 'RU'
    INACTIVE = 'IN'
    STATUS_CHOICES = [
        (INACTIVE, 'Inactive'),
        (RUNNING, 'Running'),
        (ACQUIRED, 'Acquired'),
    ]
    name = models.CharField(max_length=255)
    currently =  models.DecimalField(default=0.0, max_digits=6, decimal_places=2)
    first_bid = models.DecimalField(default=0.0, max_digits=6, decimal_places=2)
    buy_price = models.DecimalField(null=True, blank=True, max_digits=6, decimal_places=2)
    number_of_bids = models.IntegerField(default=0)
    category = models.ManyToManyField(
        'Category',
        related_name='categorys_items',
    )
    status = models.CharField(
        max_length=2,
        choices=STATUS_CHOICES,
        default=INACTIVE,   
    )
    bids = models.ManyToManyField(
        'base.MyUser',
        through='Bid',
        through_fields=('item', 'bidder'),
        related_name='bidded_items',
    )

    visitors = models.ManyToManyField(
        'base.MyUser',
        related_name='visited_items',
    )

    recommended_to = models.ManyToManyField(
        'base.MyUser',
        related_name='recommended_items',
    )

    address = models.ForeignKey(
        'base.Address',
        on_delete = models.CASCADE,
        related_name='hosted_items',
    )

    seller = models.ForeignKey(
        'base.MyUser',
        on_delete=models.CASCADE,
        related_name='sold_items',
    )

    buyer = models.ForeignKey(
        'base.MyUser',
        on_delete=models.CASCADE,
        related_name='bought_items',
        null = True,
        blank = True,
    )

    rating = models.IntegerField(default=0)
    buyer_rating = models.IntegerField(default=0) # This is how well the buyer cooperated after acquiring the item etc. Will be added to user's overall buyer rating

    started = models.DateTimeField()
    ended = models.DateTimeField()
    description = models.TextField()

    #These booleans are used when we want to prompt the user to initiate messaging with the other part of the transaction
    notify_buyer = models.BooleanField(default=False)
    notify_seller = models.BooleanField(default=False)

class ItemImage(models.Model):
    image = models.ImageField(upload_to=upload_to)
    item = models.ForeignKey('Item', on_delete=models.CASCADE, related_name='items_images')

class Bid(models.Model):
    bidder = models.ForeignKey(
        'base.MyUser',
        on_delete=models.CASCADE,
        related_name='user_bids', 
    )
    item = models.ForeignKey(
        'Item',
        on_delete=models.CASCADE,
        related_name='items_bids', 
    )
    time = models.DateTimeField()
    amount = models.DecimalField(max_digits=6, decimal_places=2)

class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)