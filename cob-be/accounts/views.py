from django.shortcuts import render, redirect
from django.contrib.auth import logout, authenticate
from rest_framework import generics
from .models import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from jwt import decode, InvalidTokenError
from rest_framework.decorators import api_view
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from django.db.models import Case, When, Value, CharField, Q, F
from rest_framework.decorators import permission_classes
from .permissions import *
from django.db.models import Count, Q
import json
import pycountry
from .utils import *
##forgot-password
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_bytes, smart_str
from django.core.mail import send_mail
# # # Create your views here.
###Registration-CONSTANTS
@api_view(['GET'])
def get_countries(request):
    try:
        countries = list(pycountry.countries)
        country_names = [country.name for country in countries]
        return Response(country_names)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    
@api_view(['GET'])
def products(request):
    products = ['Voice Solution', 'ChatBots', 'Education', 'Email Solution']
    return Response(products)

@api_view(['GET'])
def employee_count(request):
    employee_count = ['0-50', '50-100', '100-500', '500-2000','2000+']
    return Response(employee_count)

#####AOS-Constants

@api_view(['GET'])
def get_locations(request):
    locations = ['Hyderabad', 'Bangalore', 'Chennai', 'Pune', 'Mumbai']
    return Response(locations)

##function-view for-checks
@api_view(['GET'])
def check_username_unique(request):
    username = request.query_params.get('username', None)
    if username is None:
        return Response({"error": "Username not provided"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(username=username)
        return Response({"exists": True}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"exists": False}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def check_email_unique(request):
    email = request.query_params.get('email', None)
    if email is None:
        return Response({"error": "Email not provided"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)
        return Response({"exists": True}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"exists": False}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def check_mobile_unique(request):
    mobile = request.query_params.get('mobile', None)
    if mobile is None:
        return Response({"error": "Mobile number not provided"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(mobile_number=mobile)
        return Response({"exists": True}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"exists": False}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

######Roles API----------------
@api_view(['GET'])
def get_role_names(request):
    roles = Roles.objects.values_list('name', flat=True)  # Fetch all role names
    return Response(list(roles))


######Notifications------------------------------------------------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def notification_list(request):
    user = request.user
    unread_notifications = Notification.objects.filter(user=user, read=False).order_by('-timestamp')
    read_notifications = Notification.objects.filter(user=user, read=True).order_by('-timestamp')
    
    notifications = list(unread_notifications) + list(read_notifications)

    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data)

@api_view(['PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def modify_notification(request, notification_id):
    """
    Marks a specific notification as read or deletes it by its ID.
    """
    try:
        notification = Notification.objects.get(id=notification_id)

        if request.method == 'PATCH':
            notification.mark_as_read()
            return Response(status=status.HTTP_200_OK)
        elif request.method == 'DELETE':
            notification.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

    except Notification.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_notifications(request):
    """
    Delete all notifications for the authenticated user.
    """
    user = request.user  # Assuming authentication and user handling in place
    Notification.objects.filter(user=user).delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


######Dashboard
class DashboardAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.is_superuser or user.role == 'Admin':
            new_clients = Client.objects.filter(assigned_to=0, is_approved=False).annotate(
                first_name=F('client__first_name'),
                last_name=F('client__last_name'),
                mobile_number = F('client__mobile_number'),
            ).values()

            clients_approved = Client.objects.filter(~Q(assigned_to=0), is_approved=True).annotate(
                first_name=F('client__first_name'),
                last_name=F('client__last_name'),
                mobile_number = F('client__mobile_number'),
            ).values()

            pending_approval = Client.objects.filter(
                Q(company_pan__isnull=False) &
                Q(company_pan_doc__isnull=False) &
                Q(certificate_of_incorporation_doc__isnull=False) &
                Q(company_address_doc__isnull=False) &
                Q(gstin__isnull=False), ~Q(assigned_to=0), is_approved=False
            ).annotate(
                first_name=F('client__first_name'),
                last_name=F('client__last_name'),
                mobile_number = F('client__mobile_number'),
            ).values()

            ekyc_pending = Client.objects.filter(
                Q(company_pan__isnull=True) |
                Q(company_pan_doc__isnull=True) |
                Q(certificate_of_incorporation_doc__isnull=True) |
                Q(company_address_doc__isnull=True) |
                Q(gstin__isnull=True)
            ).annotate(
                first_name=F('client__first_name'),
                last_name=F('client__last_name'),
                mobile_number = F('client__mobile_number'),
            ).values()

            return Response({
                'new_clients': list(new_clients),
                'clients_approved': list(clients_approved),
                'pending_approval': list(pending_approval),
                'ekyc_pending': list(ekyc_pending),
            })

        elif user.role == 'SalesAgent':
            ekyc_pending = Client.objects.filter(
                Q(company_pan__isnull=True) |
                Q(company_pan_doc__isnull=True) |
                Q(certificate_of_incorporation_doc__isnull=True) |
                Q(company_address_doc__isnull=True) |
                Q(gstin__isnull=True),
                assigned_to=user.id, is_approved=False
            ).annotate(
                first_name=F('client__first_name'),
                last_name=F('client__last_name'),
                mobile_number = F('client__mobile_number'),
            ).values()

            clients_approved = Client.objects.filter(assigned_to=user.id, is_approved=True).annotate(
                first_name=F('client__first_name'),
                last_name=F('client__last_name'),
                mobile_number = F('client__mobile_number'),
            ).values()

            pending_approval = Client.objects.filter(
                Q(company_pan__isnull=False) &
                Q(company_pan_doc__isnull=False) &
                Q(certificate_of_incorporation_doc__isnull=False) &
                Q(company_address_doc__isnull=False) &
                Q(gstin__isnull=False), assigned_to=user.id, is_approved=False
            ).annotate(
                first_name=F('client__first_name'),
                last_name=F('client__last_name'),
                mobile_number = F('client__mobile_number'),
            ).values()

            return Response({
                'ekyc_pending': list(ekyc_pending),
                'clients_approved': list(clients_approved),
                'pending_approval': list(pending_approval),
            })

        else:
            return Response({
                'message': "Restricted",
            })


################Login & Logout
class LoginAPIView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            access_token = AccessToken.for_user(user)
            user_id = access_token.payload.get('user_id')

            try:
                user = User.objects.get(pk=user_id)
                response_data = {
                    'access': str(access_token),
                    'user_id': user_id,
                    'username': user.username,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'email': user.email,
                    'role': user.role
                }
                return Response(response_data, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            # Invalid credentials
            return Response({'message': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)

class ChangePasswordAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        user = request.user
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class MyProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user_id = request.user.id
            user = User.objects.get(pk=user_id)
            user_data = {
                'id': user.id,
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'role': user.role
                # Add more user details as needed
            }

            if user.role == "Client":
                # If the user is a client, include client details
                client = Client.objects.get(client=user)
                client_data = {
                    'company_name': client.company_name,
                    'country': client.country,
                    'city': client.city,
                    'address': client.address,
                    'employee_count': client.employee_count,
                    'product': client.product,
                    'is_approved': client.is_approved,
                    'assigned_to': client.assigned_to,
                    # e-kyc fields
                    # "company_pan":client.company_pan,
                    # "company_pan_doc": client.company_pan_doc,
                    # "certificate_of_incorporation_doc": client.certificate_of_incorporation_doc,
                    # "company_address_doc": client.company_address_doc,
                    # "gstin": client.gstin
                }
                user_data.update(client_data)

            return Response(user_data, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        except TokenError as e:
            return Response({'message': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

    def patch(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()

            if user.role == "Client":
                client = Client.objects.get(client=user)
                client_serializer = ClientSerializer(client, data=request.data, partial=True)
                if client_serializer.is_valid():
                    client_serializer.save()
                else:
                    return Response(client_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


################USER LIST API

class UserListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        data = {}
        if user.is_superuser or user.role == 'Admin':
            admins = User.objects.filter(role='Admin')
            clients = Client.objects.filter(client__role='Client', assigned_to=0)
            sales_agents = User.objects.filter(role='SalesAgent')
            all_users = User.objects.filter(role__in=['Admin', 'SalesAgent', 'Client'])
            all_users_data = []
            for user in all_users:
                user_data = UserSerializer(user).data
                if user.role == 'Client':
                    try:
                        client = Client.objects.get(client=user)
                        user_data['company_name'] = client.company_name
                        user_data['is_approved'] = client.is_approved
                    except Client.DoesNotExist:
                        user_data['company_name'] = None
                        user_data['is_approved'] = None
                else:
                    user_data['is_approved'] = None  # Non-client users won't have approval status
                all_users_data.append(user_data)
            data.update({
                'admins': UserSerializer(admins, many=True).data,
                'clients': ClientDetailsAPISerializer(clients, many=True).data,
                'sales_agents': UserSerializer(sales_agents, many=True).data,
                'all_users': all_users_data
            })
        elif user.role == 'SalesAgent':
            clients = Client.objects.filter(client__role='Client', assigned_to=user.id, is_approved=False)
            client_profiles = ClientDetailsAPISerializer(clients, many=True).data
            data.update({
                'clients': client_profiles,
            })
        else:
            return Response({"error": "Restricted Area"}, status=status.HTTP_404_NOT_FOUND)
        return Response(data, status=status.HTTP_200_OK)
    
    def get_module_name(self):
        return 'userlistview'


################Create Users - API-Views
class CreateRoleView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = RoleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

################Create Users - API-Views
# @permission_classes([IsAuthenticated, HasModulePermission])
# class CreateAOSAPIView(APIView):
#     def post(self, request):
#         serializer = CreateAOSSerializer(data=request.data)
#         if serializer.is_valid():
#             first_name = serializer.validated_data.get('first_name')
#             last_name = serializer.validated_data.get('last_name')
#             username = serializer.validated_data.get('username')
#             password = serializer.validated_data.get('password')
#             email = serializer.validated_data.get('email')
#             role = serializer.validated_data.get('role')
#             mobile_number = serializer.validated_data.get('mobile_number')
#             location = serializer.validated_data.get('location')
#             existing_roles = Roles.objects.values_list('name', flat=True)
#             # if role not in ['Admin', 'SalesAgent']:
#             if role not in existing_roles:
#                 return Response({'message': 'Invalid role'}, status=status.HTTP_400_BAD_REQUEST)
#             user = User.objects.create_user(
#                 first_name=first_name,
#                 last_name=last_name,
#                 username=username,
#                 password=password,
#                 email=email,
#                 role=role,
#                 mobile_number=mobile_number,
#                 location=location
#             )
#             return Response({'message': f'{role} created successfully'}, status=status.HTTP_201_CREATED)
#         else:
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#     def get_module_name(self):
#         return 'createadminorsalesagent'



@permission_classes([IsAuthenticated, HasModulePermission])
class CreateAOSAPIView(APIView):
    permission_classes = [IsAuthenticated, HasModulePermission]

    def post(self, request):
        serializer = CreateAOSSerializer(data=request.data)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            role = validated_data.get('role')
            
            # Check if the role is valid
            existing_roles = Roles.objects.values_list('name', flat=True)
            if role not in existing_roles:
                return Response({'message': 'Invalid role'}, status=status.HTTP_400_BAD_REQUEST)
            print(validated_data)
            # Create the user
            user = User.objects.create_user(**validated_data)

            return Response({'message': f'{role} created successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_module_name(self):
        return 'createadminorsalesagent'

class CreateClientAPIView(APIView):
    def post(self, request):
        serializer = ClientCreationSerializer(data=request.data)
        if serializer.is_valid():
            # Extract user data
            user_data = serializer.validated_data.get('user')
            email = user_data.get('email')
            username = email.lower()
            user_data['username'] = username
            user_data['role'] = 'Client'
            password = user_data.pop('password')

            # Extract client data
            client_data = serializer.validated_data.get('client')

            # Create User instance
            user = User.objects.create_user(password=password, **user_data)

            # Create Client instance
            client_data['client'] = user
            client = Client.objects.create(**client_data)
            send_client_welcome(user=user)

            return Response({'message': 'Client created successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

################Details - APIView

@permission_classes([IsAuthenticated, HasModulePermission])
class ClientDetailsAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = ClientDetailsAPISerializer
    lookup_field = 'client_id'  

    def get_queryset(self):
        client_id = self.kwargs['client_id']
        return Client.objects.filter(client_id=client_id)


    def retrieve(self, request, *args, **kwargs):
        try:
            user_instance = request.user
            user_instance_id = user_instance.id
            client_instance = self.get_object()  # Retrieve the specific client object
            client_instance_id = client_instance.client_id

            if client_instance is None:
                return Response({"error": "Client not found"}, status=status.HTTP_404_NOT_FOUND)

            # Checking if the user is the owner of the client data
            if user_instance.role == "Client":
                if user_instance_id != client_instance_id:
                    return Response({"error": "You don't have permission to access this client's details."},
                                    status=status.HTTP_403_FORBIDDEN)
            elif user_instance.role == "Admin":
                pass  # Admin has access to all client details
            elif user_instance.role == "SalesAgent":
                # Sales agents can only access client details assigned to them
                if client_instance.assigned_to != user_instance.id:
                    return Response({"error": "You don't have permission to access this client's details."},
                                    status=status.HTTP_403_FORBIDDEN)
            else:
                return Response({"error": "You don't have permission to access this client's details."},
                                status=status.HTTP_403_FORBIDDEN)

            # Serialize the user and client data
            user_serializer = UserSerializer(user_instance)
            client_serializer = self.get_serializer(client_instance)

            user_data = user_serializer.data
            client_data = client_serializer.data

            combined_data = {**user_data, **client_data}

            return Response(combined_data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    # def retrieve(self, request, *args, **kwargs):
    #     try:
    #         user_instance = request.user  
    #         client_instance = self.get_queryset().first()  
    #         client_insta = self.get_object()
    #         print(client_instance)
    #         print(user_instance)

    #         if client_instance.user != user_instance:  # Adjust this line according to your actual model structure
    #             return Response({"error": "You don't have permission to access this client's details."},
    #                             status=status.HTTP_403_FORBIDDEN)

    #         if client_instance is None:
    #             return Response({"error": "Client not found"}, status=status.HTTP_404_NOT_FOUND)

    #         # Check permissions based on user role
    #         if user_instance.role == "Admin":
    #             pass  # Admin has access to all client details
    #         elif user_instance.role == "SalesAgent":
    #             # Sales agents can only access client details assigned to them
    #             if client_instance.assigned_to != user_instance.id:
    #                 return Response({"error": "You don't have permission to access this client's details."},
    #                                 status=status.HTTP_403_FORBIDDEN)
    #         else:
    #             return Response({"error": "You don't have permission to access this client's details."},
    #                             status=status.HTTP_403_FORBIDDEN)

    #         user_serializer = UserSerializer(user_instance)
    #         client_serializer = self.get_serializer(client_instance)

    #         user_data = user_serializer.data
    #         client_data = client_serializer.data

    #         combined_data = {**user_data, **client_data}

    #         return Response(combined_data)
    #     except Exception as e:
    #         return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def partial_update(self, request, *args, **kwargs):
        try:
            client_instance = self.get_queryset().first()  

            if client_instance is None:
                return Response({"error": "Client not found"}, status=status.HTTP_404_NOT_FOUND)

            serializer = self.get_serializer(client_instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    
    def get_module_name(self):
        return 'ClientDetails'


@permission_classes([IsAuthenticated, HasModulePermission])
class AssignClientToSalesAgentAPIView(generics.UpdateAPIView):
    queryset = Client.objects.all()
    serializer_class = ClientDetailsAPISerializer

    def partial_update(self, request, *args, **kwargs):
        salesagent_id = request.data.get('salesagent_id')
        client_ids = request.data.get('client_ids', [])
        clients_to_assign = self.get_queryset().filter(client_id__in=client_ids)  # Filtering based on 'client_id'

        try:
            salesagent_instance = User.objects.get(id=salesagent_id,role="SalesAgent")
        except User.DoesNotExist:
            return Response({"error": "Sales Agent not found"}, status=status.HTTP_404_NOT_FOUND)

        for client in clients_to_assign:
            client.assigned_to = salesagent_instance.id
            client.save()
            Notification.create_notification(user=salesagent_instance,message=f"Client ID - \"{client.client_id}\" has been assigned to you!")
        return Response({"message": f"{len(clients_to_assign)} clients assigned to Sales Agent successfully"}, status=status.HTTP_200_OK)
    
    def get_module_name(self):
        return 'assigntosalesagent'


################Plans - APIView
@permission_classes([IsAuthenticated, HasModulePermission])
class PlanAPIView(APIView):
    def get(self, request, *args, **kwargs):
        plans = Plan.objects.all()
        serializer = PlanSerializer(plans, many=True)
        response_data = {'plans': serializer.data}
        return Response(response_data)

    def post(self, request, *args, **kwargs):
        serializer = PlanSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get_module_name(self):
        return 'Plan'

@permission_classes([IsAuthenticated, HasModulePermission])
class PlanModifyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Plan.objects.all()
    serializer_class = PlanSerializer
    lookup_url_kwarg = 'id'

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    def get_module_name(self):
        return 'PlanModify'



#####forgot-password

User = get_user_model()  # This will get the custom user model

class PasswordForgotRequestView(APIView):
    def post(self, request):
        serializer = PasswordForgotRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({"detail": "User with this email address does not exist."}, status=status.HTTP_400_BAD_REQUEST)

            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            reset_link = f"http://localhost:5000/forgot-confirmpassword/{uid}/{token}/"
            message = f"Hi {user.username},\n\nYou requested a password reset. Click the link below to reset your password:\n{reset_link}\n\nIf you didn't request a password reset, you can ignore this email."
            
            send_mail(
                'Password Reset Request',
                message,
                settings.EMAIL_HOST_USER,
                [user.email],
                fail_silently=False,
            )
            return Response({"detail": "Password reset link sent."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordForgotConfirmView(APIView):
    def post(self, request, uidb64, token):
        try:
            uid = smart_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"detail": "Invalid user or token."}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({"detail": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = PasswordForgotConfirmSerializer(data=request.data, context={'user': user})
        if serializer.is_valid():
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({"detail": "Password has been reset."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





# class UserListView(APIView):     ###Do not Delete
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         user = request.user
#         data = {}

#         if user.is_superuser or user.role == 'Admin':
#             admins = User.objects.filter(role='Admin')
#             clients = Client.objects.filter(client__role='Client', assigned_to=0)
#             sales_agents = User.objects.filter(role='SalesAgent')
#             all_users = User.objects.filter(role__in=['Admin', 'SalesAgent', 'Client'])
#             data.update({
#                 'admins': UserSerializer(admins, many=True).data,
#                 'clients': ClientDetailsAPISerializer(clients, many=True).data,
#                 'sales_agents': UserSerializer(sales_agents, many=True).data,
#                 'all_users': UserSerializer(all_users, many=True).data
#             })
#         elif user.role == 'SalesAgent':
#             clients = Client.objects.filter(client__role='Client', assigned_to=user.id, is_approved=False)
#             client_profiles = ClientDetailsAPISerializer(clients, many=True).data
#             data.update({
#                 'clients': client_profiles,
#             })
#         else:
#             return Response({"error": "Restricted Area"}, status=status.HTTP_404_NOT_FOUND)

#         return Response(data, status=status.HTTP_200_OK)

































































































# @permission_classes([IsAuthenticated])   old-code [Do not Delete]
# class DashboardAPIView(APIView):
#     def get(self, request):
#         user = request.user
#         if user.is_superuser or user.role == 'Admin':
#             new_clients = Client.objects.filter(assigned_to=0, is_approved=False).count()
#             clients_approved = Client.objects.filter(~Q(assigned_to=0), is_approved=True).count()
#             pending_approval = Client.objects.filter(Q(company_pan__isnull=False) &
#                                                     Q(company_pan_doc__isnull=False) &
#                                                     Q(certificate_of_incorporation_doc__isnull=False) &
#                                                     Q(company_address_doc__isnull=False) &
#                                                     Q(gstin__isnull=False),~Q(assigned_to=0), is_approved=False).count()
#             ekyc_pending = Client.objects.filter(Q(company_pan__isnull=True) |
#                                                 Q(company_pan_doc__isnull=True) |
#                                                 Q(certificate_of_incorporation_doc__isnull=True) |
#                                                 Q(company_address_doc__isnull=True) |
#                                                 Q(gstin__isnull=True)).count()
#             return Response({
#                 'new_clients': new_clients,
#                 'clients_approved': clients_approved,
#                 'pending_approval': pending_approval,
#                 'ekyc_pending': ekyc_pending
#             })
#         elif user.role == 'SalesAgent':
#             ekyc_pending = Client.objects.filter(Q(company_pan__isnull=True) |
#                                                 Q(company_pan_doc__isnull=True) |
#                                                 Q(certificate_of_incorporation_doc__isnull=True) |
#                                                 Q(company_address_doc__isnull=True) |
#                                                 Q(gstin__isnull=True), assigned_to = user.id, is_approved=False).count()
#             clients_approved = Client.objects.filter(assigned_to=user.id, is_approved=True).count()
#             pending_approval = Client.objects.filter(Q(company_pan__isnull=False) &
#                                                     Q(company_pan_doc__isnull=False) &
#                                                     Q(certificate_of_incorporation_doc__isnull=False) &
#                                                     Q(company_address_doc__isnull=False) &
#                                                     Q(gstin__isnull=False),assigned_to=user.id, is_approved=False).count()
#             return Response({
#                 'ekyc_pending': ekyc_pending,
#                 'clients_approved': clients_approved,
#                 'pending_approval': pending_approval,
#             })
#         else:
#             return Response({
#                 'message': "Restricted",})














# class LoginAPIView(APIView):
#     def post(self, request):
#         username = request.data.get('username')
#         password = request.data.get('password')

#         user = authenticate(username=username, password=password)

#         if user is not None:
#             refresh = RefreshToken.for_user(user)
#             response_data = {
#                 'refresh': str(refresh),
#                 'access': str(refresh.access_token),
#             }
            
#             return Response(response_data, status=status.HTTP_200_OK)
#         else:
#             # Invalid credentials
#             return Response({'message': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)












############--------Working function for client and client based restriction too
# @permission_classes([IsAuthenticated, HasModulePermission])
# class ClientDetailsAPIView(generics.RetrieveUpdateAPIView):
#     serializer_class = ClientDetailsAPISerializer
#     lookup_field = 'client_id'  # Assuming 'client_id' is the field to lookup by

#     def get_queryset(self):
#         client_id = self.kwargs['client_id']
#         return Client.objects.filter(client_id=client_id)

#     def retrieve(self, request, *args, **kwargs):
#         try:
#             user_instance = request.user  # Retrieve logged-in user instance
#             client_instance = self.get_queryset().first()  # Retrieve Client instance

#             # Check if the client instance exists
#             if client_instance is None:
#                 return Response({"error": "Restricted Area"}, status=404)

#             # Check if the logged-in user is the owner of the client instance
#             if user_instance.id != client_instance.client_id:
#                 return Response({"error": "You don't have permission to access this client's details."}, status=403)

#             user_serializer = UserSerializer(user_instance)
#             client_serializer = self.get_serializer(client_instance)

#             user_data = user_serializer.data
#             client_data = client_serializer.data

#             # Combine user and client data
#             combined_data = {**user_data, **client_data}

#             return Response(combined_data)
#         except Exception as e:
#             return Response({"error": str(e)}, status=500)

#     def partial_update(self, request, *args, **kwargs):
#         try:
#             client_instance = self.get_queryset().first()  # Retrieve Client instance

#             # Check if the client instance exists
#             if client_instance is None:
#                 return Response({"error": "Client not found"}, status=404)

#             serializer = self.get_serializer(client_instance, data=request.data, partial=True)
#             serializer.is_valid(raise_exception=True)
#             serializer.save()
#             return Response(serializer.data)
#         except Exception as e:
#             return Response({"error": str(e)}, status=500)
        
#     def get_module_name(self):
#         return 'ClientDetails'




















# Admin-Creation Json Example
# {
#     "username": "admin_user",
#     "password": "securepassword123",
#     "email": "admin@example.com",
#     "role": "Admin",
#     "mobile_number": "1234567890",
#     "location": "Hyderabad"
# }

# Sales-Agent Json Example
# {
#     "first_name": "John",
#     "last_name": "Doe",
#     "role": "SalesAgent",
#     "location": "Hyderabad",
#     "email": "johndoe@example.com",
#     "mobile_number": "1234567890",
#     "password": "securepassword123"
# }



# Client-Creation Json Example
# {
#     "user": {
#         "first_name": "San",
#         "last_name": "Do",
#         "role": "Client",
#         "email": "sander@example.com",
#         "mobile_number": "7890124657",
#         "password": "your@123password"
#     },
#     "client": {
#         "company_name": "Sando Company",
#         "country": "India",
#         "city": "Mumbai",
#         "address": "Gor 5 Gar",
#         "employee_count": "0-50",
#         "product": "Voice Solution"
#     }
# }












# from functools import wraps

# def permission_required(module_name, required_permission):
#     def decorator(view_func):
#         @wraps(view_func)
#         def wrapper(request, *args, **kwargs):
#             user = request.user
#             if check_module_access(user, module_name, required_permission):
#                 return view_func(request, *args, **kwargs)
#             else:
#                 # Return a response indicating permission denied
#                 return HttpResponse("Permission Denied", status=403)
#         return wrapper
#     return decorator

# # Usage:
# @permission_required(module_name='User', required_permission='read')
# def my_view(request):
#     # Your view logic
#     pass


# from django.contrib.auth.models import User
# from django.db import models
# from django.contrib.postgres.fields import JSONField

# class Role(models.Model):
#     name = models.CharField(max_length=100, unique=True)
#     access_permissions = JSONField(default=dict)
#     users = models.ManyToManyField(User, related_name='roles')

#     def __str__(self):
#         return self.name

# class Module(models.Model):
#     name = models.CharField(max_length=100, unique=True)
#     permissions = JSONField(default=dict)

#     def __str__(self):
#         return self.name

# def check_module_access(user, module_name, required_permission):
#     # Retrieve the user's roles
#     user_roles = user.roles.all()

#     # Iterate over each role to check access permissions
#     for role in user_roles:
#         # Check if the module exists and if the role has access permissions for it
#         if Module.objects.filter(name=module_name).exists() and module_name in role.access_permissions:
#             # Check if the required permission is granted to the role
#             if required_permission in role.access_permissions[module_name]:
#                 return True  # User has access permission
#     return False  # User does not have access permission

# # Example usage:
# user = User.objects.get(username='example_user')
# module_name = 'User'
# required_permission = 'read'

# if check_module_access(user, module_name, required_permission):
#     print(f"{user.username} has {required_permission} access to {module_name}.")
# else:
#     print(f"{user.username} does not have {required_permission} access to {module_name}.")










# from django.contrib.auth.models import User
# from .models import Role, Module
# from django.contrib.postgres.fields import JSONField

# class Role(models.Model):
#     name = models.CharField(max_length=100, unique=True)
#     access_permissions = JSONField(default=dict)

#     def __str__(self):
#         return self.name
    
# class Module(models.Model):
#     name = models.CharField(max_length=100, unique=True)
#     permissions = JSONField(default=dict)

#     def __str__(self):
#         return self.name

# def check_module_access(user, module_name, required_permission):
#     # Retrieve the user's roles
#     user_roles = Role.objects.filter(users=user)

#     # Iterate over each role to check access permissions
#     for role in user_roles:
#         # Check if the module exists and if the role has access permissions for it
#         if Module.objects.filter(name=module_name).exists() and module_name in role.access_permissions:
#             # Check if the required permission is granted to the role
#             if required_permission in role.access_permissions[module_name]:
#                 return True  # User has access permission
#     return False  # User does not have access permission

# # Example usage:
# user = User.objects.get(username='example_user')
# module_name = 'User'
# required_permission = 'read'

# if check_module_access(user, module_name, required_permission):
#     print(f"{user.username} has {required_permission} access to {module_name}.")
# else:
#     print(f"{user.username} does not have {required_permission} access to {module_name}.")

















# @permission_classes([IsAuthenticated,HasModulePermission])  ##v2 working
# class ClientDetailsAPIView(generics.RetrieveUpdateAPIView):
#     serializer_class = ClientDetailsAPISerializer
#     lookup_field = 'client_id'  # Assuming 'client_id' is the field to lookup by

#     def get_queryset(self):
#         client_id = self.kwargs['client_id']
#         return Client.objects.filter(client_id=client_id)

#     def retrieve(self, request, *args, **kwargs):
#         try:
#             user_instance = User.objects.get(id=kwargs['client_id'])  # Retrieve User instance
#             client_instance = self.get_queryset().first()  # Retrieve Client instance

#             user_serializer = UserSerializer(user_instance)
#             client_serializer = self.get_serializer(client_instance)

#             user_data = user_serializer.data
#             client_data = client_serializer.data

#             # Combine user and client data
#             combined_data = {**user_data, **client_data}

#             return Response(combined_data)
#         except User.DoesNotExist:
#             return Response({"error": "User not found"}, status=404)
#         except Client.DoesNotExist:
#             return Response({"error": "Client not found"}, status=404)

#     def partial_update(self, request, *args, **kwargs):
#         try:
#             client_instance = self.get_queryset().first()  # Retrieve Client instance
#             serializer = self.get_serializer(client_instance, data=request.data, partial=True)
#             serializer.is_valid(raise_exception=True)
#             serializer.save()
#             return Response(serializer.data)
#         except Client.DoesNotExist:
#             return Response({"error": "Client not found"}, status=404)
        
#     def get_module_name(self):
#         return 'ClientDetails' 

# class ClientDetailsAPIView(generics.RetrieveUpdateAPIView):
#     serializer_class = ClientDetailsAPISerializer
#     lookup_field = 'client_id'  # Assuming 'client_id' is the field to lookup by

#     def get_queryset(self):
#         client_id = self.kwargs['client_id']
#         return Client.objects.filter(client_id=client_id)

#     def retrieve(self, request, *args, **kwargs):
#         try:
#             user_instance = User.objects.get(id=kwargs['client_id'])  # Retrieve User instance
#             client_instance = self.get_queryset().first()  # Retrieve Client instance

#             user_serializer = UserSerializer(user_instance)
#             client_serializer = self.get_serializer(client_instance)

#             user_data = user_serializer.data
#             client_data = client_serializer.data

#             # Combine user and client data
#             combined_data = {**user_data, **client_data}

#             return Response(combined_data)
#         except User.DoesNotExist:
#             return Response({"error": "User not found"}, status=404)
#         except Client.DoesNotExist:
#             return Response({"error": "Client not found"}, status=404)

#     def partial_update(self, request, *args, **kwargs):
#         try:
#             client_instance = self.get_queryset().first()  # Retrieve Client instance
#             serializer = self.get_serializer(client_instance, data=request.data, partial=True)
#             serializer.is_valid(raise_exception=True)
#             serializer.save()
#             return Response(serializer.data)
#         except Client.DoesNotExist:
#             return Response({"error": "Client not found"}, status=404)








