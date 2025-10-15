"""
Management command to create demo food listings.
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import date, time, timedelta
from apps.foods.models import FoodListing, FoodCategory
from apps.users.models import User


class Command(BaseCommand):
    help = 'Create demo food listings for testing'

    def handle(self, *args, **options):
        self.stdout.write('Creating demo food listings...')
        
        # Get or create demo users
        try:
            restaurant_user = User.objects.get(email='restaurant@kindbite.demo')
            home_user = User.objects.get(email='home@kindbite.demo')
            factory_user = User.objects.get(email='factory@kindbite.demo')
            supermarket_user = User.objects.get(email='supermarket@kindbite.demo')
            # Use supermarket user for retail for now
            retail_user = supermarket_user
        except User.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Demo users not found. Please run create_demo_users first.')
            )
            return

        # Create food categories
        categories = [
            {'name': 'Main Course', 'emoji': '🍽️', 'description': 'Main dishes and entrees'},
            {'name': 'Bakery', 'emoji': '🍞', 'description': 'Bread, pastries, and baked goods'},
            {'name': 'Produce', 'emoji': '🥕', 'description': 'Fresh fruits and vegetables'},
            {'name': 'Desserts', 'emoji': '🍰', 'description': 'Sweet treats and desserts'},
            {'name': 'Beverages', 'emoji': '🥤', 'description': 'Drinks and beverages'},
        ]
        
        for cat_data in categories:
            category, created = FoodCategory.objects.get_or_create(
                name=cat_data['name'],
                defaults=cat_data
            )
            if created:
                self.stdout.write(f'Created category: {category.name}')

        # Demo food listings
        demo_foods = [
            {
                'provider': restaurant_user,
                'restaurant_name': "Mama's Kitchen",
                'name': 'Mixed Rice & Chicken',
                'description': 'Delicious local rice with grilled chicken and vegetables',
                'original_price': 15000,
                'discounted_price': 5000,
                'quantity': 8,
                'available_quantity': 8,
                'pickup_window_start': time(17, 0),  # 5:00 PM
                'pickup_window_end': time(19, 0),    # 7:00 PM
                'pickup_date': date.today(),
                'location': 'Kampala, Uganda',
                'distance': '0.3 km',
                'provider_type': 'restaurant',
                'dietary_info': ['Halal', 'Gluten-Free'],
                'image_emoji': '🍛',
                'co2_saved': 2.4,
                'status': 'available',
                'rating': 4.8,
                'rating_count': 12
            },
            {
                'provider': home_user,
                'restaurant_name': 'The Nakasero Home',
                'name': 'Vegetarian Combo',
                'description': 'Fresh salad, soup, and bread rolls from home kitchen',
                'original_price': 12000,
                'discounted_price': 0,
                'quantity': 12,
                'available_quantity': 12,
                'pickup_window_start': time(18, 0),  # 6:00 PM
                'pickup_window_end': time(20, 0),    # 8:00 PM
                'pickup_date': date.today(),
                'location': 'Nakasero, Kampala',
                'distance': '0.7 km',
                'provider_type': 'home',
                'dietary_info': ['Vegetarian', 'Vegan'],
                'image_emoji': '🥗',
                'co2_saved': 1.8,
                'status': 'available',
                'rating': 4.6,
                'rating_count': 8
            },
            {
                'provider': factory_user,
                'restaurant_name': 'Uganda Food Industries',
                'name': 'Bread & Pastries - End of Day',
                'description': 'Fresh bread, rolls, and pastries from today\'s production',
                'original_price': 8000,
                'discounted_price': 2000,
                'quantity': 25,
                'available_quantity': 25,
                'pickup_window_start': time(16, 0),  # 4:00 PM
                'pickup_window_end': time(18, 0),    # 6:00 PM
                'pickup_date': date.today(),
                'location': 'Industrial Area, Kampala',
                'distance': '2.1 km',
                'provider_type': 'factory',
                'dietary_info': ['Contains Gluten'],
                'image_emoji': '🍞',
                'co2_saved': 1.6,
                'status': 'available',
                'rating': 4.5,
                'rating_count': 15
            },
            {
                'provider': supermarket_user,
                'restaurant_name': 'Shoprite Kampala',
                'name': 'Fresh Produce Clearance',
                'description': 'Slightly overripe fruits and vegetables, perfect for cooking',
                'original_price': 5000,
                'discounted_price': 1500,
                'quantity': 40,
                'available_quantity': 40,
                'pickup_window_start': time(19, 0),  # 7:00 PM
                'pickup_window_end': time(21, 0),    # 9:00 PM
                'pickup_date': date.today(),
                'location': 'Acacia Mall, Kampala',
                'distance': '1.8 km',
                'provider_type': 'supermarket',
                'dietary_info': ['Organic', 'Vegetarian', 'Vegan'],
                'image_emoji': '🥕',
                'co2_saved': 2.8,
                'status': 'available',
                'rating': 4.3,
                'rating_count': 22
            },
            {
                'provider': retail_user,
                'restaurant_name': 'Corner Café & Bakery',
                'name': 'Coffee Shop Surplus',
                'description': 'Sandwiches, pastries, and salads from today\'s café service',
                'original_price': 12000,
                'discounted_price': 3000,
                'quantity': 18,
                'available_quantity': 18,
                'pickup_window_start': time(17, 30),  # 5:30 PM
                'pickup_window_end': time(19, 30),    # 7:30 PM
                'pickup_date': date.today(),
                'location': 'Kololo, Kampala',
                'distance': '0.9 km',
                'provider_type': 'retail',
                'dietary_info': ['Vegetarian Options'],
                'image_emoji': '🥪',
                'co2_saved': 2.1,
                'status': 'available',
                'rating': 4.6,
                'rating_count': 18
            }
        ]

        created_count = 0
        for food_data in demo_foods:
            food, created = FoodListing.objects.get_or_create(
                provider=food_data['provider'],
                name=food_data['name'],
                pickup_date=food_data['pickup_date'],
                defaults=food_data
            )
            if created:
                created_count += 1
                self.stdout.write(f'Created food listing: {food.name}')

        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {created_count} demo food listings')
        )
