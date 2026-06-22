# Home Fix API Documentation

Base URL: `http://localhost:5000/api`

## Authentication (`/auth`)
- `POST /auth/register`: Register a new user (Customer, Provider, Admin)
  - Body: `{ name, email, password, role, phone, address }`
- `POST /auth/login`: Login
  - Body: `{ email, password }`
  - Returns: `{ token, user details }`

## Users (`/users`) *Requires Auth*
- `GET /users/profile`: Get logged-in user profile
- `PUT /users/profile`: Update logged-in user profile
  - Body: `{ name, phone, address, email, password }`

## Services (`/services`)
- `GET /services`: Get all services (Public)
- `GET /services/:id`: Get a specific service (Public)
- `POST /services`: Create a service (*Requires Auth, Admin*)
- `PUT /services/:id`: Update a service (*Requires Auth, Admin*)
- `DELETE /services/:id`: Delete a service (*Requires Auth, Admin*)

## Providers (`/providers`)
- `GET /providers`: Get all providers (Public)
- `GET /providers/:id`: Get a specific provider (Public)
- `POST /providers`: Create provider profile (*Requires Auth*)
- `PUT /providers/profile`: Update provider profile (*Requires Auth, Provider*)
- `PUT /providers/:id/approve`: Approve a provider (*Requires Auth, Admin*)

## Bookings (`/bookings`) *Requires Auth*
- `GET /bookings`: Get bookings (Customers see theirs, Providers see theirs, Admins see all)
- `POST /bookings`: Create a booking (Customer)
  - Body: `{ providerId, serviceId, scheduledDate, notes, address }`
- `GET /bookings/:id`: Get booking details (Must be involved party)
- `PUT /bookings/:id/status`: Update booking status
  - Body: `{ status }` ('Accepted', 'InProgress', 'Completed', 'Cancelled')

## Reviews (`/reviews`)
- `GET /reviews/provider/:providerId`: Get reviews for a provider (Public)
- `POST /reviews`: Create a review (*Requires Auth, Customer*)
  - Body: `{ bookingId, rating, comment }`

## Admin (`/admin`) *Requires Auth, Admin*
- `GET /admin/stats`: Get dashboard statistics
- `GET /admin/users`: Get list of all users
