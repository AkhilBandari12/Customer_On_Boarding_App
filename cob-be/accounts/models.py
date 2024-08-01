from django.contrib.auth.models import AbstractUser
from django.db import models
from .utils import *
# Create your models here.
# Plan Model

class Plan(models.Model):
    plan_name = models.CharField(max_length=50)
    plan_description = models.TextField()
    period = models.IntegerField(default=30)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.plan_name

###User - [Base User Overrided]
class User(AbstractUser):
    role = models.CharField(max_length=20, null=True, blank=True)
    mobile_number = models.CharField(max_length=15, unique=True)
    location = models.CharField(max_length=50, null=True, blank=True)
    def __str__(self):
        return self.username
    
    class Meta:
        ordering = ['-id']
    
###Client 
class Client(models.Model):
    client = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    company_name = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    address = models.TextField()
    employee_count = models.CharField(max_length=50)
    product = models.CharField(max_length=50)
    is_approved = models.BooleanField(default=False)
    assigned_to = models.IntegerField(default=0)
    #ekyc-fields start
    company_pan = models.CharField(max_length=10,null=True)
    company_pan_doc = models.FileField(upload_to=f'accounts/kyc_documents/',null=True)
    certificate_of_incorporation_doc = models.FileField(upload_to=f'accounts/kyc_documents/',null=True)
    company_address_doc = models.FileField(upload_to=f'accounts/kyc_documents/',null=True)
    gstin = models.CharField(max_length=15, null=True, blank=True)
    #ekyc-fields end
    plan_selected = models.ForeignKey(Plan, on_delete=models.SET_NULL, null=True)
    plan_status = models.BooleanField(default=False)
    licenses = models.IntegerField(default=0)

    def __str__(self):
        user = User.objects.get(id=self.client_id)
        fname = user.first_name
        lname = user.last_name
        return str(f"{self.client_id} - {fname} {lname}")  # Return as string
    

###Modules and Access Management
class Modules(models.Model):
    name=models.CharField(max_length=50)
    operations=models.JSONField()

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural='Modules'
    

class Roles(models.Model):
    name=models.CharField(max_length=25)
    permissions=models.JSONField()

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural='Roles'


####Notifications
class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.CharField(max_length=255)
    read = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp', 'read']  # Sort by timestamp descending, read ascending

    @classmethod
    def create_notification(cls, user, message):
        """
        Create a new notification for the specified user with the given message.
        This method ensures that older notifications beyond the limit (10) are deleted.
        """
        notification = cls(user=user, message=message)
        notification.save()
        send_email_notification(notification=notification)    ###--- Future use currently this is not required
        return notification

    @classmethod
    def delete_notification(cls, notification_id):
        """
        Delete a specific notification by its ID.
        """
        try:
            notification = cls.objects.get(id=notification_id)
            notification.delete()
            return True
        except cls.DoesNotExist:
            return False

    @classmethod
    def delete_all_notifications(cls, user):
        """
        Delete all notifications for a specific user.
        """
        cls.objects.filter(user=user).delete()

    def mark_as_read(self):
        """
        Marks the notification as read.
        """
        self.read = True
        self.save()

    def __str__(self):
        return f"{self.user} - Notification"
