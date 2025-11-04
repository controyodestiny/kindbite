"""
Payment URL patterns for KindBite application.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create router for ViewSets
router = DefaultRouter()
router.register(r'methods', views.PaymentMethodViewSet, basename='paymentmethod')
router.register(r'intents', views.PaymentIntentViewSet, basename='paymentintent')
router.register(r'transactions', views.TransactionViewSet, basename='transaction')
router.register(r'refunds', views.RefundViewSet, basename='refund')

urlpatterns = [
    # Include ViewSet routes
    path('', include(router.urls)),
    
    # Additional endpoints
    path('create-intent/', views.create_payment_intent, name='create-payment-intent'),
    path('process/', views.process_payment, name='process-payment'),
    path('create-refund/', views.create_refund, name='create-refund'),
    path('stats/', views.payment_stats, name='payment-stats'),
    path('kindcoins/', views.kindcoins_balance, name='kindcoins-balance'),
    path('kindcoins/transactions/', views.KindCoinsTransactionView.as_view(), name='kindcoins-transactions'),
    # Pesapal
    path('pesapal/initiate/', views.pesapal_initiate, name='pesapal-initiate'),
    path('pesapal/ipn/', views.pesapal_ipn, name='pesapal-ipn'),
    path('pesapal/status/<str:order_tracking_id>/', views.pesapal_status, name='pesapal-status'),
]
