import json
import logging
from typing import Optional
from urllib import request, error

from app.core.config import settings

logger = logging.getLogger(__name__)


class MailService:
    def send_email(self, to_email: str, subject: str, html_content: str) -> None:
        try:
            print(f"[MAIL] Attempting to send email to {to_email}")
            print(f"[MAIL] Using Brevo API with sender: cisinskijroman@gmail.com")

            payload = {
                "sender": {"name": "Personal Note Manager", "email": "cisinskijroman@gmail.com"},
                "to": [{"email": to_email}],
                "subject": subject,
                "htmlContent": html_content,
            }

            req = request.Request(
                "https://api.brevo.com/v3/smtp/email",
                data=json.dumps(payload).encode("utf-8"),
                headers={
                    "accept": "application/json",
                    "content-type": "application/json",
                    "api-key": settings.smtp_password,
                },
                method="POST",
            )

            with request.urlopen(req, timeout=20) as resp:
                response_body = resp.read().decode("utf-8")
                print(f"[MAIL] ✅ Email sent to {to_email}: {response_body}")
                logger.info(f"Email sent successfully to {to_email}")
        except error.HTTPError as e:
            body = e.read().decode("utf-8", errors="ignore")
            print(f"[MAIL] ❌ Brevo API error: {e.code} {body}")
            logger.error(f"Brevo API error: {e.code} {body}")
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
