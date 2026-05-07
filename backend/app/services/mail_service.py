import smtplib
import logging
from email.message import EmailMessage
from typing import Optional

from app.core.config import settings

logger = logging.getLogger(__name__)


class MailService:
    def send_email(self, to_email: str, subject: str, html_content: str) -> None:
        try:
            print(f"[MAIL] Attempting to send email to {to_email}")
            print(f"[MAIL] SMTP Host: {settings.smtp_host}, User: {settings.smtp_user}")
            msg = EmailMessage()
            msg["Subject"] = subject
            msg["From"] = "cisinskijroman@gmail.com"
            msg["To"] = to_email
            msg.set_content(html_content, subtype="html")

            with smtplib.SMTP(settings.smtp_host, 587) as smtp:
                print(f"[MAIL] SMTP connection established")
                smtp.starttls()
                print(f"[MAIL] TLS enabled")
                if settings.smtp_user and settings.smtp_password:
                    print(f"[MAIL] Authenticating...")
                    smtp.login(settings.smtp_user, settings.smtp_password)
                    print(f"[MAIL] Authentication successful")
                smtp.send_message(msg)
            print(f"[MAIL] ✅ Email sent to {to_email}")
            logger.info(f"Email sent successfully to {to_email}")
        except smtplib.SMTPAuthenticationError as e:
            print(f"[MAIL] ❌ Auth failed: {e}")
            logger.error(f"SMTP Authentication failed: {str(e)}")
        except Exception as e:
            print(f"[MAIL] ❌ Error: {type(e).__name__}: {e}")
            logger.error(f"Failed to send email: {type(e).__name__}: {str(e)}")

    def send_verification_email(self, to_email: str, verification_link: Optional[str] = None) -> None:
        subject = "Verify your Personal Note Manager account"
        link = verification_link or "http://localhost:5174"
        html = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2>Welcome to Personal Note Manager!</h2>
                <p>Please verify your email address by clicking the button below:</p>
                <a href="{link}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
                    Verify Email
                </a>
                <p style="margin-top: 20px; font-size: 12px; color: #666;">
                    If you didn't create this account, please ignore this email.
                </p>
            </body>
        </html>
        """
        return self.send_email(to_email, subject, html)
