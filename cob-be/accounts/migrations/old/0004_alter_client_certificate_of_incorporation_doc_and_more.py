# Generated by Django 4.2.13 on 2024-05-29 09:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_client_product'),
    ]

    operations = [
        migrations.AlterField(
            model_name='client',
            name='certificate_of_incorporation_doc',
            field=models.FileField(null=True, upload_to='accounts/kyc_documents/'),
        ),
        migrations.AlterField(
            model_name='client',
            name='company_address_doc',
            field=models.FileField(null=True, upload_to='accounts/kyc_documents/'),
        ),
        migrations.AlterField(
            model_name='client',
            name='company_pan',
            field=models.CharField(max_length=10, null=True),
        ),
        migrations.AlterField(
            model_name='client',
            name='company_pan_doc',
            field=models.FileField(null=True, upload_to='accounts/kyc_documents/'),
        ),
        migrations.AlterField(
            model_name='client',
            name='gstin',
            field=models.CharField(blank=True, max_length=15, null=True),
        ),
        migrations.AlterField(
            model_name='client',
            name='plan_status',
            field=models.BooleanField(default=False),
        ),
    ]
