# Generated by Django 4.1 on 2022-09-22 11:01

import django.contrib.gis.db.models.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Address',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('location', django.contrib.gis.db.models.fields.PointField(srid=4326)),
                ('address_name', models.CharField(blank=True, max_length=50, null=True)),
                ('Street_name', models.CharField(max_length=50)),
                ('Street_number', models.PositiveIntegerField()),
                ('Postal_code', models.CharField(max_length=50)),
                ('City', models.CharField(max_length=50)),
                ('Country', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='MyUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('username', models.CharField(max_length=50, unique=True)),
                ('first_name', models.CharField(max_length=50, null=True)),
                ('last_name', models.CharField(max_length=50, null=True)),
                ('password', models.CharField(max_length=255)),
                ('email', models.EmailField(max_length=60)),
                ('phone_number', models.CharField(max_length=20, null=True)),
                ('seller_rating', models.PositiveIntegerField(default=0)),
                ('buyer_rating', models.PositiveIntegerField(default=0)),
                ('tin', models.CharField(max_length=20, null=True)),
                ('isPending', models.BooleanField(default=True)),
                ('is_admin', models.BooleanField(default=False)),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('is_superuser', models.BooleanField(default=False)),
                ('Address', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='base.address')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
