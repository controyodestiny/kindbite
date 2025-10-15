"""
Payment views for KindBite application.
Clean, secure payment management endpoints.
"""
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import ListAPIView, CreateAPIView
from django.db.models import Sum, Count
from django.utils import timezone

from .models import (
    PaymentMethod, PaymentIntent, Transaction, Refund, KindCoinsTransaction
)
from .serializers import (
    PaymentMethodSerializer, PaymentMethodCreateSerializer,
    PaymentIntentSerializer, PaymentIntentCreateSerializer,
    TransactionSerializer, RefundSerializer, RefundCreateSerializer,
    KindCoinsTransactionSerializer, PaymentStatsSerializer
)


class PaymentMethodViewSet(ModelViewSet):
    """
    ViewSet for managing payment methods.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Get payment methods for the current user."""
        return PaymentMethod.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'create':
            return PaymentMethodCreateSerializer
        return PaymentMethodSerializer
    
    def perform_create(self, serializer):
        """Set the user to current user when creating."""
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def set_default(self, request, pk=None):
        """Set payment method as default."""
        payment_method = self.get_object()
        
        # Remove default from other payment methods
        PaymentMethod.objects.filter(
            user=request.user,
            is_default=True
        ).update(is_default=False)
        
        # Set this one as default
        payment_method.is_default = True
        payment_method.save()
        
        return Response({'message': 'Payment method set as default'})
    
    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        """Deactivate payment method."""
        payment_method = self.get_object()
        payment_method.is_active = False
        payment_method.save()
        return Response({'message': 'Payment method deactivated'})


class PaymentIntentViewSet(ModelViewSet):
    """
    ViewSet for managing payment intents.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Get payment intents for the current user."""
        return PaymentIntent.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'create':
            return PaymentIntentCreateSerializer
        return PaymentIntentSerializer
    
    def perform_create(self, serializer):
        """Set the user to current user when creating."""
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Confirm payment intent."""
        payment_intent = self.get_object()
        
        # TODO: Implement Stripe payment confirmation
        # For now, just update status
        payment_intent.status = 'succeeded'
        payment_intent.save()
        
        return Response({'message': 'Payment intent confirmed'})


class TransactionViewSet(ModelViewSet):
    """
    ViewSet for managing transactions.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TransactionSerializer
    
    def get_queryset(self):
        """Get transactions for the current user."""
        return Transaction.objects.filter(user=self.request.user)


class RefundViewSet(ModelViewSet):
    """
    ViewSet for managing refunds.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Get refunds for the current user's transactions."""
        return Refund.objects.filter(transaction__user=self.request.user)
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'create':
            return RefundCreateSerializer
        return RefundSerializer


class KindCoinsTransactionView(ListAPIView):
    """
    View for listing KindCoins transactions.
    """
    serializer_class = KindCoinsTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Get KindCoins transactions for the current user."""
        return KindCoinsTransaction.objects.filter(user=self.request.user)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_payment_intent(request):
    """
    Create a new payment intent.
    """
    serializer = PaymentIntentCreateSerializer(data=request.data)
    
    if serializer.is_valid():
        # TODO: Implement Stripe payment intent creation
        # For now, create a mock payment intent
        payment_intent = PaymentIntent.objects.create(
            user=request.user,
            stripe_payment_intent_id=f"pi_mock_{timezone.now().timestamp()}",
            client_secret=f"pi_mock_{timezone.now().timestamp()}_secret",
            **serializer.validated_data
        )
        
        return Response(
            PaymentIntentSerializer(payment_intent).data,
            status=status.HTTP_201_CREATED
        )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def process_payment(request):
    """
    Process a payment.
    """
    payment_intent_id = request.data.get('payment_intent_id')
    payment_method_id = request.data.get('payment_method_id')
    
    if not payment_intent_id or not payment_method_id:
        return Response(
            {'error': 'payment_intent_id and payment_method_id are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        payment_intent = PaymentIntent.objects.get(
            id=payment_intent_id,
            user=request.user
        )
        payment_method = PaymentMethod.objects.get(
            id=payment_method_id,
            user=request.user
        )
    except (PaymentIntent.DoesNotExist, PaymentMethod.DoesNotExist):
        return Response(
            {'error': 'Payment intent or method not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # TODO: Implement actual Stripe payment processing
    # For now, create a mock transaction
    transaction = Transaction.objects.create(
        user=request.user,
        transaction_type='food_purchase',
        status='completed',
        amount=payment_intent.amount,
        currency=payment_intent.currency,
        fee_amount=0,
        net_amount=payment_intent.amount,
        stripe_charge_id=f"ch_mock_{timezone.now().timestamp()}",
        description=payment_intent.description,
        payment_intent=payment_intent
    )
    
    # Update payment intent status
    payment_intent.status = 'succeeded'
    payment_intent.payment_method = payment_method
    payment_intent.save()
    
    return Response(
        TransactionSerializer(transaction).data,
        status=status.HTTP_201_CREATED
    )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_refund(request):
    """
    Create a refund for a transaction.
    """
    serializer = RefundCreateSerializer(data=request.data)
    
    if serializer.is_valid():
        transaction = serializer.validated_data['transaction']
        
        # Check if user owns the transaction
        if transaction.user != request.user:
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # TODO: Implement Stripe refund creation
        # For now, create a mock refund
        refund = Refund.objects.create(
            transaction=transaction,
            stripe_refund_id=f"re_mock_{timezone.now().timestamp()}",
            **serializer.validated_data
        )
        
        return Response(
            RefundSerializer(refund).data,
            status=status.HTTP_201_CREATED
        )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def payment_stats(request):
    """
    Get payment statistics for the current user.
    """
    user = request.user
    
    # Transaction stats
    transactions = Transaction.objects.filter(user=user)
    total_transactions = transactions.count()
    total_amount = transactions.aggregate(total=Sum('amount'))['total'] or 0
    successful_transactions = transactions.filter(status='completed').count()
    failed_transactions = transactions.filter(status='failed').count()
    
    # Refund stats
    refunds = Refund.objects.filter(transaction__user=user)
    total_refunds = refunds.count()
    refund_amount = refunds.aggregate(total=Sum('amount'))['total'] or 0
    
    # KindCoins stats
    kindcoins_transactions = KindCoinsTransaction.objects.filter(user=user)
    kindcoins_balance = user.kind_coins
    kindcoins_earned = kindcoins_transactions.filter(
        transaction_type='earned'
    ).aggregate(total=Sum('amount'))['total'] or 0
    kindcoins_spent = abs(kindcoins_transactions.filter(
        transaction_type='spent'
    ).aggregate(total=Sum('amount'))['total'] or 0)
    
    # Recent transactions
    recent_transactions = transactions[:10]
    recent_kindcoins_transactions = kindcoins_transactions[:10]
    
    stats_data = {
        'total_transactions': total_transactions,
        'total_amount': total_amount,
        'successful_transactions': successful_transactions,
        'failed_transactions': failed_transactions,
        'total_refunds': total_refunds,
        'refund_amount': refund_amount,
        'kindcoins_balance': kindcoins_balance,
        'kindcoins_earned': kindcoins_earned,
        'kindcoins_spent': kindcoins_spent,
        'recent_transactions': TransactionSerializer(recent_transactions, many=True).data,
        'recent_kindcoins_transactions': KindCoinsTransactionSerializer(
            recent_kindcoins_transactions, many=True
        ).data
    }
    
    serializer = PaymentStatsSerializer(stats_data)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def kindcoins_balance(request):
    """
    Get current user's KindCoins balance.
    """
    return Response({
        'balance': request.user.kind_coins,
        'user': request.user.get_full_name()
    })
