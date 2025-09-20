# KindBite Backend API

A Django REST API backend for the KindBite food waste reduction platform.

## 🏗️ Architecture

This backend follows **Clean Architecture** principles with:

- **Domain Layer**: Models representing business entities
- **Application Layer**: Use cases and business logic
- **Interface Layer**: API endpoints and serializers
- **Infrastructure Layer**: Database, external services

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- pip
- Virtual environment (recommended)

### Installation

1. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Environment setup**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Database setup**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

6. **Run development server**
   ```bash
   python manage.py runserver
   ```

## 📁 Project Structure

```
backend/
├── kindbite/                 # Main project settings
│   ├── settings.py          # Django configuration
│   ├── urls.py              # Main URL routing
│   └── wsgi.py              # WSGI application
├── apps/                    # Application modules
│   ├── authentication/     # JWT auth system
│   ├── users/              # User management
│   └── common/             # Shared utilities
├── requirements.txt        # Python dependencies
└── manage.py              # Django management script
```

## 🔐 Authentication

The API uses **JWT (JSON Web Tokens)** for authentication:

### Endpoints

- `POST /api/v1/auth/register/` - User registration
- `POST /api/v1/auth/login/` - User login
- `POST /api/v1/auth/token/refresh/` - Refresh access token
- `POST /api/v1/auth/logout/` - User logout
- `GET /api/v1/auth/me/` - Get current user profile

### User Roles

- **Admin** - System administrator
- **End User** - Food seeker
- **Restaurant** - Food establishment
- **Home Kitchen** - Community member
- **Food Factory** - Production facility
- **Supermarket** - Large retail store
- **Retail Shop** - Small shop/café
- **Food Verifier** - Volunteer doctor
- **Food Ambassador** - Community volunteer
- **Donor/Buyer** - Financial supporter

## 📊 API Endpoints

### Authentication (`/api/v1/auth/`)
- `POST /register/` - Register new user
- `POST /login/` - Login user
- `POST /logout/` - Logout user
- `GET /me/` - Get current user
- `POST /password/change/` - Change password
- `POST /password/reset/` - Request password reset

### Users (`/api/v1/users/`)
- `GET /` - List users (filtered by role)
- `GET /{id}/` - Get user details
- `GET /me/` - Get current user profile
- `PATCH /update_me/` - Update current user
- `GET /providers/` - Get food providers
- `POST /{id}/add_kind_coins/` - Add KindCoins (admin)

## 🎯 Features

### ✅ Implemented
- JWT-based authentication
- Role-based user system
- User profile management
- Admin interface
- Clean architecture structure
- Environment-based configuration

### 🚧 Planned
- Food listing management
- Order/reservation system
- Real-time notifications
- Payment integration
- Geolocation services
- Analytics and reporting

## 🛠️ Development

### Code Style
- Follow PEP 8 guidelines
- Use descriptive variable names
- Keep functions under 50 lines
- Write docstrings for classes and functions

### Testing
```bash
python manage.py test
```

### Database Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### Admin Interface
Access at `http://localhost:8000/admin/`

## 📝 Environment Variables

Copy `env.example` to `.env` and configure:

```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DB_ENGINE=django.db.backends.sqlite3
DB_NAME=db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

## 🔒 Security

- JWT tokens with refresh mechanism
- Password hashing using Django's built-in system
- CORS protection
- SQL injection prevention through ORM
- Input validation and sanitization

## 📖 API Documentation

### Authentication Flow

1. **Register**: `POST /api/v1/auth/register/`
   ```json
   {
     "email": "user@example.com",
     "password": "password123",
     "confirm_password": "password123",
     "first_name": "John",
     "last_name": "Doe",
     "phone": "+256700123456",
     "location": "Kampala, Uganda",
     "user_role": "end-user"
   }
   ```

2. **Login**: `POST /api/v1/auth/login/`
   ```json
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```

3. **Use Token**: Include in headers
   ```
   Authorization: Bearer <access_token>
   ```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Follow code style guidelines
4. Write tests for new features
5. Submit pull request

## 📄 License

This project is part of the KindBite food waste reduction platform.

