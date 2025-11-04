"""
Payment models for KindBite application.
Comprehensive payment system with Stripe integration.
"""
from django.db import models
from django.contrib.auth import get_user_model
from apps.common.models import BaseModel

User = get_user_model()


class PaymentMethod(BaseModel):
    """
    User's payment methods (cards, etc.).
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='payment_methods'
    )
    stripe_payment_method_id = models.CharField(max_length=255, unique=True)
    card_brand = models.CharField(max_length=50, blank=True)
    card_last_four = models.CharField(max_length=4, blank=True)
    card_exp_month = models.PositiveIntegerField(blank=True, null=True)
    card_exp_year = models.PositiveIntegerField(blank=True, null=True)
    is_default = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'payment_methods'
        verbose_name = 'Payment Method'
        verbose_name_plural = 'Payment Methods'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.card_brand} ****{self.card_last_four} - {self.user.get_full_name()}"


class PaymentIntent(BaseModel):
    """
    Stripe payment intents for processing payments.
    """
    class Status(models.TextChoices):
        REQUIRES_PAYMENT_METHOD = 'requires_payment_method', 'Requires Payment Method'
        REQUIRES_CONFIRMATION = 'requires_confirmation', 'Requires Confirmation'
        REQUIRES_ACTION = 'requires_action', 'Requires Action'
        PROCESSING = 'processing', 'Processing'
        REQUIRES_CAPTURE = 'requires_capture', 'Requires Capture'
        CANCELED = 'canceled', 'Canceled'
        SUCCEEDED = 'succeeded', 'Succeeded'
        FAILED = 'failed', 'Failed'

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='payment_intents'
    )
    stripe_payment_intent_id = models.CharField(max_length=255, unique=True)
    amount = models.PositiveIntegerField(help_text='Amount in cents (UGX)')
    currency = models.CharField(max_length=3, default='ugx')
    status = models.CharField(
        max_length=30,
        choices=Status.choices,
        default=Status.REQUIRES_PAYMENT_METHOD
    )
    client_secret = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    metadata = models.JSONField(blank=True, default=dict)
    payment_method = models.ForeignKey(
        PaymentMethod,
        on_delete=models.SET_NULL,
        blank=True,
        null=True
    )

    class Meta:
        db_table = 'payment_intents'
        verbose_name = 'Payment Intent'
        verbose_name_plural = 'Payment Intents'
        ordering = ['-created_at']

    def __str__(self):
        return f"Payment Intent {self.stripe_payment_intent_id} - {self.user.get_full_name()}"


class Transaction(BaseModel):
    """
    Completed transactions.
    """
    class TransactionType(models.TextChoices):
        FOOD_PURCHASE = 'food_purchase', 'Food Purchase'
        KINDCOINS_PURCHASE = 'kindcoins_purchase', 'KindCoins Purchase'
        REFUND = 'refund', 'Refund'
        WITHDRAWAL = 'withdrawal', 'Withdrawal'

    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        COMPLETED = 'completed', 'Completed'
        FAILED = 'failed', 'Failed'
        CANCELLED = 'cancelled', 'Cancelled'
        REFUNDED = 'refunded', 'Refunded'

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='transactions'
    )
    transaction_type = models.CharField(
        max_length=20,
        choices=TransactionType.choices
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    amount = models.PositiveIntegerField(help_text='Amount in cents (UGX)')
    currency = models.CharField(max_length=3, default='ugx')
    fee_amount = models.PositiveIntegerField(
        default=0,
        help_text='Processing fee in cents'
    )
    net_amount = models.PositiveIntegerField(
        help_text='Net amount after fees in cents'
    )
    stripe_charge_id = models.CharField(max_length=255, blank=True)
    stripe_transfer_id = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    failure_reason = models.TextField(blank=True)
    metadata = models.JSONField(blank=True, default=dict)
    
    # Related objects
    payment_intent = models.OneToOneField(
        PaymentIntent,
        on_delete=models.CASCADE,
        related_name='transaction'
    )
    food_reservation = models.ForeignKey(
        'foods.FoodReservation',
        on_delete=models.SET_NULL,
        blank=True,
        null=True
    )

    class Meta:
        db_table = 'transactions'
        verbose_name = 'Transaction'
        verbose_name_plural = 'Transactions'
        ordering = ['-created_at']

    def __str__(self):
        return f"Transaction {self.id} - {self.user.get_full_name()}"


class Refund(BaseModel):
    """
    Refunds for transactions.
    """
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        SUCCEEDED = 'succeeded', 'Succeeded'
        FAILED = 'failed', 'Failed'
        CANCELED = 'canceled', 'Canceled'

    transaction = models.ForeignKey(
        Transaction,
        on_delete=models.CASCADE,
        related_name='refunds'
    )
    stripe_refund_id = models.CharField(max_length=255, unique=True)
    amount = models.PositiveIntegerField(help_text='Refund amount in cents')
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    reason = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)

    class Meta:
        db_table = 'refunds'
        verbose_name = 'Refund'
        verbose_name_plural = 'Refunds'
        ordering = ['-created_at']

    def __str__(self):
        return f"Refund {self.stripe_refund_id} - {self.transaction.user.get_full_name()}"


class KindCoinsTransaction(BaseModel):
    """
    KindCoins transactions (earned, spent, etc.).
    """
    class TransactionType(models.TextChoices):
        EARNED = 'earned', 'Earned'
        SPENT = 'spent', 'Spent'
        PURCHASED = 'purchased', 'Purchased'
        REFUNDED = 'refunded', 'Refunded'
        BONUS = 'bonus', 'Bonus'
        PENALTY = 'penalty', 'Penalty'

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='kindcoins_transactions'
    )
    transaction_type = models.CharField(
        max_length=20,
        choices=TransactionType.choices
    )
    amount = models.IntegerField(help_text='Amount of KindCoins (can be negative)')
    balance_after = models.PositiveIntegerField(
        help_text="User's balance after this transaction"
    )
    description = models.TextField(blank=True)
    metadata = models.JSONField(blank=True, default=dict)
    
    # Related objects
    food_reservation = models.ForeignKey(
        'foods.FoodReservation',
        on_delete=models.SET_NULL,
        blank=True,
        null=True
    )
    payment_transaction = models.ForeignKey(
        Transaction,
        on_delete=models.SET_NULL,
        blank=True,
        null=True
    )

    class Meta:
        db_table = 'kindcoins_transactions'
        verbose_name = 'KindCoins Transaction'
        verbose_name_plural = 'KindCoins Transactions'
        ordering = ['-created_at']

    def __str__(self):
        return f"KindCoins {self.get_transaction_type_display()} - {self.user.get_full_name()}"


class PesapalOrder(BaseModel):
    """
    Tracks Pesapal order details and status for a payment intent.
    """
    payment_intent = models.OneToOneField(
        PaymentIntent,
        on_delete=models.CASCADE,
        related_name='pesapal_order'
    )
    order_tracking_id = models.CharField(max_length=255, unique=True)
    merchant_reference = models.CharField(max_length=255)
    payment_url = models.URLField(blank=True)
    status = models.CharField(max_length=50, default='pending')
    raw_response = models.JSONField(blank=True, default=dict)

    class Meta:
        db_table = 'pesapal_orders'

    def __str__(self):
        return f"Pesapal {self.order_tracking_id} for {self.payment_intent.user.get_full_name()}"