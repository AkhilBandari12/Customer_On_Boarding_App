from rest_framework import serializers
from .models import User, Plan, Client, Notification, Roles
from django.contrib.auth import get_user_model
#################################################

##### Create or Update - Plan Serializers

class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = ['id','plan_name', 'plan_description', 'period', 'price']

##### Admin, SalesAgent, Client - Creation Serializers
##Admin or SalesAgent - 
class CreateAOSSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name','last_name','username', 'role', 'location', 'email', 'mobile_number', 'password']
        extra_kwargs = {'password': {'write_only': True}}

###Client
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username', 'role', 'email', 'mobile_number', 'password']

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['company_name', 'country', 'city', 'address', 'employee_count', 'product']

class ClientCreationSerializer(serializers.Serializer):
    user = UserSerializer()
    client = ClientSerializer()

    def create(self, validated_data):
        # Extract user data
        user_data = validated_data.get('user')

        # Create User instance
        user = User.objects.create_user(**user_data)

        # Extract client data
        client_data = validated_data.get('client')

        # Create Client instance
        client_data['client'] = user
        client = Client.objects.create(**client_data)

        return client

#####ClientDetails
class ClientDetailsAPISerializer(serializers.ModelSerializer):
    # Define a nested serializer for the client field
    client = UserSerializer()

    class Meta:
        model = Client
        fields = ['client','client_id', 'company_name', 'country', 'city', 'address', 'employee_count', 'product', 'assigned_to', 'is_approved', 'company_pan', 'company_pan_doc', 'certificate_of_incorporation_doc', 'company_address_doc', 'gstin', 'plan_selected', 'plan_status', 'licenses']

    def to_representation(self, instance):
        # Flatten the nested client serializer
        data = super().to_representation(instance)
        client_data = data.pop('client')  # Remove the nested client field
        data.update(client_data)  # Merge client data into main data
        return data


#####Notifications

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'user', 'message', 'read', 'timestamp']


#####




class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is not correct")
        return value
    def validate_new_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password should be at least 8 characters long.")
        # Check if the new password is the same as the old password
        user = self.context['request'].user
        if user.check_password(value):
            raise serializers.ValidationError("The new password cannot be the same as the old password.")
        return value
    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user
    


#
class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roles
        fields = ['id', 'name', 'permissions']



#####forgot-password
User = get_user_model()

class PasswordForgotRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()
    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("No user is associated with this email address.")
        return value
    
class PasswordForgotConfirmSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True, min_length=8)
    def validate_new_password(self, value):
        user = self.context.get('user')
        if len(value) < 8:
            raise serializers.ValidationError("Password should be at least 8 characters long.")
        # user = self.context['request'].user
        if user.check_password(value):
            raise serializers.ValidationError("The new password cannot be the same as the old password.")
        return value