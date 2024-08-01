from django.urls import path
from .views import *
#################

urlpatterns = [
    ##checks
    path('api/check-username/', check_username_unique, name='check_username_unique'),
    path('api/check-email/', check_email_unique, name='check_email_unique'),
    path('api/check-mobile/', check_mobile_unique, name='check_mobile_unique'),
    path('api/check-mobile/', check_mobile_unique, name='check_mobile_unique'),
    path('api/change-password/', ChangePasswordAPIView.as_view(), name='change-password'),
    path('api/create-role-user/', CreateRoleView.as_view(), name='create_role'),
    path('api/get_role_names/', get_role_names, name='get_role_names'),
    ####forgot-password
    path('api/forgot-password/', PasswordForgotRequestView.as_view(), name='forgot-password'),
    path('api/forgot-confirmpassword/<str:uidb64>/<str:token>/', PasswordForgotConfirmView.as_view(), name='password-forgot-confirm'),
    ####
    path('api/get_countries/',get_countries,name="get_countries"),
    path('api/get_products/',products,name="get_products"),
    path('api/get_employeecount/',employee_count,name="get_employeecount"),
    path('api/get_locations/',get_locations,name="get_locations"),
    ####notification
    path('api/notifications/', notification_list, name='notification_list'),
    path('api/notifications/modify/<int:notification_id>/', modify_notification, name='modify-notification'),
    path('api/notifications/delete-notifications/', delete_notifications, name='delete-notifications'),
    ####
    path('api/login/', LoginAPIView.as_view(), name='login'),
    path('api/logout/', LogoutAPIView.as_view(), name='logout'),
    path('api/dashboard/', DashboardAPIView.as_view(), name='dashboard'),
    path('api/create-aos-user/', CreateAOSAPIView.as_view(), name='create-aos-user'),
    path('api/create-client/', CreateClientAPIView.as_view(), name='create-client'),
    path('api/myprofile/',MyProfileAPIView.as_view(),name='myprofile'),
    path('api/client-details/<int:client_id>/', ClientDetailsAPIView.as_view(), name='client-details'),
    path('api/plans/',PlanAPIView.as_view(),name='plans'),
    path('api/update-plan/<int:id>/',PlanModifyAPIView.as_view(),name='update-plan'),
    path('api/userlistview/',UserListView.as_view(),name='userlistview'),
    path('api/assigntosalesagent/',AssignClientToSalesAgentAPIView.as_view(),name='assigntosalesagent'),
]
