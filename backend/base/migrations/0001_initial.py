# Generated by Django 4.0.6 on 2022-08-12 10:30

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('username', models.CharField(max_length=32, primary_key=True, serialize=False)),
            ],
        ),
    ]