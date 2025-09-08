# 🍽️ KindBite API Documentation

## 🌐 Base URL
```
http://localhost:8000/api/
```

## 🔐 Authentication Endpoints

### User Registration
```http
POST /api/auth/register/
```
**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "confirm_password": "securepassword123",
  "first_name": "John",
  "last_name": "Doe",
  "role": "end_user",
  "phone_number": "+1234567890",
  "address": "123 Main St, City, Country"
}
```

### User Login
```http
POST /api/auth/login/
```
**Request Body:**
```json
{
  "username": "john_doe",
  "password": "securepassword123"
}
```

### User Logout
```http
POST /api/auth/logout/
```

### Get User Profile
```http
GET /api/auth/profile/
```

## 🔍 Food Search API (NEW!)

### Advanced Food Search
```http
GET /api/search/food/
```

**Query Parameters:**
- `search` - Search term for food name, description, or provider
- `category` - Food category ID
- `provider_type` - Provider type (restaurant, home_kitchen, factory, etc.)
- `max_price` - Maximum price filter
- `min_rating` - Minimum rating filter
- `dietary_tags` - Array of dietary tag IDs
- `distance_km` - Maximum distance in kilometers
- `latitude` - User's latitude
- `longitude` - User's longitude
- `sort_by` - Sort by: distance, price, rating, newest
- `page` - Page number (default: 1)
- `page_size` - Items per page (default: 20, max: 100)

**Example Request:**
```http
GET /api/search/food/?search=chicken&max_price=15&min_rating=4.0&sort_by=price&page=1&page_size=10
```

**Response:**
```json
{
  "results": [...],
  "pagination": {
    "page": 1,
    "page_size": 10,
    "total_count": 45,
    "total_pages": 5
  },
  "filters_applied": {
    "search_term": "chicken",
    "max_price": "15",
    "min_rating": "4.0",
    "sort_by": "price"
  },
  "environmental_summary": {
    "total_co2_saved_kg": 12.5,
    "total_water_saved_liters": 125.0,
    "total_packaging_reduced_kg": 3.2,
    "total_meals_available": 45,
    "estimated_trees_equivalent": 0.57
  }
}
```

## 📊 User Statistics API (NEW!)

### Get User Statistics
```http
GET /api/users/statistics/
```

**Response:**
```json
{
  "user_info": {
    "username": "john_doe",
    "role": "End User",
    "kind_coins": 150,
    "join_date": "August 15, 2025"
  },
  "total_impact": {
    "meals_saved": 25,
    "co2_saved_kg": 8.5,
    "water_saved_liters": 85.0,
    "packaging_reduced_kg": 2.1,
    "trees_equivalent": 0.39
  },
  "monthly_impact": [
    {
      "month": "August 2025",
      "meals_saved": 8,
      "co2_saved": 2.7
    }
  ],
  "ranking": {
    "position": "Top 10%",
    "total_users": 1250,
    "category": "Environmental Champion"
  },
  "achievements": [
    {
      "name": "Food Rescuer",
      "description": "Saved 10+ meals from waste",
      "icon": "🥘",
      "unlocked": true
    }
  ]
}
```

## 📈 Provider Analytics API (NEW!)

### Get Provider Analytics
```http
GET /api/providers/analytics/
```

**Response:**
```json
{
  "provider_info": {
    "business_name": "Mama's Kitchen",
    "provider_type": "Restaurant",
    "rating": 4.8,
    "total_ratings": 156
  },
  "overview": {
    "total_listings": 45,
    "active_listings": 12,
    "total_reservations": 89,
    "completed_reservations": 76,
    "completion_rate": 85.4
  },
  "environmental_impact": {
    "total_co2_saved_kg": 23.4,
    "total_water_saved_liters": 234.0,
    "total_meals_saved": 76
  },
  "daily_stats": [
    {
      "date": "2025-08-20",
      "meals_saved": 8,
      "reservations": 3
    }
  ],
  "performance_metrics": {
    "avg_rating": 4.8,
    "response_time": "2.3 hours",
    "customer_satisfaction": "95%"
  }
}
```

## 🍽️ Food Listings

### Get All Food Listings
```http
GET /api/food-listings/
```

### Get Food Listing by ID
```http
GET /api/food-listings/{id}/
```

### Create Food Listing (Providers only)
```http
POST /api/food-listings/
```

### Update Food Listing
```http
PUT /api/food-listings/{id}/
```

### Delete Food Listing
```http
DELETE /api/food-listings/{id}/
```

### Get Nearby Food Listings
```http
GET /api/food-listings/nearby/?latitude=40.7128&longitude=-74.0060&distance_km=5
```

### Get Featured Food Listings
```http
GET /api/food-listings/featured/
```

## 📅 Reservations

### Get User Reservations
```http
GET /api/reservations/
```

### Create Reservation
```http
POST /api/reservations/
```

### Update Reservation
```http
PUT /api/reservations/{id}/
```

### Cancel Reservation
```http
DELETE /api/reservations/{id}/
```

## ⭐ Reviews

### Get Reviews
```http
GET /api/reviews/
```

### Create Review
```http
POST /api/reviews/
```

### Update Review
```http
PUT /api/reviews/{id}/
```

### Delete Review
```http
DELETE /api/reviews/{id}/
```

## 🔔 Notifications

### Get User Notifications
```http
GET /api/notifications/
```

### Mark Notification as Read
```http
POST /api/notifications/{id}/mark_read/
```

### Mark All Notifications as Read
```http
POST /api/notifications/mark_all_read/
```

## 🤖 AI Chat

### Get Chat History
```http
GET /api/ai-chat/
```

### Send Message to AI
```http
POST /api/ai-chat/
```

## 🏢 Providers

### Get All Providers
```http
GET /api/providers/
```

### Get Provider by ID
```http
GET /api/providers/{id}/
```

### Create Provider Profile
```http
POST /api/providers/
```

### Get My Provider Profile
```http
GET /api/providers/my_provider/
```

## 👥 Users

### Get User Profile
```http
GET /api/users/me/
```

### Update User Profile
```http
PUT /api/users/update_profile/
```

### Get User Impact
```http
GET /api/users/impact/
```

## 📊 Dashboard

### Get Dashboard Statistics
```http
GET /api/dashboard/
```

## 🏷️ Categories & Tags

### Get Food Categories
```http
GET /api/categories/
```

### Get Dietary Tags
```http
GET /api/dietary-tags/
```

## 🔧 Error Responses

### Validation Error (400)
```json
{
  "field_name": [
    "This field is required."
  ]
}
```

### Authentication Error (401)
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### Not Found Error (404)
```json
{
  "detail": "Not found."
}
```

### Permission Error (403)
```json
{
  "detail": "You do not have permission to perform this action."
}
```

## 📝 Request Headers

For authenticated endpoints, include:
```
Authorization: Session <session_id>
Content-Type: application/json
```

## 🌍 CORS Configuration

The API supports CORS for the following origins:
- http://localhost:3000
- http://localhost:3001
- http://127.0.0.1:3000
- http://127.0.0.1:3001

## 🚀 Rate Limiting

- **Public endpoints:** 100 requests per minute
- **Authenticated endpoints:** 1000 requests per minute
- **Admin endpoints:** 5000 requests per minute

## 📚 Examples

### Complete Food Search Example
```javascript
// Search for vegetarian food under $10 within 5km
fetch('http://localhost:8000/api/search/food/?max_price=10&dietary_tags=1&distance_km=5&latitude=40.7128&longitude=-74.0060')
  .then(response => response.json())
  .then(data => {
    console.log('Found', data.results.length, 'food items');
    console.log('Environmental impact:', data.environmental_summary);
  });
```

### Create Reservation Example
```javascript
fetch('http://localhost:8000/api/reservations/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    food_listing: 1,
    quantity: 2,
    pickup_time: '2025-08-21T18:00:00Z',
    special_instructions: 'Please pack separately'
  })
});
```

## 🔐 Admin Access

Admin panel available at: `http://localhost:8000/admin/`
- **Username:** admin
- **Password:** admin123 