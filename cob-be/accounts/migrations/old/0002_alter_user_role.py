# Generated by Django 4.2.13 on 2024-05-28 10:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='role',
            field=models.CharField(blank=True, choices=[('Client', 'Client'), ('SalesAgent', 'SalesAgent'), ('Admin', 'Admin')], max_length=20, null=True),
        ),
    ]
