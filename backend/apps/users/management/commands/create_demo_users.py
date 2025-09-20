"""
Django management command to create demo users for KindBite.
"""
from django.core.management.base import BaseCommand
from apps.users.models import User, UserProfile, BusinessProfile


class Command(BaseCommand):
    help = 'Create demo users for KindBite application'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing demo users first',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('🗑️  Clearing existing demo users...')
            User.objects.filter(email__contains='@kindbite.demo').delete()

        self.stdout.write('👥 Creating demo users...')

        demo_users = [
            {
                'email': 'admin@kindbite.demo',
                'password': 'admin123',
                'first_name': 'System',
                'last_name': 'Admin',
                'user_role': User.UserRole.ADMIN,
                'phone': '+256700000001',
                'location': 'Kampala, Uganda',
                'is_staff': True,
                'is_superuser': True,
                'kind_coins': 1000,
            },
            {
                'email': 'restaurant@kindbite.demo',
                'password': 'demo123',
                'first_name': 'John',
                'last_name': 'Restaurant',
                'user_role': User.UserRole.RESTAURANT,
                'business_name': "Mama's Kitchen",
                'phone': '+256700000002',
                'location': 'Kampala, Uganda',
                'kind_coins': 340,
                'is_verified': True,
            },
            {
                'email': 'factory@kindbite.demo',
                'password': 'demo123',
                'first_name': 'Sarah',
                'last_name': 'Factory',
                'user_role': User.UserRole.FACTORY,
                'business_name': 'Uganda Food Industries',
                'phone': '+256700000003',
                'location': 'Kampala, Uganda',
                'kind_coins': 2840,
                'is_verified': True,
            },
            {
                'email': 'home@kindbite.demo',
                'password': 'demo123',
                'first_name': 'Mary',
                'last_name': 'Home',
                'user_role': User.UserRole.HOME,
                'business_name': 'The Nakasero Home',
                'phone': '+256700000004',
                'location': 'Kampala, Uganda',
                'kind_coins': 340,
                'is_verified': True,
            },
            {
                'email': 'user@kindbite.demo',
                'password': 'demo123',
                'first_name': 'Roshni',
                'last_name': 'L.',
                'user_role': User.UserRole.END_USER,
                'phone': '+256700000005',
                'location': 'Kampala, Uganda',
                'kind_coins': 245,
            },
            {
                'email': 'supermarket@kindbite.demo',
                'password': 'demo123',
                'first_name': 'David',
                'last_name': 'Manager',
                'user_role': User.UserRole.SUPERMARKET,
                'business_name': 'Shoprite Kampala',
                'phone': '+256700000006',
                'location': 'Kampala, Uganda',
                'kind_coins': 1560,
                'is_verified': True,
            },
            {
                'email': 'verifier@kindbite.demo',
                'password': 'demo123',
                'first_name': 'Dr. Alice',
                'last_name': 'Verifier',
                'user_role': User.UserRole.VERIFIER,
                'phone': '+256700000007',
                'location': 'Kampala, Uganda',
                'kind_coins': 150,
                'is_verified': True,
            },
            {
                'email': 'ambassador@kindbite.demo',
                'password': 'demo123',
                'first_name': 'James',
                'last_name': 'Ambassador',
                'user_role': User.UserRole.AMBASSADOR,
                'phone': '+256700000008',
                'location': 'Kampala, Uganda',
                'kind_coins': 320,
                'is_verified': True,
            },
        ]

        created_count = 0
        for user_data in demo_users:
            email = user_data['email']
            
            if User.objects.filter(email=email).exists():
                self.stdout.write(f'⚠️  User {email} already exists, skipping...')
                continue

            user = User.objects.create_user(
                email=user_data['email'],
                password=user_data['password'],
                first_name=user_data['first_name'],
                last_name=user_data['last_name'],
                user_role=user_data['user_role'],
                phone=user_data['phone'],
                location=user_data['location'],
                business_name=user_data.get('business_name', ''),
                kind_coins=user_data.get('kind_coins', 0),
                is_verified=user_data.get('is_verified', False),
                is_staff=user_data.get('is_staff', False),
                is_superuser=user_data.get('is_superuser', False),
            )

            # Create user profile
            UserProfile.objects.create(
                user=user,
                bio=f"Demo {user.get_user_role_display()} for KindBite testing",
                total_meals_saved=user_data.get('kind_coins', 0) // 10,
                total_co2_saved=user_data.get('kind_coins', 0) * 0.05,
                total_water_saved=user_data.get('kind_coins', 0) * 0.8,
            )

            # Create business profile for business users
            if user.is_business_user:
                BusinessProfile.objects.create(
                    user=user,
                    business_description=f"Demo {user.business_name} for testing KindBite platform",
                    business_address=f"{user.location} - Demo Address",
                    business_phone=user.phone,
                    business_email=user.email,
                    operating_hours={
                        'monday': {'open': '08:00', 'close': '18:00'},
                        'tuesday': {'open': '08:00', 'close': '18:00'},
                        'wednesday': {'open': '08:00', 'close': '18:00'},
                        'thursday': {'open': '08:00', 'close': '18:00'},
                        'friday': {'open': '08:00', 'close': '18:00'},
                        'saturday': {'open': '09:00', 'close': '16:00'},
                        'sunday': {'closed': True},
                    }
                )

            created_count += 1
            self.stdout.write(f'✅ Created {user.get_user_role_display()}: {email}')

        self.stdout.write('')
        self.stdout.write(f'🎉 Successfully created {created_count} demo users!')
        self.stdout.write('')
        self.stdout.write('📝 Demo Login Credentials:')
        self.stdout.write('=' * 40)
        for user_data in demo_users:
            role = User.UserRole(user_data['user_role']).label
            self.stdout.write(f'{role:15} | {user_data["email"]:25} | demo123')
        self.stdout.write('')
        self.stdout.write('🚀 You can now test the API with these accounts!')

