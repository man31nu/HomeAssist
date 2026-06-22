# API Documentation

This document provides detailed information about all available backend routes, their expected request bodies, and authentication requirements.

**Base URL:** `http://localhost:5000/api`

---

## 1. Auth Routes (`/api/auth`)
Public routes for user authentication and password management.

### `POST /register`
Registers a new user (Customer or Provider).
- **Body:**
  - `name` (String, required): Full name
  - `email` (String, required): Valid email address
  - `password` (String, required): Min 6 characters
  - `role` (String, optional): `'Customer'` or `'Provider'`. Defaults to `'Customer'`.
  - `phone` (String, optional): Phone number

### `POST /login`
Authenticates a user and returns a JWT token.
- **Body:**
  - `email` (String, required)
  - `password` (String, required)

### `POST /forgot-password`
Initiates the password reset process.
- **Body:**
  - `email` (String, required)

### `POST /reset-password`
Resets a user's password using the token provided via email.
- **Body:**
  - `token` (String, required): The reset token
  - `newPassword` (String, required): Min 6 characters

---

## 2. User Routes (`/api/users`)
Routes for managing user profiles.

### `GET /profile`
Fetches the currently authenticated user's profile.
- **Auth:** Required (Any)

### `PUT /profile`
Updates the authenticated user's profile.
- **Auth:** Required (Any)
- **Body:**
  - `name` (String, optional)
  - `phone` (String, optional)
  - `email` (String, optional)
  - `password` (String, optional): New password

---

## 3. Service Routes (`/api/services`)
Routes for fetching and managing services and categories.

### `GET /categories`
Fetches all service categories.
- **Auth:** Public

### `GET /`
Fetches all services.
- **Auth:** Public

### `GET /:id`
Fetches details of a specific service by ID.
- **Auth:** Public

### `POST /`
Creates a new service.
- **Auth:** Required (Admin only)
- **Body:**
  - `title` (String, required)
  - `description` (String, optional)
  - `category_id` (Number, required)
  - `base_price` (Number, required)
  - `estimated_duration` (Number, optional): Duration in minutes

### `PUT /:id`
Updates an existing service.
- **Auth:** Required (Admin only)
- **Body:**
  - `title` (String, optional)
  - `description` (String, optional)
  - `category_id` (Number, optional)
  - `base_price` (Number, optional)
  - `estimated_duration` (Number, optional)
  - `status` (String, optional)

### `DELETE /:id`
Deletes a service.
- **Auth:** Required (Admin only)

---

## 4. Provider Routes (`/api/providers`)
Routes for managing service providers.

### `GET /`
Fetches a list of all providers.
- **Auth:** Public

### `GET /:id`
Fetches details of a specific provider.
- **Auth:** Public

### `POST /`
Registers a provider profile for the authenticated user.
- **Auth:** Required (Provider only)
- **Body:**
  - `service_id` (Number, required): ID of the service they provide
  - `experience_years` (Number, optional)
  - `skills` (String, optional)
  - `hourly_rate` (Number, optional)

### `PUT /profile`
Updates the provider profile of the authenticated user.
- **Auth:** Required (Provider only)
- **Body:**
  - `experience_years` (Number, optional)
  - `skills` (String, optional)
  - `hourly_rate` (Number, optional)
  - `service_id` (Number, optional)

### `PUT /:id/approve`
Approves/verifies a provider.
- **Auth:** Required (Admin only)

---

## 5. Booking Routes (`/api/bookings`)
Routes for creating and managing service bookings.

### `GET /`
Fetches bookings associated with the authenticated user (Customer sees theirs, Provider sees assigned/unassigned).
- **Auth:** Required (Any)

### `GET /:id`
Fetches details of a specific booking.
- **Auth:** Required (Must be Admin, or the Customer/Provider associated with the booking)

### `POST /`
Creates a new booking.
- **Auth:** Required (Customer)
- **Body:**
  - `service_id` (Number, required)
  - `scheduled_date` (Date string, required): ISO8601 format
  - `provider_id` (Number, optional)
  - `scheduled_time` (String, optional)
  - `notes` (String, optional)
  - `couponCode` (String, optional)

### `PUT /:id/status`
Updates the status of a booking.
- **Auth:** Required (Admin, or associated Provider/Customer depending on status)
- **Body:**
  - `status` (String, required): Must be one of `['pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled']`
  - `remarks` (String, optional)

---

## 6. Payment Routes (`/api/payments`)
Routes for processing payments via Razorpay or offline methods.

### `GET /`
Fetches payments associated with the authenticated user.
- **Auth:** Required (Customer sees theirs)

### `POST /`
Mocks a generic payment process (e.g. Cash).
- **Auth:** Required (Customer or Admin)
- **Body:**
  - `booking_id` (Number, required)
  - `amount` (Number, required)
  - `payment_method` (String, optional): `'upi'`, `'card'`, `'wallet'`, `'cash'` (defaults to cash)

### `POST /create-order`
Creates a Razorpay Order for a booking.
- **Auth:** Required (Customer)
- **Body:**
  - `booking_id` (Number, required)

### `POST /verify`
Verifies a Razorpay payment signature after successful client checkout.
- **Auth:** Required (Customer)
- **Body:**
  - `razorpay_order_id` (String, required)
  - `razorpay_payment_id` (String, required)
  - `razorpay_signature` (String, required)
  - `booking_id` (Number, required)

---

## 7. Review Routes (`/api/reviews`)
Routes for submitting and viewing reviews.

### `GET /provider/:providerId`
Fetches all reviews for a specific provider.
- **Auth:** Public

### `POST /`
Submits a review for a completed booking.
- **Auth:** Required (Customer)
- **Body:**
  - `bookingId` (Number, required)
  - `providerId` (Number, required)
  - `rating` (Number, required): Integer between 1 and 5
  - `comment` (String, optional)

---

## 8. Notification Routes (`/api/notifications`)
Routes for retrieving user notifications.

### `GET /`
Fetches all notifications for the authenticated user.
- **Auth:** Required (Any)

### `PUT /:id/read`
Marks a specific notification as read.
- **Auth:** Required (Any)

---

## 9. Support Ticket Routes (`/api/support-tickets`)
Routes for customer support ticketing.

### `GET /`
Fetches support tickets (Users see their own, Admins see all).
- **Auth:** Required (Any)

### `POST /`
Creates a new support ticket.
- **Auth:** Required (Any)
- **Body:**
  - `subject` (String, required)
  - `description` (String, required)

### `PUT /:id/status`
Updates the status of a support ticket.
- **Auth:** Required (Admin only)
- **Body:**
  - `status` (String, required): Must be one of `['open', 'in_progress', 'resolved', 'closed']`

---

## 10. Admin Routes (`/api/admin`)
Routes exclusively for Admin dashboard metrics.

### `GET /stats`
Fetches overall platform statistics (total users, providers, bookings, revenue).
- **Auth:** Required (Admin only)

### `GET /users`
Fetches a list of all users.
- **Auth:** Required (Admin only)

---

## 11. Upload Routes (`/api/uploads`)
Routes for handling file uploads (Cloudinary).

### `POST /`
Uploads a file via multipart form data.
- **Auth:** Required (Any)
- **Body (Multipart FormData):**
  - `file` (File, required)
  - `entity_type` (String, optional): Defaults to `'misc'`
  - `entity_id` (Number, optional)
