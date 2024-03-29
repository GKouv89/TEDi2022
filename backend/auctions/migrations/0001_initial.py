# Generated by Django 4.1 on 2022-09-22 11:01

import auctions.models
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('base', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Bid',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time', models.DateTimeField()),
                ('amount', models.DecimalField(decimal_places=2, max_digits=6)),
                ('bidder', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_bids', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Item',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('currently', models.DecimalField(decimal_places=2, default=0.0, max_digits=6)),
                ('first_bid', models.DecimalField(decimal_places=2, default=0.0, max_digits=6)),
                ('buy_price', models.DecimalField(blank=True, decimal_places=2, max_digits=6, null=True)),
                ('number_of_bids', models.IntegerField(default=0)),
                ('status', models.CharField(choices=[('IN', 'Inactive'), ('RU', 'Running'), ('AC', 'Acquired')], default='IN', max_length=2)),
                ('started', models.DateTimeField()),
                ('ended', models.DateTimeField()),
                ('description', models.TextField()),
                ('address', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='hosted_items', to='base.address')),
                ('bids', models.ManyToManyField(related_name='bidded_items', through='auctions.Bid', to=settings.AUTH_USER_MODEL)),
                ('category', models.ManyToManyField(related_name='categorys_items', to='auctions.category')),
                ('seller', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sold_items', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ItemImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to=auctions.models.upload_to)),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items_images', to='auctions.item')),
            ],
        ),
        migrations.AddField(
            model_name='bid',
            name='item',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items_bids', to='auctions.item'),
        ),
    ]
