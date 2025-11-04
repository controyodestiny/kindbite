from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ('payments', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='PesapalOrder',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('order_tracking_id', models.CharField(max_length=255, unique=True)),
                ('merchant_reference', models.CharField(max_length=255)),
                ('payment_url', models.URLField(blank=True)),
                ('status', models.CharField(max_length=50, default='pending')),
                ('raw_response', models.JSONField(blank=True, default=dict)),
                ('payment_intent', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='pesapal_order', to='payments.paymentintent')),
            ],
            options={'db_table': 'pesapal_orders'},
        ),
    ]


