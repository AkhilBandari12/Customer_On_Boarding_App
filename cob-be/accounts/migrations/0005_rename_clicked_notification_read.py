# Generated by Django 4.2.13 on 2024-06-19 05:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_alter_client_employee_count_alter_client_product_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='notification',
            old_name='clicked',
            new_name='read',
        ),
    ]
