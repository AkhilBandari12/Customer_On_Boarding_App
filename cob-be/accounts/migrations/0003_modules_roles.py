# Generated by Django 4.2.13 on 2024-06-07 05:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_client_assigned_to'),
    ]

    operations = [
        migrations.CreateModel(
            name='Modules',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('operations', models.JSONField()),
            ],
            options={
                'verbose_name_plural': 'Modules',
            },
        ),
        migrations.CreateModel(
            name='Roles',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=25)),
                ('permissions', models.JSONField()),
            ],
            options={
                'verbose_name_plural': 'Roles',
            },
        ),
    ]
