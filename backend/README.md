# QR Ordering System - Backend API

Node.js + Express backend API for QR-based food ordering with JWT authentication, order management, and real-time updates via Socket.IO.

## Tech Stack

Node.js | Express v5 | MySQL | Sequelize | JWT | Socket.IO | Swagger

## Quick Start

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   ```bash
   cp .env.example .env
   ```

   Update `.env` with your database credentials and JWT secret.

3. **Setup database**

   ```bash
   mysql -u root -p -e "CREATE DATABASE mini-qr-ordering;"
   mysql -u root -p mini-qr-ordering < database.sql
   npm run seed
   ```

4. **Run**
   ```bash
   npm run dev  # Development with nodemon
   npm start    # Production
   ```

API available at `http://localhost:5000` | Docs at `http://localhost:5000/api-docs`

## Key Features

- **Authentication**: JWT with refresh tokens, role-based access (Admin/User)
- **Products**: Full CRUD with categories, images, and availability
- **Orders**: Dine-in/takeout, multiple payment methods, status tracking
- **Real-time**: Socket.IO for live order notifications to admin

## API Endpoints

| Category     | Endpoint                  | Method          | Auth  |
| ------------ | ------------------------- | --------------- | ----- |
| **Auth**     | `/accounts/authenticate`  | POST            | -     |
|              | `/accounts/register`      | POST            | -     |
|              | `/accounts/refresh-token` | POST            | -     |
| **Products** | `/products`               | GET             | -     |
|              | `/products`               | POST/PUT/DELETE | Admin |
| **Orders**   | `/orders`                 | GET/POST        | User  |
|              | `/orders/:id`             | PUT/DELETE      | Admin |
| **Static**   | `/images/:filename`       | GET             | -     |

Full API documentation at `/api-docs`

## Project Structure

```
backend/
├── accounts/          # Authentication & user management
├── orders/            # Order & order items management
├── products/          # Product management
├── _helpers/          # Database, roles, utilities
├── _middleware/       # Auth, validation, error handling
├── seeds/             # Database seeders
└── server.js          # Entry point
```

## Environment Variables

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=mini-qr-ordering
JWT_SECRET=your_secret_key
PORT=5000
FRONTEND_URL=http://localhost:3000
```

## Troubleshooting

**Database connection fails**: Check MySQL is running and credentials in `.env`  
**Port in use**: Change `PORT` in `.env`  
**Seeds fail**: Ensure database exists and is empty
