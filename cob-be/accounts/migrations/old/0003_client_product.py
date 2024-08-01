# Generated by Django 4.2.13 on 2024-05-29 08:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_alter_user_role'),
    ]

    operations = [
        migrations.AddField(
            model_name='client',
            name='product',
            field=models.CharField(choices=[('Voice Solution', 'Voice Solution'), ('ChatBots', 'ChatBots'), ('Education', 'Education'), ('Email Solution', 'Email Solution')], default='Voice Solution', max_length=50),
        ),
    ]
