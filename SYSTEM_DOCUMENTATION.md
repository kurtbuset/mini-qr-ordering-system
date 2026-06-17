# Mini QR Ordering System - System Documentation

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Getting Started](#getting-started)
5. [Backend API](#backend-api)
6. [Frontend Application](#frontend-application)
7. [Database Schema](#database-schema)
8. [Real-time Features](#real-time-features)
9. [Authentication & Authorization](#authentication--authorization)
10. [Deployment](#deployment)
11. [Development Guide](#development-guide)
12. [API Documentation](#api-documentation)

---

## 🎯 System Overview

The **Mini QR Ordering System** is a full-stack web application designed for restaurant and food service businesses to manage orders through QR code scanning. The system provides:

- **Customer-facing ordering interface** with QR code menu access
- **Admin dashboard** for order management and analytics
- **Real-time order notifications** using WebSocket technology
- **Complete product catalog management**
- **Payment tracking and order history**
- **User authentication with role-based access control**

### Key Features

- 📱 Mobile-first responsive design
- 🔔 Real-time order notifications
- 🛒 Shopping cart with persistent state
- 📊 Analytics dashboard for business insights
- 🔐 Secure authentication with JWT
- 💳 Payment status tracking
- 📦 Order status management
- 🎨 Modern UI with TailwindCSS

---

## 🏗️ Architecture

The system follows a **three-tier architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
│  - Port: 3000                                               │
│  - Vite + React 19 + TypeScript                            │
│  - TailwindCSS for styling                                 │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                Backend API (Node.js + Express)              │
│  - Port: 5000                                               │
│  - REST API + WebSocket (Socket.IO)                        │
│  - JWT Authentication                                       │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   Database (MySQL 8.0)                      │
│  - Port: 3306                                               │
│  - Sequelize ORM                                            │
│  - phpMyAdmin (Port: 8080)                                 │
└─────────────────────────────────────────────────────────────┘
```

### Container Architecture (Docker)

- **4 Docker containers** orchestrated with Docker Compose:
  1. `qr_ordering_mysql` - MySQL database
  2. `qr_ordering_phpmyadmin` - Database management UI
  3. `qr_ordering_backend` - Node.js API server
  4. `qr_ordering_frontend` - React application

---

## 💻 Technology Stack

### Backend

| Technology | Version | Purpose                               |
| ---------- | ------- | ------------------------------------- |
| Node.js    | Latest  | Runtime environment                   |
| Express.js | ^5.2.1  | Web framework                         |
| MySQL      | 8.0     | Relational database                   |
| Sequelize  | ^6.37.8 | ORM for database operations           |
| Socket.IO  | ^4.8.3  | Real-time bidirectional communication |
| JWT        | ^9.0.3  | Authentication tokens                 |
| Bcrypt.js  | ^3.0.3  | Password hashing                      |
| Joi        | ^18.2.1 | Request validation                    |
| Nodemailer | ^8.0.11 | Email notifications                   |
| Swagger UI | ^5.0.1  | API documentation                     |
| CORS       | ^2.8.6  | Cross-origin resource sharing         |

### Frontend

| Technology       | Version | Purpose                     |
| ---------------- | ------- | --------------------------- |
| React            | ^19.0.0 | UI library                  |
| TypeScript       | ~5.7.2  | Type safety                 |
| Vite             | ^6.1.0  | Build tool & dev server     |
| TailwindCSS      | ^4.0.8  | Utility-first CSS framework |
| React Router     | ^7.1.5  | Client-side routing         |
| Zustand          | ^5.0.14 | State management            |
| Socket.IO Client | ^4.8.3  | Real-time client            |
| ApexCharts       | ^4.1.0  | Data visualization          |
| QRCode.react     | ^4.2.0  | QR code generation          |
| Lucide React     | ^1.18.0 | Icon library                |
| React DnD        | ^16.0.1 | Drag-and-drop functionality |

### DevOps & Tools

- **Docker** & **Docker Compose** - Containerization
- **phpMyAdmin** - Database management
- **ESLint** - Code linting
- **Nodemon** - Development auto-reload

---

## 🚀 Getting Started

### Prerequisites

- Docker & Docker Compose installed
- Node.js 18+ (for local development)
- Git

### Installation & Setup

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd minQROrderingSystem
```

#### 2. Environment Configuration

**Backend** (`backend/.env`):

```env
# Database Configuration
DB_HOST=mysql
DB_PORT=3306
DB_USER=root
DB_PASS=password
DB_NAME=mini-qr-ordering

# JWT Secret
JWT_SECRET=YOUR_SECRET_KEY_HERE

# Application
APP_NAME=Mini QR Ordering System Backend
PORT=5000
NODE_ENV=development

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000

# Email Configuration (optional)
EMAIL_FROM=noreply@example.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
```

**Frontend** (`frontend/.env`):

```env
VITE_API_URL=http://localhost:5000
```

#### 3. Start with Docker Compose

```bash
docker-compose up -d
```

This will:

- Start MySQL database on port 3306
- Start phpMyAdmin on port 8080
- Start Backend API on port 5000
- Start Frontend on port 3000
- Automatically run database migrations and seeds

#### 4. Access the Application

| Service           | URL                            | Credentials                |
| ----------------- | ------------------------------ | -------------------------- |
| Frontend          | http://localhost:3000          | See default accounts below |
| Backend API       | http://localhost:5000          | -                          |
| API Documentation | http://localhost:5000/api-docs | -                          |
| phpMyAdmin        | http://localhost:8080          | root / password            |

**Default Admin Account** (created by seeds):

- Email: `admin@example.com`
- Password: `Admin123!`

#### 5. Manual Installation (Without Docker)

**Backend:**

```bash
cd backend
npm install
npm run setup      # Initialize database
npm run seed       # Seed initial data
npm run dev        # Start development server
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev        # Start development server
```

---

## 🔌 Backend API

### Project Structure

```
backend/
├── accounts/              # User account management
│   ├── account.model.js
│   ├── account.service.js
│   ├── accounts.controller.js
│   └── refresh-token.model.js
├── orders/                # Order management
│   ├── order.model.js
│   ├── order-items.model.js
│   ├── order.service.js
│   └── order.controller.js
├── products/              # Product catalog
│   ├── product.model.js
│   ├── product.service.js
│   └── product.controller.js
```

├── \_helpers/ # Utility functions
│ ├── db.js # Database connection
│ ├── role.js # Role definitions
│ ├── send-email.js # Email service
│ └── swagger.js # API documentation setup
├── \_middleware/ # Express middleware
│ ├── authorize.js # JWT authorization
│ ├── error-handler.js # Global error handling
│ └── validate-request.js # Request validation
├── scripts/ # Database scripts
│ ├── setup.js # Database initialization
│ ├── resetDb.js # Database reset
│ └── addPaymentFields.js # Migration scripts
├── seeds/ # Seed data
│ ├── index.js
│ ├── productSeeds.js
│ └── runSeeds.js
├── images/ # Product images
├── server.js # Main application entry
├── swagger.yaml # OpenAPI specification
├── .env # Environment variables
└── package.json

```

### Core API Endpoints

#### Authentication (`/accounts`)
- `POST /accounts/register` - Register new user
- `POST /accounts/authenticate` - Login
- `POST /accounts/refresh-token` - Refresh JWT token
- `POST /accounts/revoke-token` - Revoke refresh token
- `POST /accounts/verify-email` - Verify email address
- `POST /accounts/forgot-password` - Request password reset
- `POST /accounts/reset-password` - Reset password
- `GET /accounts` - Get all accounts (Admin only)
- `GET /accounts/:id` - Get account by ID
- `PUT /accounts/:id` - Update account
- `DELETE /accounts/:id` - Delete account
```

#### Products (`/products`)

- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product (Admin only)
- `PUT /products/:id` - Update product (Admin only)
- `DELETE /products/:id` - Delete product (Admin only)

#### Orders (`/orders`)

- `GET /orders` - Get all orders (Admin: all)
- `GET /orders/:id` - Get order by ID
- `POST /orders` - Create new order
- `PUT /orders/:id` - Update order status (Admin only)
- `DELETE /orders/:id` - Delete order (Admin only)
- `GET /orders/user/:userId` - Get orders by user

### Database Models

#### Account Model

```javascript
{
  id: INTEGER (Primary Key),
  email: STRING (Unique),
  passwordHash: STRING,
  firstName: STRING,
  lastName: STRING,
  role: ENUM ['Admin', 'User'],
  verificationToken: STRING,
  verified: DATE,
  resetToken: STRING,
  resetTokenExpires: DATE,
  passwordReset: DATE,
  created: DATE,
  updated: DATE
}
```

#### Product Model

```javascript
{
  id: INTEGER (Primary Key),
  name: STRING,
  description: TEXT,
  price: DECIMAL(10,2),
  category: STRING,
  imageUrl: STRING,
  isAvailable: BOOLEAN,
  created: DATE,
  updated: DATE
}
```

#### Order Model

```javascript
{
  id: INTEGER (Primary Key),
  userId: INTEGER (Foreign Key → Account),
  tableNumber: STRING,
  totalAmount: DECIMAL(10,2),
  status: ENUM ['pending', 'complete', 'cancelled'],
  paymentStatus: ENUM ["pending", "completed", "cancelled"],
  paymentMethod: ENUM ["debit_card", "credit_card", "pay_at_counter"],
  notes: TEXT,
  created: DATE,
  updated: DATE
}
```

#### OrderItem Model

```javascript
{
  id: INTEGER (Primary Key),
  orderId: INTEGER (Foreign Key → Order),
  productId: INTEGER (Foreign Key → Product),
  quantity: INTEGER,
  price: DECIMAL(10,2),
  subtotal: DECIMAL(10,2),
  created: DATE,
  updated: DATE
}
```

#### RefreshToken Model

```javascript
{
  id: INTEGER (Primary Key),
  accountId: INTEGER (Foreign Key → Account),
  token: STRING (Unique),
  expires: DATE,
  created: DATE,
  createdByIp: STRING,
  revoked: DATE,
  revokedByIp: STRING,
  replacedByToken: STRING
}
```

---

## 🎨 Frontend Application

### Project Structure

```
frontend/src/
├── components/          # Reusable components
│   ├── auth/           # Authentication components
│   ├── cart/           # Shopping cart
│   ├── dashboard/      # Dashboard widgets
│   ├── order/          # Order components
│   ├── payment/        # Payment components
│   ├── products/       # Product displays
│   └── ui/             # UI primitives
```

├── pages/ # Page components
│ ├── AuthPages/ # Login, Register, etc.
│ ├── Dashboard/ # Admin dashboard
│ ├── Orders/ # Order management
│ ├── Products/ # Product management
│ └── GenerateQR/ # QR code generator
├── services/ # API service layer
│ ├── apiClient.ts # Axios instance
│ ├── authService.ts # Auth API calls
│ ├── orderService.ts # Order API calls
│ └── productService.ts # Product API calls
├── store/ # State management (Zustand)
│ ├── authStore.ts # Authentication state
│ └── toastStore.ts # Toast notifications
├── context/ # React Context providers
│ ├── CartContext.tsx # Shopping cart state
│ ├── ThemeContext.tsx # Theme settings
│ └── SidebarContext.tsx # Sidebar state
├── hooks/ # Custom React hooks
│ ├── useAuthInit.ts # Auth initialization
│ ├── useModal.ts # Modal management
│ └── usePagination.ts # Pagination logic
├── types/ # TypeScript definitions
│ ├── account.ts
│ ├── cart.ts
│ ├── order.ts
│ ├── product.ts
│ └── role.ts
├── layout/ # Layout components
│ ├── AppLayout.tsx # Main layout wrapper
│ ├── AppHeader.tsx # Header/navbar
│ └── AppSidebar.tsx # Sidebar navigation
├── App.tsx # Root component
└── main.tsx # Application entry

````

### Key Features Implementation

#### 1. State Management (Zustand)
```typescript
// Authentication Store
const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  login: (userData) => set({ user: userData, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false })
}));
````

#### 2. Shopping Cart (Context API)

- Persistent cart state across sessions
- Add/remove items
- Update quantities
- Calculate totals
- Clear cart

#### 3. Real-time Updates (Socket.IO)

```typescript
// Connect to WebSocket
const socket = io(API_URL);

// Listen for new orders
socket.on("newOrder", (order) => {
  // Update UI with new order
});

// Listen for order status updates
socket.on("orderStatusUpdate", (data) => {
  // Update order status in real-time
});
```

#### 4. Protected Routes

```typescript
// Admin-only routes
<Route element={<ProtectedRoute requiredRole="Admin" />}>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/products/manage" element={<ProductManagement />} />
  <Route path="/orders/manage" element={<OrderManagement />} />
</Route>
```

### Pages Overview

| Page            | Route              | Access        | Description                |
| --------------- | ------------------ | ------------- | -------------------------- |
| Login           | `/auth/login`      | Public        | User authentication        |
| Register        | `/auth/register`   | Public        | New user registration      |
| Products        | `/products`        | Public        | Browse product catalog     |
| Cart            | `/cart`            | Public        | Shopping cart              |
| Checkout        | `/checkout`        | Authenticated | Order placement            |
| Dashboard       | `/dashboard`       | Admin         | Analytics & overview       |
| Manage Orders   | `/orders/manage`   | Admin         | All orders management      |
| Manage Products | `/products/manage` | Admin         | Product CRUD operations    |
| Generate QR     | `/generate-qr`     | Admin         | Create QR codes for tables |

---

## 🗄️ Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐          ┌─────────────────┐
│    Accounts     │          │  RefreshTokens  │
├─────────────────┤          ├─────────────────┤
│ id (PK)         │◄────────┤ accountId (FK)  │
│ email           │          │ token           │
│ passwordHash    │          │ expires         │
│ firstName       │          │ revoked         │
│ lastName        │          └─────────────────┘
│ role            │
│ verified        │
│ verificationToken│
└────────┬────────┘
         │
         │ 1:N
         │
         ▼
┌─────────────────┐          ┌─────────────────┐
│     Orders      │          │   OrderItems    │
├─────────────────┤   1:N    ├─────────────────┤
│ id (PK)         │◄────────┤ orderId (FK)    │
│ userId (FK)     │          │ productId (FK)  │
│ tableNumber     │          │ quantity        │
│ totalAmount     │          │ price           │
│ status          │          │ subtotal        │
│ paymentStatus   │          └────────┬────────┘
│ paymentMethod   │                   │
│ notes           │                   │ N:1
└─────────────────┘                   │
                                      ▼
                              ┌─────────────────┐
                              │    Products     │
                              ├─────────────────┤
                              │ id (PK)         │
                              │ name            │
                              │ description     │
                              │ price           │
                              │ category        │
                              │ imageUrl        │
                              │ isAvailable     │
                              └─────────────────┘
```

### Database Indexes

- `accounts.email` - Unique index for fast user lookup
- `orders.userId` - Foreign key index
- `orders.status` - Index for filtering orders by status
- `orderItems.orderId` - Foreign key index
- `orderItems.productId` - Foreign key index
- `products.category` - Index for category filtering
- `refreshTokens.token` - Unique index for token validation

---

## ⚡ Real-time Features

### WebSocket Events (Currently Implemented)

#### Server → Client Events

```javascript
// New order notification (broadcasted to ALL connected clients)
io.emit('newOrder', {
  id: 123,
  userId: 1,
  tableNumber: 'T-5',
  totalAmount: 45.50,
  status: 'pending',
  items: [...],
  created: '2024-01-01T12:00:00Z'
});
```

**Note:** Currently, the system broadcasts new orders to ALL connected clients. No room-based filtering or additional events are implemented yet.

### Implementation Details

**Backend (server.js):**

```javascript
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});
```

**Backend (orders/order.controller.js):**

```javascript
// When new order is created
const io = req.app.get("io");
if (io) {
  io.emit("newOrder", order);
  console.log("New order emitted:", order.id);
}
```

**Frontend (pages/Orders/Orders.tsx):**

```typescript
useEffect(() => {
  const socket = io(API_URL);

  socket.on("newOrder", (newOrder: Order) => {
    console.log("New order received:", newOrder);
    // Only add if it's a pending order
    if (newOrder.status === "pending") {
      setOrders((prev) => [newOrder, ...prev]);
    }
  });

  return () => socket.disconnect();
}, []);
```

### Future Enhancements

The current implementation is basic. Consider adding:

- Room-based broadcasting (admin room vs customer rooms)
- Order status update events (`orderStatusUpdate`)
- Payment confirmation events (`paymentConfirmed`)
- User-specific notifications
- `joinAdminRoom` event for admin-only broadcasts
- `subscribeToOrder` event for order-specific updates

---

## 🔐 Authentication & Authorization

### Authentication Flow

```
1. User Registration
   ↓
2. Email Verification (optional)
   ↓
3. Login → JWT Token + Refresh Token
   ↓
4. Access Protected Resources
   ↓
5. Token Refresh (when JWT expires)
```

### JWT Token Structure

```javascript
{
  sub: userId,           // Subject (user ID)
  role: 'Admin' | 'User', // User role
  iat: timestamp,        // Issued at
  exp: timestamp         // Expiration (15 minutes)
}
```

### Role-Based Access Control (RBAC)

#### User Roles

- **Admin**: Full system access
  - Manage products (CRUD)
  - View all orders
  - Update order status
  - Access analytics dashboard
  - Manage users

- **User**: Customer access
  - Browse products
  - Place orders
  - View own orders
  - Update profile

#### Authorization Middleware

```javascript
// Authorize by role
const authorize = (roles = []) => {
  return [
    expressJwt({ secret, algorithms: ["HS256"] }),
    async (req, res, next) => {
      const account = await Account.findByPk(req.auth.sub);

      if (!account || (roles.length && !roles.includes(account.role))) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      req.user = account;
      next();
    },
  ];
};

// Usage
router.post("/products", authorize(["Admin"]), createProduct);
```

### Security Features

- Password hashing with bcrypt (10 salt rounds)
- HTTP-only cookies for refresh tokens
- CSRF protection via cookie settings
- Input validation with Joi
- SQL injection prevention (Sequelize parameterized queries)
- XSS protection (Express built-in)
- Rate limiting (optional, recommended for production)

---

## 🚢 Deployment

### Production Checklist

#### Environment Variables

```bash
# Backend Production .env
NODE_ENV=production
PORT=5000
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASS=your-secure-password
DB_NAME=production_db
JWT_SECRET=your-very-long-and-random-secret-key
FRONTEND_URL=https://your-domain.com

# Email (Production SMTP)
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-email-password
EMAIL_FROM=noreply@your-domain.com
```

#### Docker Production Build

```bash
# Build optimized images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose logs -f
```

#### Security Hardening

1. **Change default credentials**
   - Database passwords
   - Admin account password
   - JWT secret

2. **Enable HTTPS**
   - Use reverse proxy (Nginx/Caddy)
   - SSL/TLS certificates (Let's Encrypt)

3. **Database Security**
   - Don't expose port 3306 publicly
   - Use internal Docker network
   - Regular backups

4. **Rate Limiting**

   ```javascript
   import rateLimit from "express-rate-limit";

   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100, // limit each IP to 100 requests per windowMs
   });

   app.use("/api/", limiter);
   ```

5. **Helmet.js** (Security headers)
   ```javascript
   import helmet from "helmet";
   app.use(helmet());
   ```

---

## 👨‍💻 Development Guide

### Running Development Servers

#### With Docker (Recommended)

```bash
# Start all services
docker-compose up

# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart specific service
docker-compose restart backend

# Stop all services
docker-compose down

# Rebuild after changes
docker-compose up --build
```

#### Without Docker

**Backend:**

```bash
cd backend
npm install
npm run setup      # First time only
npm run seed       # Seed initial data
npm run dev        # Start with nodemon
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev        # Start Vite dev server
```

### Available Scripts

#### Backend Scripts

```bash
npm start          # Production server
npm run dev        # Development with nodemon
npm run seed       # Run database seeds
npm run reset-db   # Reset database
npm run setup      # Initialize database
npm run migrate:payment  # Run payment migration
```

#### Frontend Scripts

```bash
npm run dev        # Development server (port 5173)
npm run build      # Production build
npm run lint       # Run ESLint
npm run preview    # Preview production build
```

### Database Management

#### Reset Database

```bash
cd backend
npm run reset-db
npm run seed
```

#### Add New Migration

```javascript
// backend/scripts/yourMigration.js
import { db } from "../_helpers/db.js";

async function migrate() {
  await db.sequelize.query(`
    ALTER TABLE orders ADD COLUMN newField VARCHAR(255);
  `);
}

migrate().then(() => process.exit());
```

#### Create Seed Data

```javascript
// backend/seeds/yourSeeds.js
export async function seedYourData() {
  const data = [
    /* your seed data */
  ];
  await YourModel.bulkCreate(data);
}
```

---

### Adding New Features

#### 1. Add New API Endpoint

**Create Model** (`backend/yourFeature/yourModel.model.js`):

```javascript
import { DataTypes } from "sequelize";
import { db } from "../_helpers/db.js";

const YourModel = db.sequelize.define("YourModel", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default YourModel;
```

**Create Service** (`backend/yourFeature/yourService.js`):

```javascript
import YourModel from "./yourModel.model.js";

export default {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function getAll() {
  return await YourModel.findAll();
}

async function getById(id) {
  return await YourModel.findByPk(id);
}

async function create(params) {
  return await YourModel.create(params);
}

async function update(id, params) {
  const record = await getById(id);
  Object.assign(record, params);
  await record.save();
  return record;
}

async function _delete(id) {
  const record = await getById(id);
  await record.destroy();
}
```

**Create Controller** (`backend/yourFeature/yourController.js`):

```javascript
import express from "express";
import Joi from "joi";
import validateRequest from "../_middleware/validate-request.js";
import authorize from "../_middleware/authorize.js";
import yourService from "./yourService.js";
import Role from "../_helpers/role.js";

const router = express.Router();

router.get("/", authorize(), getAll);
router.get("/:id", authorize(), getById);
router.post("/", authorize(Role.Admin), createSchema, create);
router.put("/:id", authorize(Role.Admin), updateSchema, update);
router.delete("/:id", authorize(Role.Admin), _delete);

export default router;

function getAll(req, res, next) {
  yourService
    .getAll()
    .then((items) => res.json(items))
    .catch(next);
}

function getById(req, res, next) {
  yourService
    .getById(req.params.id)
    .then((item) => res.json(item))
    .catch(next);
}

function createSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function create(req, res, next) {
  yourService
    .create(req.body)
    .then(() => res.json({ message: "Created successfully" }))
    .catch(next);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().empty(""),
  });
  validateRequest(req, next, schema);
}

function update(req, res, next) {
  yourService
    .update(req.params.id, req.body)
    .then(() => res.json({ message: "Updated successfully" }))
    .catch(next);
}

function _delete(req, res, next) {
  yourService
    .delete(req.params.id)
    .then(() => res.json({ message: "Deleted successfully" }))
    .catch(next);
}
```

**Register in server.js**:

```javascript
import yourController from "./yourFeature/yourController.js";
app.use("/your-endpoint", yourController);
```

---

#### 2. Add New Frontend Page

**Create Type** (`frontend/src/types/yourType.ts`):

```typescript
export interface YourType {
  id: number;
  name: string;
  created: Date;
  updated: Date;
}
```

**Create Service** (`frontend/src/services/yourService.ts`):

```typescript
import apiClient from "./apiClient";
import { YourType } from "../types/yourType";

export const yourService = {
  getAll: async (): Promise<YourType[]> => {
    const response = await apiClient.get("/your-endpoint");
    return response.data;
  },

  getById: async (id: number): Promise<YourType> => {
    const response = await apiClient.get(`/your-endpoint/${id}`);
    return response.data;
  },

  create: async (data: Partial<YourType>): Promise<YourType> => {
    const response = await apiClient.post("/your-endpoint", data);
    return response.data;
  },

  update: async (id: number, data: Partial<YourType>): Promise<YourType> => {
    const response = await apiClient.put(`/your-endpoint/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/your-endpoint/${id}`);
  },
};
```

**Create Page Component** (`frontend/src/pages/YourPage.tsx`):

```typescript
import { useState, useEffect } from 'react';
import { yourService } from '../services/yourService';
import { YourType } from '../types/yourType';

export default function YourPage() {
  const [items, setItems] = useState<YourType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await yourService.getAll();
      setItems(data);
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Your Page</h1>
      {items.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

**Add Route** (`frontend/src/App.tsx`):

```typescript
import YourPage from './pages/YourPage';

// Inside Router
<Route path="/your-page" element={<YourPage />} />
```

---

## 📚 API Documentation

The system includes **Swagger UI** for interactive API documentation.

**Access:** http://localhost:5000/api-docs

### API Response Format

#### Success Response

```json
{
  "data": { ... },
  "message": "Success message"
}
```

#### Error Response

```json
{
  "message": "Error message",
  "errors": ["Validation error 1", "Validation error 2"]
}
```

### Common HTTP Status Codes

- `200` - OK (Success)
- `201` - Created
- `400` - Bad Request (Validation error)
- `401` - Unauthorized (Not authenticated)
- `403` - Forbidden (Not authorized)
- `404` - Not Found
- `500` - Internal Server Error

### Authentication Headers

All protected endpoints require JWT token:

```
Authorization: Bearer <your-jwt-token>
```

### Example API Calls

#### Register User

```bash
curl -X POST http://localhost:5000/accounts/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "Password123!",
    "confirmPassword": "Password123!"
  }'
```

#### Login

```bash
curl -X POST http://localhost:5000/accounts/authenticate \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin123!"
  }'
```

#### Get Products

```bash
curl -X GET http://localhost:5000/products
```

#### Create Order

```bash
curl -X POST http://localhost:5000/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "tableNumber": "T-5",
    "items": [
      {
        "productId": 1,
        "quantity": 2
      }
    ],
    "paymentMethod": "cash"
  }'
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Database Connection Failed

**Symptom:** Backend can't connect to MySQL

```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Solutions:**

- Check if MySQL container is running: `docker-compose ps`
- Verify database credentials in `.env`
- Wait for MySQL to be healthy: `docker-compose logs mysql`
- Restart backend: `docker-compose restart backend`

#### 2. Port Already in Use

**Symptom:** Port conflict error

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**

- Check what's using the port: `netstat -ano | findstr :3000` (Windows)
- Stop the process or change the port in `docker-compose.yml`
- Use different ports in environment variables

#### 3. Frontend Can't Connect to Backend

**Symptom:** API calls fail with network error

**Solutions:**

- Verify backend is running: `curl http://localhost:5000/health`
- Check `VITE_API_URL` in frontend `.env`
- Check CORS settings in backend `server.js`
- Verify network connectivity between containers

#### 4. JWT Token Expired

**Symptom:** 401 Unauthorized on API calls

**Solutions:**

- Call `/accounts/refresh-token` endpoint
- Re-login to get new token
- Check JWT_SECRET matches between sessions

#### 5. Docker Volume Issues

**Symptom:** Database data not persisting

**Solutions:**

```bash
# Remove volumes and recreate
docker-compose down -v
docker-compose up -d
```

#### 6. Node Modules Issues

**Symptom:** Module not found errors

**Solutions:**

```bash
# Rebuild containers
docker-compose down
docker-compose up --build

# Or manually:
cd backend && npm install
cd frontend && npm install
```

---

## 📝 Testing

### Manual Testing Checklist

#### Authentication

- [ ] User registration
- [ ] Email verification
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Token refresh
- [ ] Password reset flow
- [ ] Logout

#### Products

- [ ] View product list
- [ ] View product details
- [ ] Filter by category
- [ ] Search products
- [ ] Admin: Create product
- [ ] Admin: Update product
- [ ] Admin: Delete product

#### Orders

- [ ] Add items to cart
- [ ] Update cart quantities
- [ ] Remove items from cart
- [ ] Place order
- [ ] View order history
- [ ] Admin: View all orders
- [ ] Admin: Update order status
- [ ] Real-time order notifications

#### UI/UX

- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Dark/light theme toggle
- [ ] Form validation
- [ ] Error handling
- [ ] Loading states
- [ ] Toast notifications

---

## 🚀 Performance Optimization

### Backend Optimizations

1. **Database Indexing**
   - Add indexes on frequently queried columns
   - Use composite indexes for multi-column queries

2. **Query Optimization**

   ```javascript
   // Use include for eager loading
   const orders = await Order.findAll({
     include: [{ model: OrderItem, include: [Product] }, { model: Account }],
   });
   ```

3. **Response Caching**

   ```javascript
   import NodeCache from "node-cache";
   const cache = new NodeCache({ stdTTL: 600 });

   // Cache product list
   const getCachedProducts = async () => {
     const cached = cache.get("products");
     if (cached) return cached;

     const products = await Product.findAll();
     cache.set("products", products);
     return products;
   };
   ```

4. **Pagination**

   ```javascript
   const { page = 1, limit = 10 } = req.query;
   const offset = (page - 1) * limit;

   const { count, rows } = await Order.findAndCountAll({
     limit,
     offset,
     order: [["created", "DESC"]],
   });
   ```

### Frontend Optimizations

1. **Code Splitting**

   ```typescript
   const Dashboard = lazy(() => import("./pages/Dashboard"));
   ```

2. **Memoization**

   ```typescript
   const expensiveCalculation = useMemo(() => {
     return items.reduce((sum, item) => sum + item.price, 0);
   }, [items]);
   ```

3. **Debouncing Search**

   ```typescript
   const debouncedSearch = useMemo(
     () => debounce((term) => searchProducts(term), 300),
     [],
   );
   ```

4. **Image Optimization**
   - Use WebP format
   - Implement lazy loading
   - Serve different sizes for different devices

---

## 🔒 Security Best Practices

### Implemented Security Measures

✅ Password hashing with bcrypt
✅ JWT with short expiration
✅ HTTP-only cookies for refresh tokens
✅ Input validation with Joi
✅ SQL injection prevention (Sequelize)
✅ CORS configuration
✅ Environment variable protection
✅ Role-based access control

### Additional Recommendations

- [ ] Implement rate limiting
- [ ] Add HTTPS in production
- [ ] Set up WAF (Web Application Firewall)
- [ ] Regular security audits
- [ ] Dependency vulnerability scanning
- [ ] Implement 2FA for admin accounts
- [ ] Add request logging and monitoring
- [ ] Set up automated backups
- [ ] Implement CSP headers
- [ ] Use security headers (Helmet.js)

---

## 📊 Monitoring & Logging

### Logging Strategy

#### Backend Logging

```javascript
// Use Winston or Pino for structured logging
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// Log API requests
app.use((req, res, next) => {
  logger.info({
    method: req.method,
    url: req.url,
    ip: req.ip,
    timestamp: new Date().toISOString(),
  });
  next();
});
```

#### Frontend Logging

```typescript
// Error boundary for React
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    // Log to monitoring service (e.g., Sentry)
    console.error("Error caught:", error, errorInfo);
  }
}
```

### Health Checks

```javascript
// Backend health endpoint
app.get("/health", async (req, res) => {
  try {
    await db.sequelize.authenticate();
    res.json({
      status: "healthy",
      database: "connected",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      database: "disconnected",
    });
  }
});
```

### Recommended Monitoring Tools

- **Application Monitoring**: New Relic, Datadog
- **Error Tracking**: Sentry, Rollbar
- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Log Aggregation**: ELK Stack, Papertrail
- **Database Monitoring**: MySQL Workbench, Percona

---

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Code Style Guidelines

- Use ESLint configuration provided
- Follow TypeScript best practices
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features

### Commit Message Format

```
type(scope): subject

body

footer
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:

```
feat(orders): add real-time order notifications

Implement WebSocket connection for instant order updates
to admin dashboard

Closes #123
```

---

## 📞 Support & Resources

### Documentation Links

- **Swagger API Docs**: http://localhost:5000/api-docs
- **React Documentation**: https://react.dev
- **Express.js Guide**: https://expressjs.com
- **Sequelize ORM**: https://sequelize.org
- **TailwindCSS**: https://tailwindcss.com
- **Socket.IO**: https://socket.io/docs

### Useful Commands Reference

#### Docker Commands

```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f [service-name]

# Restart service
docker-compose restart [service-name]

# Rebuild and restart
docker-compose up --build

# Stop all services
docker-compose down

# Remove volumes
docker-compose down -v

# Execute command in container
docker-compose exec backend npm run seed
```

#### Database Commands

```bash
# Access MySQL CLI
docker-compose exec mysql mysql -u root -p

# Backup database
docker-compose exec mysql mysqldump -u root -p mini-qr-ordering > backup.sql

# Restore database
docker-compose exec -T mysql mysql -u root -p mini-qr-ordering < backup.sql
```

#### Git Commands

```bash
# Check status
git status

# Create branch
git checkout -b feature/your-feature

# Stage changes
git add .

# Commit
git commit -m "Your message"

# Push
git push origin feature/your-feature

# Pull latest
git pull origin main
```

---

## 📋 FAQ

### Q: How do I change the admin password?

**A:** Login as admin, navigate to profile settings, or use the forgot password flow.

### Q: Can I add more user roles?

**A:** Yes, edit `backend/_helpers/role.js` and update authorization middleware accordingly.

### Q: How do I add custom email templates?

**A:** Create HTML templates in `backend/templates/` and modify `backend/_helpers/send-email.js`.

### Q: How do I integrate a payment gateway?

**A:** Add payment provider SDK (Stripe, PayPal), create payment service, and update order flow.

### Q: Can I use PostgreSQL instead of MySQL?

**A:** Yes, update Sequelize dialect in `backend/_helpers/db.js` and Docker Compose configuration.

### Q: How do I enable email verification?

**A:** Configure SMTP settings in `.env` and ensure email service is properly set up.

### Q: How do I add product variants (size, color, etc.)?

**A:** Create ProductVariant model with foreign key to Product, update order items to reference variants.

### Q: Can I deploy this on cloud platforms?

**A:** Yes, it works on AWS, Google Cloud, Azure, Heroku, DigitalOcean, and other platforms that support Docker.

---

## 🗺️ Roadmap

### Planned Features

- [ ] Multi-language support (i18n)
- [ ] Mobile apps (React Native)
- [ ] Kitchen display system
- [ ] Inventory management
- [ ] Customer loyalty program
- [ ] Advanced analytics dashboard
- [ ] Table reservation system
- [ ] Receipt printing
- [ ] Tax calculation
- [ ] Discount/coupon system
- [ ] Staff management
- [ ] Multi-restaurant support
- [ ] API rate limiting
- [ ] Automated testing suite
- [ ] CI/CD pipeline

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👏 Acknowledgments

- Built with [TailAdmin React](https://tailadmin.com) template
- Based on [Node MySQL API](https://github.com/cornflourblue/node-mysql-signup-verification-api)
- Icons by [Lucide](https://lucide.dev)

---

## 📧 Contact

For questions, issues, or contributions, please:

- Open an issue on GitHub
- Submit a pull request
- Contact the development team

---

**Last Updated:** June 2026
**Version:** 1.0.0
**Status:** Active Development

---

_This documentation is maintained alongside the codebase. Please keep it updated when making changes to the system._
