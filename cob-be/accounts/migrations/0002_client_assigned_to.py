# Generated by Django 4.2.13 on 2024-05-30 10:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='client',
            name='assigned_to',
            field=models.IntegerField(default=0),
        ),
    ]
