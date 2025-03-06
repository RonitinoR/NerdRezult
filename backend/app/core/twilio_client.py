from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class TwilioService:
    def __init__(self):
        self.client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        self.verify = self.client.verify.v2.services(settings.TWILIO_VERIFY_SID)

    async def send_verification(self, phone_number: str) -> bool:
        """Send verification code to phone number"""
        try:
            verification = self.verify.verifications.create(
                to=phone_number,
                channel="sms"
            )
            logger.info(f"Verification sent to {phone_number}: {verification.status}")
            return verification.status == "pending"
        except TwilioRestException as e:
            logger.error(f"Twilio error: {str(e)}")
            if e.code == 60200:
                raise ValueError("Invalid phone number format")
            elif e.code == 60203:
                raise ValueError("Too many attempts. Please try again later")
            raise ValueError("Failed to send verification code")

    async def check_verification(self, phone_number: str, code: str) -> bool:
        """Verify the code sent to phone number"""
        try:
            verification_check = self.verify.verification_checks.create(
                to=phone_number,  # This should be in E.164 format (+1XXXXXXXXXX)
                code=code
            )
            logger.info(f"Verification check response: {verification_check.status}")
            return verification_check.status == "approved"
        except TwilioRestException as e:
            logger.error(f"Twilio error: {str(e)}")
            if e.code == 60200:
                raise ValueError("Invalid phone number")
            elif e.code == 60202:
                raise ValueError("Invalid verification code")
            elif e.code == 60203:
                raise ValueError("Max check attempts reached")
            raise ValueError(f"Verification failed: {str(e)}")

twilio_service = TwilioService()
