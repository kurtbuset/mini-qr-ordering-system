# Installation Guide - Mini QR Ordering System

This guide will help you install and run the Mini QR Ordering System using Docker for fast and easy setup.

## 📋 Prerequisites

Before you begin, make sure you have the following installed on your system:

- **Docker Desktop** (version 20.10 or higher)
  - Download from: https://www.docker.com/products/docker-desktop
  - Includes Docker Engine and Docker Compose
- **Git** (for cloning the repository)
  - Download from: https://git-scm.com/downloads

## 🚀 Quick Start with Docker

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd minQROrderingSystem
```

### Step 2: Configure Environment Variables

#### Backend Configuration

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Create a `.env` file by copying the example:

   ```bash
   copy .env.example .env
   ```

   _Note: On Linux/Mac, use `cp .env.example .env`_

3. Open `.env` file and update the following (optional for Docker setup):

   ```env
   # Database configuration (Docker will use these from docker-compose.yml)
   DB_HOST=mysql
   DB_PORT=3306
   DB_USER=root
   DB_PASS=password
   DB_NAME=mini-qr-ordering

   # JWT Secret (IMPORTANT: Change this in production!)
   JWT_SECRET=your_secure_jwt_secret_here_change_in_production

   # Email configuration (optional - for password reset)
   EMAIL_FROM=noreply@yourapp.com
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password

   # App configuration
   APP_NAME=Mini QR Ordering System Backend
   PORT=5000
   ```

4. Return to the root directory:
   ```bash
   cd ..
   ```

#### Frontend Configuration

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Create a `.env` file:

   ```bash
   copy .env.example .env
   ```

   _Note: On Linux/Mac, use `cp .env.example .env`_

3. Open `.env` file and configure:

   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. Return to the root directory:
   ```bash
   cd ..
   ```

### Step 3: Start Docker Services

From the root directory of the project, run:

```bash
docker-compose up -d
```

This command will:

- Download required Docker images (MySQL, phpMyAdmin)
- Build the backend application
- Create and start all containers
- Set up the database

**Note:** The first run may take 5-10 minutes depending on your internet connection.

### Step 4: Wait for Services to Initialize

Check if all services are running:

```bash
docker-compose ps
```

You should see:

- `qr_ordering_mysql` - healthy
- `qr_ordering_phpmyadmin` - running
- `qr_ordering_backend` - healthy

### Step 5: Initialize the Database

Run the setup script to create database tables:

```bash
docker-compose exec backend npm run setup
```

Then seed the database with sample data:

```bash
docker-compose exec backend npm run seed
```

### Step 6: Start the Frontend (Local Development)

The frontend runs outside Docker for faster development. Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at: http://localhost:5173

## 🌐 Access the Application

Once everything is running, you can access:

- **Frontend (Customer Interface)**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Documentation (Swagger)**: http://localhost:5000/api-docs
- **phpMyAdmin (Database Management)**: http://localhost:8080
  - Server: `mysql`
  - Username: `root`
  - Password: `password`

## 👤 Default Admin Account

After seeding, you can log in with:

- **Email**: Check the seed data or create an account via the API
- **Password**: Check the seed scripts in `backend/seeds/`

## 🛠️ Useful Docker Commands

### View Logs

View all logs:

```bash
docker-compose logs -f
```

View backend logs only:

```bash
docker-compose logs -f backend
```

View MySQL logs:

```bash
docker-compose logs -f mysql
```

### Stop Services

Stop all containers:

```bash
docker-compose down
```

Stop and remove all data (including database):

```bash
docker-compose down -v
```

### Restart Services

Restart all services:

```bash
docker-compose restart
```

Restart backend only:

```bash
docker-compose restart backend
```

### Rebuild After Code Changes

If you make changes to Dockerfile or package.json:

```bash
docker-compose up -d --build
```

### Access Container Shell

Access backend container:

```bash
docker-compose exec backend sh
```

Access MySQL container:

```bash
docker-compose exec mysql mysql -u root -p
```

_Password: `password`_

## 🔧 Troubleshooting

### Port Already in Use

If you see errors about ports being in use:

1. **Port 3306 (MySQL)**: Stop your local MySQL service

   ```bash
   # Windows
   net stop MySQL80

   # Linux/Mac
   sudo systemctl stop mysql
   ```

2. **Port 5000 (Backend)**: Change the port in `docker-compose.yml`:

   ```yaml
   backend:
     ports:
       - "5001:5000" # Use port 5001 instead
   ```

3. **Port 8080 (phpMyAdmin)**: Change in `docker-compose.yml`:
   ```yaml
   phpmyadmin:
     ports:
       - "8081:80" # Use port 8081 instead
   ```

### Database Connection Issues

If the backend can't connect to the database:

1. Check if MySQL is healthy:

   ```bash
   docker-compose ps
   ```

2. Restart the backend:

   ```bash
   docker-compose restart backend
   ```

3. Check backend logs:
   ```bash
   docker-compose logs backend
   ```

### Frontend Can't Connect to Backend

1. Verify backend is running:

   ```bash
   curl http://localhost:5000/health
   ```

2. Check `.env` file in frontend has correct API URL:

   ```env
   VITE_API_URL=http://localhost:5000
   ```

3. Restart the frontend development server

### Clear Everything and Start Fresh

```bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v

# Remove backend node_modules
cd backend
rm -rf node_modules
cd ..

# Remove frontend node_modules
cd frontend
rm -rf node_modules
cd ..

# Start fresh
docker-compose up -d --build

# Reinstall frontend dependencies
cd frontend
npm install
npm run dev
```

## 📊 Database Management

### Reset Database

To reset the database to initial state:

```bash
docker-compose exec backend npm run reset-db
docker-compose exec backend npm run seed
```

### Run Database Migrations

If there are new migrations (e.g., payment fields):

```bash
docker-compose exec backend npm run migrate:payment
```

### Backup Database

```bash
docker-compose exec mysql mysqldump -u root -ppassword mini-qr-ordering > backup.sql
```

### Restore Database

```bash
docker-compose exec -T mysql mysql -u root -ppassword mini-qr-ordering < backup.sql
```

## 🔒 Security Notes

**⚠️ IMPORTANT for Production:**

1. **Change default passwords** in `docker-compose.yml`:
   - MySQL root password
   - MySQL user password

2. **Use strong JWT secret** in backend `.env`

3. **Enable HTTPS** with a reverse proxy (nginx, Caddy, etc.)

4. **Don't expose phpMyAdmin** in production (remove from docker-compose.yml)

5. **Use environment-specific .env files** and never commit them to git

## 📱 Development Workflow

### Making Backend Changes

1. Edit files in `backend/` directory
2. Changes are automatically reflected (hot reload with nodemon)
3. Check logs: `docker-compose logs -f backend`

### Making Frontend Changes

1. Edit files in `frontend/` directory
2. Vite will hot-reload automatically
3. Check browser console for errors

### Adding New npm Packages

Backend:

```bash
docker-compose exec backend npm install package-name
```

Frontend:

```bash
cd frontend
npm install package-name
```

## 📞 Support

If you encounter issues:

1. Check the logs: `docker-compose logs -f`
2. Verify all services are healthy: `docker-compose ps`
3. Review the troubleshooting section above
4. Check Docker Desktop is running properly

## 🎉 Next Steps

After successful installation:

1. Explore the API documentation at http://localhost:5000/api-docs
2. Test the customer ordering flow at http://localhost:5173
3. Access admin panel (if available)
4. Review the code structure in `backend/` and `frontend/` directories
5. Check `SYSTEM_DOCUMENTATION.md` for system architecture details

---

**Happy Coding! 🚀**
