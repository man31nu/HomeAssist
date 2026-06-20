# 🏠 HomeAssist

> **A modern home services booking platform built with Node.js, Express, MySQL, and JWT authentication.**

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey?logo=express)](https://expressjs.com)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-blue?logo=mysql)](https://mysql.com)
[![JWT](https://img.shields.io/badge/Auth-JWT-orange)](https://jwt.io)
[![License](https://img.shields.io/badge/License-MIT-purple)](LICENSE)

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Services](#services)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Database Setup](#database-setup)
- [Running the Server](#running-the-server)
- [Authentication Flow](#authentication-flow)
- [Booking Status Flow](#booking-status-flow)
- [Contributing](#contributing)
- [License](#license)

---

## About the Project

**HomeAssist** connects homeowners with trusted service professionals. Customers can search for services, place bookings with date/time/address details, track real-time status updates, and manage their service history — all through a clean REST API.

Admins get a full control panel to manage the service catalog, view all customer bookings, update booking statuses, and monitor user accounts.

---

## Services

| # | Service | Starting Price |
|---|---|---|
| 1 | 🧹 Cleaning | ₹299 |
| 2 | 🔨 Carpenter | ₹499 |
| 3 | 🔧 Plumber | ₹399 |
| 4 | ⚡ Electrician | ₹449 |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ |
| Framework | Express.js 4.x |
| Database | MySQL 8.x |
| Authentication | JWT (jsonwebtoken) |
| Password Hashing | bcrypt |
| Validation | express-validator |
| Environment | dotenv |
| Dev Tools | nodemon |

---


## Prerequisites

Before you begin, ensure the following are installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [MySQL](https://dev.mysql.com/downloads/) v8 or higher
- [npm](https://www.npmjs.com/) v9 or higher

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/homefix.git
cd homefix
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration (see [Environment Variables](#environment-variables) below).

### 4. Set Up the Database

```bash
mysql -u root -p < database/schema.sql
```

### 5. Start the Development Server

```bash
npm run dev
```

The server starts at `http://localhost:4200`.

---

## Environment Variables

Create a `.env` file in the project root:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=homefix_db
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
```

---

## API Overview

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/auth/register` |   Register new customer |
| POST | `/api/v1/auth/login` |   Login and get JWT |
| GET | `/api/v1/auth/profile` |   Get own profile |
| GET | `/api/v1/services` |  List all services |
| GET | `/api/v1/services/:id` |  Get service details |
| POST | `/api/v1/admin/services` | Admin | Create service |
| PUT | `/api/v1/admin/services/:id` | Admin | Update service |
| DELETE | `/api/v1/admin/services/:id` | Admin | Delete service |
| POST | `/api/v1/bookings` |  Create booking |
| GET | `/api/v1/bookings` |  Get my bookings |
| GET | `/api/v1/bookings/:id` |  Get booking by ID |
| PUT | `/api/v1/bookings/:id` | Update booking |
| PUT | `/api/v1/bookings/:id/cancel` |  Cancel booking |
| DELETE | `/api/v1/bookings/:id` |  Delete booking |
| GET | `/api/v1/admin/bookings` |  Admin | All bookings |
| PUT | `/api/v1/admin/bookings/:id/status` |  Admin | Update status |
| GET | `/api/v1/admin/users` |  Admin | All users |

> Full request/response details, validation rules, and OpenAPI YAML spec are in **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**.

---

## Database Setup

The `database/schema.sql` file creates the following tables:

```
users         — Customer and admin accounts
services      — Service catalog (Cleaning, Carpenter, Plumber, Electrician)
bookings      — Booking records linking users and services
```

Run it once to initialize the database and seed the four default services:

```bash
mysql -u root -p homefix_db < database/schema.sql
```

---

## Running the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

---

## Authentication Flow

```
Client                          Server
  │                               │
  │── POST /auth/register ────────►│  Hash password, save user
  │◄─ 201 { token } ─────────────│
  │                               │
  │── POST /auth/login ───────────►│  Verify credentials
  │◄─ 200 { token } ─────────────│  Sign JWT (7d expiry)
  │                               │
  │── GET /auth/profile ──────────►│  Verify JWT in Authorization header
  │   Authorization: Bearer <tok>  │
  │◄─ 200 { user data } ──────────│
```

Include the token in all protected endpoints:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Booking Status Flow

```
  [New Booking]
       │
       ▼
   PENDING  ──────────────────────────► CANCELLED
       │                                    ▲
       ▼                                    │
   ACCEPTED ───────────────────────────────┤
       │                                    │
       ▼                                    │
   ASSIGNED ───────────────────────────────┘
       │
       ▼
  IN PROGRESS
       │
       ▼
   COMPLETED
```

| Status | Triggered By |
|---|---|
| `Pending` | Auto on booking creation |
| `Accepted` | Admin |
| `Assigned` | Admin |
| `In Progress` | Admin |
| `Completed` | Admin |
| `Cancelled` | Customer (Pending/Accepted) or Admin |

---

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

*Built with ❤️ for Home Fix — making home services hassle-free.*