import time
import requests
from django.conf import settings


class PesapalClient:
    def __init__(self):
        self.base_url = settings.PESAPAL.get('BASE_URL', 'https://pay.pesapal.com/v3')
        self.consumer_key = settings.PESAPAL.get('CONSUMER_KEY')
        self.consumer_secret = settings.PESAPAL.get('CONSUMER_SECRET')
        self.callback_url = settings.PESAPAL.get('CALLBACK_URL')
        self.ipn_id = settings.PESAPAL.get('IPN_ID')
        self._token = None
        self._token_expiry = 0

    def _get_token(self) -> str:
        if self._token and time.time() < self._token_expiry:
            return self._token
        url = f"{self.base_url}/api/Auth/RequestToken"
        resp = requests.post(url, json={
            'consumer_key': self.consumer_key,
            'consumer_secret': self.consumer_secret,
        }, timeout=20)
        resp.raise_for_status()
        data = resp.json()
        self._token = data.get('token')
        # expires_in returned in seconds; refresh 60s early
        self._token_expiry = time.time() + max(0, int(data.get('expires_in', 1800)) - 60)
        return self._token

    def _headers(self) -> dict:
        return {
            'Authorization': f"Bearer {self._get_token()}",
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }

    def register_ipn(self, url: str) -> dict:
        resp = requests.post(
            f"{self.base_url}/api/URLSetup/RegisterIPN",
            headers=self._headers(),
            json={'url': url, 'ipn_notification_type': 'GET'},
            timeout=20,
        )
        resp.raise_for_status()
        return resp.json()

    def create_order(self, amount: float, currency: str, description: str, merchant_reference: str, customer: dict) -> dict:
        payload = {
            'id': merchant_reference,
            'currency': currency.upper(),
            'amount': amount,
            'description': description[:250],
            'callback_url': self.callback_url,
            'notification_id': self.ipn_id or '',
            'billing_address': {
                'email_address': customer.get('email', ''),
                'phone_number': customer.get('phone_number', ''),
                'country_code': customer.get('country_code', 'KE'),
                'first_name': customer.get('first_name', ''),
                'last_name': customer.get('last_name', ''),
                'line_1': customer.get('line_1', ''),
                'city': customer.get('city', ''),
                'state': customer.get('state', ''),
                'postal_code': customer.get('postal_code', ''),
                'zip_code': customer.get('zip_code', ''),
            },
        }
        resp = requests.post(
            f"{self.base_url}/api/Transactions/SubmitOrderRequest",
            headers=self._headers(),
            json=payload,
            timeout=30,
        )
        resp.raise_for_status()
        return resp.json()

    def get_transaction_status(self, order_tracking_id: str) -> dict:
        resp = requests.get(
            f"{self.base_url}/api/Transactions/GetTransactionStatus?orderTrackingId={order_tracking_id}",
            headers=self._headers(),
            timeout=20,
        )
        resp.raise_for_status()
        return resp.json()


