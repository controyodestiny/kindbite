# API URL Verification - Backend vs Frontend

## ✅ VERIFIED - All URLs Match Correctly

### Base URL
- **Backend**: `/api/`
- **Frontend**: `https://kindbite.pythonanywhere.com/api`
- ✅ **MATCH**

---

## 1. AUTHENTICATION (`/api/auth/`)

| Endpoint | Backend | Frontend | Status |
|----------|---------|----------|--------|
| Login | `/api/auth/login/` | `/auth/login/` | ✅ |
| Register | `/api/auth/register/` | `/auth/register/` | ✅ |
| Logout | `/api/auth/logout/` | `/auth/logout/` | ✅ |
| Token Refresh | `/api/auth/token/refresh/` | `/auth/token/refresh/` | ✅ |
| Status | `/api/auth/status/` | `/auth/status/` | ✅ |
| Me | `/api/auth/me/` | `/auth/me/` | ✅ |
| Change Password | `/api/auth/change-password/` | `/auth/change-password/` | ✅ |
| Google Auth URL | `/api/auth/google/auth-url/` | `/auth/google/auth-url/` | ✅ |
| Google Callback | `/api/auth/google/callback/` | `/auth/google/callback/` | ✅ |

---

## 2. USERS (`/api/users/`)

| Endpoint | Backend | Frontend | Status |
|----------|---------|----------|--------|
| List Users | `/api/users/list/` | `/users/list/` | ✅ |
| User Detail | `/api/users/<id>/` | `/users/${id}/` | ✅ |
| My Profile | `/api/users/profile/` | `/users/profile/` | ✅ |
| Update Profile | `/api/users/profile/update/` | `/users/profile/update/` | ✅ |

---

## 3. FOODS (`/api/foods/`)

| Endpoint | Backend | Frontend | Status |
|----------|---------|----------|--------|
| Listings (List) | `/api/foods/listings/` | `/foods/listings/` | ✅ |
| Listing Detail | `/api/foods/listings/<id>/` | `/foods/listings/${id}/` | ✅ |
| Create Listing | `/api/foods/listings/` | `/foods/listings/` | ✅ |
| Update Listing | `/api/foods/listings/<id>/` | `/foods/listings/${id}/` | ✅ |
| Delete Listing | `/api/foods/listings/<id>/` | `/foods/listings/${id}/` | ✅ |
| Available Listings | `/api/foods/listings/available/` | `/foods/listings/available/` | ✅ |
| Reservations | `/api/foods/reservations/` | `/foods/reservations/` | ✅ |
| My Reservations | `/api/foods/reservations/my/` | `/foods/reservations/my/` | ✅ |
| Update Reservation Status | `/api/foods/reservations/<id>/status/` | `/foods/reservations/${id}/status/` | ✅ |
| Stats | `/api/foods/stats/` | `/foods/stats/` | ✅ |
| Upload Image | `/api/foods/images/<id>/upload/` | `/foods/images/${id}/upload/` | ✅ |
| Delete Image | `/api/foods/images/<id>/delete/` | `/foods/images/${id}/delete/` | ✅ |

---

## 4. AI CHAT (`/api/ai-chat/`)

| Endpoint | Backend | Frontend | Status |
|----------|---------|----------|--------|
| Sessions | `/api/ai-chat/sessions/` | `/ai-chat/sessions/` | ✅ |
| New Session | `/api/ai-chat/sessions/new/` | `/ai-chat/sessions/new/` | ✅ |
| Session Detail | `/api/ai-chat/sessions/<id>/` | `/ai-chat/sessions/${id}/` | ✅ |
| Send Message | `/api/ai-chat/send/` | `/ai-chat/send/` | ✅ |
| Message Feedback | `/api/ai-chat/messages/<id>/feedback/` | `/ai-chat/messages/${id}/feedback/` | ✅ |
| Stats | `/api/ai-chat/stats/` | `/ai-chat/stats/` | ✅ |

---

## 5. NOTIFICATIONS (`/api/notifications/`)

| Endpoint | Backend | Frontend | Status |
|----------|---------|----------|--------|
| List | `/api/notifications/list/` | `/notifications/list/` | ✅ |
| Detail | `/api/notifications/list/<id>/` | `/notifications/list/${id}/` | ✅ |
| Mark Read | `/api/notifications/list/<id>/mark_as_read/` | `/notifications/list/${id}/mark_as_read/` | ✅ |
| Mark All Read | `/api/notifications/list/mark_all_as_read/` | `/notifications/list/mark_all_as_read/` | ✅ |
| Unread | `/api/notifications/list/unread/` | `/notifications/list/unread/` | ✅ |
| Stats | `/api/notifications/list/stats/` | `/notifications/list/stats/` | ✅ |
| Preferences | `/api/notifications/preferences/` | `/notifications/preferences/` | ✅ |
| Update Preferences | `/api/notifications/preferences/update/` | `/notifications/preferences/update/` | ✅ |
| Send | `/api/notifications/send/` | `/notifications/send/` | ✅ |
| Templates | `/api/notifications/templates/` | `/notifications/templates/` | ✅ |

---

## 6. PAYMENTS (`/api/payments/`)

| Endpoint | Backend | Frontend | Status |
|----------|---------|----------|--------|
| Methods | `/api/payments/methods/` | `/payments/methods/` | ✅ |
| Method Detail | `/api/payments/methods/<id>/` | `/payments/methods/${id}/` | ✅ |
| Set Default | `/api/payments/methods/<id>/set_default/` | `/payments/methods/${id}/set_default/` | ✅ |
| Deactivate | `/api/payments/methods/<id>/deactivate/` | `/payments/methods/${id}/deactivate/` | ✅ |
| Intents | `/api/payments/intents/` | `/payments/intents/` | ✅ |
| Intent Detail | `/api/payments/intents/<id>/` | `/payments/intents/${id}/` | ✅ |
| Confirm | `/api/payments/intents/<id>/confirm/` | `/payments/intents/${id}/confirm/` | ✅ |
| Create Intent | `/api/payments/create-intent/` | `/payments/create-intent/` | ✅ |
| Process | `/api/payments/process/` | `/payments/process/` | ✅ |
| Transactions | `/api/payments/transactions/` | `/payments/transactions/` | ✅ |
| Transaction Detail | `/api/payments/transactions/<id>/` | `/payments/transactions/${id}/` | ✅ |
| Refunds | `/api/payments/refunds/` | `/payments/refunds/` | ✅ |
| Refund Detail | `/api/payments/refunds/<id>/` | `/payments/refunds/${id}/` | ✅ |
| Create Refund | `/api/payments/create-refund/` | `/payments/create-refund/` | ✅ |
| Stats | `/api/payments/stats/` | `/payments/stats/` | ✅ |
| KindCoins | `/api/payments/kindcoins/` | `/payments/kindcoins/` | ✅ |
| KindCoins Transactions | `/api/payments/kindcoins/transactions/` | `/payments/kindcoins/transactions/` | ✅ |
| Pesapal Initiate | `/api/payments/pesapal/initiate/` | `/payments/pesapal/initiate/` | ✅ |
| Pesapal IPN | `/api/payments/pesapal/ipn/` | `/payments/pesapal/ipn/` | ✅ |
| Pesapal Status | `/api/payments/pesapal/status/<id>/` | `/payments/pesapal/status/${id}/` | ✅ |

---

## ✅ SUMMARY

**All API endpoints are correctly aligned between backend and frontend!**

The only issue was the BASE_URL which has been fixed:
- **Before**: `https://kindbite.pythonanywhere.com/api/v1` ❌
- **After**: `https://kindbite.pythonanywhere.com/api` ✅

All endpoints will now resolve correctly!

