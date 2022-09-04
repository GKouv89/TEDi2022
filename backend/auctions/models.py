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
        related_name='bidded_items', # Clashes
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
    started = models.DateTimeField()
    ended = models.DateTimeField()
    description = models.TextField()
    image_url = models.ImageField(upload_to=upload_to, blank=True, null=True)

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