from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from datetime import datetime
from ..core.config import get_settings

settings = get_settings()

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=int(settings.MAIL_PORT),
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=False,
    MAIL_SSL_TLS=True,
    USE_CREDENTIALS=True,
    TEMPLATE_FOLDER=settings.TEMPLATE_FOLDER,
    MAIL_FROM_NAME=settings.MAIL_FROM_NAME
)

async def send_payment_email(
    email: str,
    freelancer_name: str,
    amount: float,
    payment_method: str,
    processed_at: datetime,
    withdrawal_id: str,
    proof_of_payment: str = None,
    paypal_link: str = None,
    payoneer_email: str = None,
    wavepay_phone: str = None,
    kpay_phone: str = None,
    bank_name: str = None,
    account_holder_name: str = None,
    account_number: str = None,
):
    """
    Sends a payment processed email using the provided details.
    """
    try:
        template_body = {
            "freelancer_name": freelancer_name,
            "amount": amount,
            "payment_method": payment_method,
            "processed_at": processed_at.strftime("%Y-%m-%d %H:%M:%S"),
            "withdrawal_id": withdrawal_id,
            "proof_of_payment": proof_of_payment,
            "paypal_link": paypal_link,
            "payoneer_email": payoneer_email,
            "wavepay_phone": wavepay_phone,
            "kpay_phone": kpay_phone,
            "bank_name": bank_name,
            "account_holder_name": account_holder_name,
            "account_number": account_number,
        }

        message = MessageSchema(
            subject="Payment Processed Successfully",
            recipients=[email],
            template_body=template_body,
            subtype="html"
        )

        fm = FastMail(conf)
        await fm.send_message(message, template_name="payment_processed.html")

    except Exception as e:
        print("Email sending failed:", e)


async def send_appeal_accept_email(
    email: str,
    freelancer_name: str,
    source_language_name: str,
    target_language_name: str,
):
    """
    Sends an appeal acceptance email to the freelancer.
    """
    try:
        template_body = {
            "freelancer_name": freelancer_name,
            "source_language_name": source_language_name,
            "target_language_name": target_language_name,
        }

        message = MessageSchema(
            subject="Appeal Accepted",
            recipients=[email],
            template_body=template_body,
            subtype="html"
        )

        fm = FastMail(conf)
        await fm.send_message(message, template_name="appeal_accept.html")

    except Exception as e:
        print("Email sending failed:", e)



async def send_payment_request_email(
    freelancer_name: str,
    payment_method: str,
    amount: float,
    admin_email: str = settings.ADMIN_EMAIL,
):
    """
    Sends a payment request email to the admin.
    """
    try:
        template_body = {
            "freelancer_name": freelancer_name,
            "payment_method": payment_method,
            "amount": amount,
        }

        message = MessageSchema(
            subject="New Payment Request",
            recipients=[admin_email],
            template_body=template_body,
            subtype="html",
        )

        fm = FastMail(conf)
        await fm.send_message(message, template_name="payment_request.html")

    except Exception as e:
        print(f"Email sending failed: {e}")



async def send_issue_report_email(
    freelancer_name: str,
    issue_type: str,
    reported_at: str,
    admin_email: str = settings.ADMIN_EMAIL,
):
    """
    Sends an issue report email to the admin
    """
    try:
        template_body = {
            "freelancer_name": freelancer_name,
            "issue_type": issue_type,
            "reported_at": reported_at
        }

        message = MessageSchema(
            subject=f"New Issue Reported: {issue_type}",
            recipients=[admin_email],
            template_body=template_body,
            subtype="html",
        )

        fm = FastMail(conf)
        await fm.send_message(message, template_name="issue_report_email.html")

    except Exception as e:
        print(f"Failed to send issue email: {e}")

async def send_issue_resolution_email(
    email: str,
    freelancer_name: str,
    issue_type: str,
    decision: bool,
    admin_comment: str = None,
    added_min: int = None,
    resolution_details: str = None
):
    """
    Sends issue resolution email to freelancer
    """
    try:
        template_body = {
            "freelancer_name": freelancer_name,
            "issue_type": issue_type,
            "decision": decision,
            "admin_comment": admin_comment,
            "added_min": added_min,
            "resolution_details": resolution_details
        }

        subject = f"[{'Approved' if decision else 'Rejected'}] {issue_type.replace('_', ' ').title()} Resolution"

        message = MessageSchema(
            subject=subject,
            recipients=[email],
            template_body=template_body,
            subtype="html",
        )

        fm = FastMail(conf)
        await fm.send_message(message, template_name="issue_resolution_email.html")
        print(f"Resolution email sent to {email}")

    except Exception as e:
        print(f"Failed to send resolution email: {e}")


async def send_assessment_result_email(
    email: str,
    freelancer_name: str,
    source_language_name: str,
    target_language_name: str,
):
    """
    Sends an assessment result email to the freelancer.
    """
    try:
        template_body = {
            "freelancer_name": freelancer_name,
            "source_language_name": source_language_name,
            "target_language_name": target_language_name,
        }

        message = MessageSchema(
            subject="Assessment Review Result",
            recipients=[email],
            template_body=template_body,
            subtype="html"
        )

        fm = FastMail(conf)
        await fm.send_message(message, template_name="assessment_review_result.html")

    except Exception as e:
        print("Email sending failed:", e)