# QR Orders - Mini QR Ordering System

A full-stack QR code-based food ordering system for restaurants supporting both dine-in and takeout orders.

## Features

- 🍔 **Product Management** - Browse menu items by category (Burgers, Hotdogs, Drinks)
- 📱 **QR Code Ordering** - Generate QR codes for table-based ordering
- 🛒 **Order Management** - Track pending, completed, and cancelled orders
- 💳 **Payment Options** - Credit/debit card and pay-at-counter support
- 👨‍💼 **Admin Dashboard** - Manage orders and products
- 🌓 **Dark Mode** - Full light/dark theme support

## Tech Stack

**Frontend:**

- React 18 + TypeScript
- Vite
- TailwindCSS
- React Router

**Backend:**

- Node.js + Express
- Sequelize ORM
- MySQL
- JWT Authentication
- Swagger API Documentation

## Installation Guide

### Prerequisites

- Docker & Docker Compose ([Download](https://www.docker.com/get-started))
- Git

### Quick Start with Docker (Recommended)

This is the easiest way to get started. Docker will handle all dependencies including Node.js, MySQL, and phpMyAdmin.

#### Step 1: Clone the Repository

```bash
git clone https://github.com/kurtbuset/mini-qr-ordering-system.git
cd mini-qr-ordering-system
```

#### Step 2: Configure Environment Variables

**Backend Configuration:**

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your settings:

```env
NODE_ENV=development
PORT=5000

# Database (Docker MySQL service)
DB_HOST=mysql
DB_PORT=3306
DB_NAME=qr_ordering_system
DB_USER=root
DB_PASSWORD=root_password

# JWT Secret (generate a secure random string)
JWT_SECRET=your-secret-key-here

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**Frontend Configuration:**

```bash
cd ../frontend
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

#### Step 3: Start All Services

Return to project root and run:

```bash
cd ..
docker-compose up -d
```

This will start:

- **MySQL Database** (port 3306)
- **phpMyAdmin** (port 8080)
- **Backend API** (port 5000)
- **Frontend App** (port 5173)

#### Step 4: Initialize Database

Wait about 30 seconds for MySQL to fully start, then run:

```bash
docker-compose exec backend npm run setup
docker-compose exec backend npm run seed
```

This creates:

- Database tables
- Default admin account
- Sample products (burgers, hotdogs, drinks)

#### Step 5: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Docs**: http://localhost:5000/api-docs
- **phpMyAdmin**: http://localhost:8080 (username: `root`, password: `root_password`)

#### Step 6: Login

Use the default admin credentials:

- **Email**: `admin@qrorders.com`
- **Password**: `Admin@123`

⚠️ **Important**: Change this password immediately in production!

### Docker Management Commands

```bash
# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Restart services
docker-compose restart

# Rebuild containers
docker-compose up -d --build

# Stop and remove all data (including database)
docker-compose down -v
```

---

## Manual Installation (Without Docker)

If you prefer to install dependencies manually:

### Prerequisites

- Node.js 16+ ([Download](https://nodejs.org/))
- MySQL 8.0+ ([Download](https://dev.mysql.com/downloads/))

### Step 1: Clone Repository

```bash
git clone https://github.com/kurtbuset/mini-qr-ordering-system.git
cd mini-qr-ordering-system
```

### Step 2: Database Setup

Create a MySQL database:

```sql
CREATE DATABASE qr_ordering_system;
```

Or import the complete schema:

```bash
mysql -u your_username -p qr_ordering_system < backend/database.sql
```

### Step 3: Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=qr_ordering_system
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key
PORT=5000
FRONTEND_URL=http://localhost:5173
```

Initialize and seed database:

```bash
npm run setup
npm run seed
npm start
```

### Step 4: Frontend Setup

```bash
cd ../frontend
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5000
```

Start frontend:

```bash
npm run dev
```

### Step 5: Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Docs**: http://localhost:5000/api-docs

## Troubleshooting

### Docker Issues

**Containers won't start:**

```bash
docker-compose logs
docker-compose down -v
docker-compose up -d --build
```

**Database connection fails:**

- Wait 30-60 seconds for MySQL to fully initialize
- Check logs: `docker-compose logs mysql`

**Port already in use:**

- Change ports in `docker-compose.yml`

**Reset everything:**

```bash
docker-compose down -v  # Remove all data
docker-compose up -d --build
```

### Manual Installation Issues

**Database connection fails:**

- Verify MySQL is running: `mysql -u root -p`
- Check credentials in `.env` file
- Ensure database exists: `SHOW DATABASES;`

**Port already in use:**

- Backend: Change `PORT` in backend `.env`
- Frontend: Change port in `vite.config.ts`

**Seed fails:**

- Run `npm run setup` first to create tables
- Check database credentials

**Frontend can't connect to backend:**

- Verify backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`

---

## Database Schema

The system includes 5 main tables:

- `accounts` - Admin users
- `products` - Menu items
- `orders` - Customer orders
- `order_items` - Order line items
- `refreshTokens` - Authentication tokens

A complete SQL schema file is available at `backend/database.sql`

## API Documentation

Interactive API documentation is available via Swagger at `/api-docs` when the backend is running.

## Project Structure

```
├── backend/          # Node.js API server
│   ├── accounts/     # User authentication
│   ├── orders/       # Order management
│   ├── products/     # Product catalog
│   ├── seeds/        # Database seeders
│   └── database.sql  # Complete DB schema
├── frontend/         # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── layout/
└── docker-compose.yml
```

## License

MIT License - See LICENSE files in backend and frontend directories.

## Contributing

Pull requests are welcome. For major changes, please open an issue first.
