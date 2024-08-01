from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.utils.html import strip_tags

def send_client_welcome(user):
    name = f"{user.first_name} {user.last_name}"
    email = user.email
    subject = f"Flexydial - Welcomes you {name}"
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [email]

    # Render the HTML content from template with context data
    html_content = render_to_string("email_templates/welcome_email.html", {
        'name': name,
        'email': email,
        # Add other context variables you want to pass to the template here
    })

    # Strip the HTML tags to generate text content for non-HTML email clients
    text_content = strip_tags(html_content)

    # Create EmailMultiAlternatives object and attach both text and HTML content
    msg = EmailMultiAlternatives(subject, text_content, from_email, recipient_list)
    msg.attach_alternative(html_content, "text/html")

    # Send email
    msg.send()


def send_client_welcome(user):
    name = f"{user.first_name} {user.last_name}"
    email = user.email
    subject = f"Flexydial - Welcomes you {name}"
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [email]

    # Render the HTML content from template with context data
    html_content = render_to_string("email_templates/welcome_email.html", {
        'name': name,
        'email': email,
        # Add other context variables you want to pass to the template here
    })

    # Strip the HTML tags to generate text content for non-HTML email clients
    text_content = strip_tags(html_content)

    # Create EmailMultiAlternatives object and attach both text and HTML content
    msg = EmailMultiAlternatives(subject, text_content, from_email, recipient_list)
    msg.attach_alternative(html_content, "text/html")

    # Send email
    msg.send()

def send_email_notification(notification):
    user = notification.user
    name = f"{user.first_name} {user.last_name}"
    email = user.email
    subject = "New Notification"
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [email]

    # Render the HTML content from template with context data
    html_content = render_to_string("email_templates/notification_email.html", {
        'name': name,
        'message': notification.message,
        'notification_time': notification.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
        # Add other context variables you want to pass to the template here
    })

    # Strip the HTML tags to generate text content for non-HTML email clients
    text_content = strip_tags(html_content)

    # Create EmailMultiAlternatives object and attach both text and HTML content
    msg = EmailMultiAlternatives(subject, text_content, from_email, recipient_list)
    msg.attach_alternative(html_content, "text/html")

    # Send email
    msg.send()
