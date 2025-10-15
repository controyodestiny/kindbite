"""
Payment serializers for KindBite application.
Clean, secure serialization for payment data.
"""
from rest_framework import serializers
from .models import (
    PaymentMethod, PaymentIntent, Transaction, Refund, KindCoinsTransaction
)


class PaymentMethodSerializer(serializers.ModelSerializer):
    """
    Serializer for payment methods.
    """
    user_name = serializers.CharField(
        source='user.get_full_name',
        read_only=True
    )
    
    class Meta:
        model = PaymentMethod
        fields = [
            'id', 'user', 'user_name', 'stripe_payment_method_id',
            'card_brand', 'card_last_four', 'card_exp_month', 'card_exp_year',
            'is_default', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user', 'stripe_payment_method_id', 'created_at', 'updated_at'
        ]


class PaymentMethodCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating payment methods.
    """
    class Meta:
        model = PaymentMethod
        fields = ['card_brand', 'card_last_four', 'card_exp_month', 'card_exp_year']


class PaymentIntentSerializer(serializers.ModelSerializer):
    """
    Serializer for payment intents.
    """
    user_name = serializers.CharField(
        source='user.get_full_name',
        read_only=True
    )
    status_display = serializers.CharField(
        source='get_status_display',
        read_only=True
    )
    
    class Meta:
        model = PaymentIntent
        fields = [
            'id', 'user', 'user_name', 'stripe_payment_intent_id',
            'amount', 'currency', 'status', 'status_display', 'client_secret',
            'description', 'metadata', 'payment_method', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user', 'stripe_payment_intent_id', 'status', 'client_secret',
            'created_at', 'updated_at'
        ]


class PaymentIntentCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating payment intents.
    """
    class Meta:
        model = PaymentIntent
        fields = ['amount', 'currency', 'description', 'metadata']


class TransactionSerializer(serializers.ModelSerializer):
    """
    Serializer for transactions.
    """
    user_name = serializers.CharField(
        source='user.get_full_name',
        read_only=True
    )
    transaction_type_display = serializers.CharField(
        source='get_transaction_type_display',
        read_only=True
    )
    status_display = serializers.CharField(
        source='get_status_display',
        read_only=True
    )
    
    class Meta:
        model = Transaction
        fields = [
            'id', 'user', 'user_name', 'transaction_type', 'transaction_type_display',
            'status', 'status_display', 'amount', 'currency', 'fee_amount', 'net_amount',
            'stripe_charge_id', 'stripe_transfer_id', 'description', 'failure_reason',
            'metadata', 'payment_intent', 'food_reservation', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user', 'stripe_charge_id', 'stripe_transfer_id', 'failure_reason',
            'created_at', 'updated_at'
        ]


class RefundSerializer(serializers.ModelSerializer):
    """
    Serializer for refunds.
    """
    transaction_id = serializers.IntegerField(source='transaction.id', read_only=True)
    user_name = serializers.CharField(
        source='transaction.user.get_full_name',
        read_only=True
    )
    status_display = serializers.CharField(
        source='get_status_display',
        read_only=True
    )
    
    class Meta:
        model = Refund
        fields = [
            'id', 'transaction', 'transaction_id', 'user_name',
            'stripe_refund_id', 'amount', 'status', 'status_display',
            'reason', 'description', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'stripe_refund_id', 'status', 'created_at', 'updated_at'
        ]


class RefundCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating refunds.
    """
    class Meta:
        model = Refund
        fields = ['transaction', 'amount', 'reason', 'description']


class KindCoinsTransactionSerializer(serializers.ModelSerializer):
    """
    Serializer for KindCoins transactions.
    """
    user_name = serializers.CharField(
        source='user.get_full_name',
        read_only=True
    )
    transaction_type_display = serializers.CharField(
        source='get_transaction_type_display',
        read_only=True
    )
    
    class Meta:
        model = KindCoinsTransaction
        fields = [
            'id', 'user', 'user_name', 'transaction_type', 'transaction_type_display',
            'amount', 'balance_after', 'description', 'metadata',
            'food_reservation', 'payment_transaction', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user', 'balance_after', 'created_at', 'updated_at'
        ]


class PaymentStatsSerializer(serializers.Serializer):
    """
    Serializer for payment statistics.
    """
    total_transactions = serializers.IntegerField()
    total_amount = serializers.IntegerField()
    successful_transactions = serializers.IntegerField()
    failed_transactions = serializers.IntegerField()
    total_refunds = serializers.IntegerField()
    refund_amount = serializers.IntegerField()
    kindcoins_balance = serializers.IntegerField()
    kindcoins_earned = serializers.IntegerField()
    kindcoins_spent = serializers.IntegerField()
    recent_transactions = TransactionSerializer(many=True)
    recent_kindcoins_transactions = KindCoinsTransactionSerializer(many=True)
