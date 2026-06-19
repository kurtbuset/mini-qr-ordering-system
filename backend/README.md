# QR Ordering System - Backend API

A Node.js + Express backend API for a QR-based food ordering system with authentication, order management, and real-time updates via WebSockets.

## 📋 Features

- **Authentication & Authorization**
  - JWT-based authentication with refresh tokens
  - Role-based access control (Admin/User)
  - Secure password hashing with bcrypt

- **Product Management**
  - CRUD operations for menu items
  - Category-based organization
  - Image support for products
  - Availability toggle

- **Order Management**
  - Support for dine-in and takeout orders
  - Multiple payment methods (debit card, credit card, pay at counter)
  - Order status tracking (pending, completed, cancelled)
  - Payment status tracking (pending, paid, failed)
  - Real-time order updates via Socket.IO

- **Real-time Communication**
  - WebSocket support for live order notifications
  - Admin room for broadcasting updates to staff

- **API Documentation**
  - Interactive Swagger/OpenAPI documentation
  - Available at `/api-docs`

## 🛠 Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js v5
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT + express-jwt
- **Real-time**: Socket.IO
- **Validation**: Joi
- **Documentation**: Swagger UI Express
- **Security**: bcrypt, CORS, cookie-parser

## 📦 Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and update the following variables:

   ```env
   # Database configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASS=your_password_here
   DB_NAME=mini-qr-ordering

   # JWT Secret (use a strong, unique secret in production)
   JWT_SECRET=your_jwt_secret_here

   # App configuration
   APP_NAME=Mini QR Ordering System Backend
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   ```

4. **Set up the database**

   Create the MySQL database:

   ```sql
   CREATE DATABASE mini-qr-ordering;
   ```

   Run the database schema:

   ```bash
   mysql -u root -p mini-qr-ordering < database.sql
   ```

5. **Seed the database (optional)**

   ```bash
   npm run seed
   ```

   This will populate the database with:
   - Default admin account
   - Sample products (burgers, hotdogs, drinks)

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

The server will start with nodemon and automatically restart on file changes.

### Production Mode

```bash
npm start
```

The API will be available at `http://localhost:5000` (or your configured PORT).

## 📚 Available Scripts

| Script                    | Description                                       |
| ------------------------- | ------------------------------------------------- |
| `npm start`               | Start the server in production mode               |
| `npm run dev`             | Start the server in development mode with nodemon |
| `npm run seed`            | Seed the database with initial data               |
| `npm run reset-db`        | Reset the database (if script exists)             |
| `npm run setup`           | Run initial setup (if script exists)              |

## 📡 API Endpoints

### Health Check

```
GET /health
```

Returns server health status.

### Authentication (`/accounts`)

- `POST /accounts/register` - Register new account
- `POST /accounts/authenticate` - Login
- `POST /accounts/refresh-token` - Refresh JWT token
- `POST /accounts/revoke-token` - Revoke refresh token
- `POST /accounts/forgot-password` - Request password reset
- `POST /accounts/reset-password` - Reset password
- `POST /accounts/verify-email` - Verify email address
- `GET /accounts` - Get all accounts (Admin only)
- `GET /accounts/:id` - Get account by ID
- `PUT /accounts/:id` - Update account
- `DELETE /accounts/:id` - Delete account

### Products (`/products`)

- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create new product (Admin only)
- `PUT /products/:id` - Update product (Admin only)
- `DELETE /products/:id` - Delete product (Admin only)

### Orders (`/orders`)

- `GET /orders` - Get all orders
- `GET /orders/:id` - Get order by ID
- `POST /orders` - Create new order
- `PUT /orders/:id` - Update order status
- `DELETE /orders/:id` - Delete order

### Static Files

```
GET /images/:filename
```

Serves product images from the `images/` directory.

### API Documentation

```
GET /api-docs
```

Interactive Swagger UI documentation.

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Login**: Send credentials to `/accounts/authenticate`
2. **Receive**: JWT access token (short-lived) and refresh token (long-lived)
3. **Use**: Include JWT in Authorization header: `Bearer <token>`
4. **Refresh**: Use refresh token at `/accounts/refresh-token` when access token expires

### Roles

- **Admin**: Full access to all endpoints
- **User**: Limited access (typically for customers)

## 🔌 WebSocket Events

The server uses Socket.IO for real-time communication:

### Client → Server

- `joinAdminRoom` - Join the admin room (requires admin role)
- `leaveAdminRoom` - Leave the admin room

### Server → Client

- `newOrder` - Broadcast new order to admin room
- `orderStatusUpdate` - Broadcast order status changes

## 📁 Project Structure

```
backend/
├── accounts/               # User account management
│   ├── account.model.js
│   ├── account.service.js
│   ├── accounts.controller.js
│   └── refresh-token.model.js
├── orders/                 # Order management
│   ├── order.model.js
│   ├── order.service.js
│   ├── order.controller.js
│   └── order-items.model.js
├── products/               # Product management
│   ├── product.model.js
│   ├── product.service.js
│   └── product.controller.js
├── _helpers/               # Helper utilities
│   ├── db.js              # Database connection
│   ├── role.js            # Role constants
│   ├── send-email.js      # Email utilities
│   └── swagger.js         # API documentation setup
├── _middleware/            # Express middleware
│   ├── authorize.js       # Authorization middleware
│   ├── error-handler.js   # Error handling middleware
│   └── validate-request.js # Request validation middleware
├── seeds/                  # Database seeders
│   ├── accountSeeds.js
│   ├── productSeeds.js
│   ├── runSeeds.js
│   └── index.js
├── images/                 # Product images
├── server.js              # Application entry point
├── database.sql           # Database schema
├── swagger.yaml           # API documentation
├── package.json
└── .env                   # Environment variables (not in repo)
```

## 🗄 Database Schema

### Tables

- **accounts**: User accounts with authentication details
- **refreshTokens**: JWT refresh tokens
- **products**: Menu items/products
- **orders**: Customer orders
- **order_items**: Line items within orders

See `database.sql` for complete schema definition.

## 🔧 Configuration

### CORS

The API is configured to only accept requests from the frontend URL specified in `FRONTEND_URL` environment variable.

### Database

Sequelize ORM is used for database operations. Connection settings are configured in `_helpers/db.js`.

### Email

Nodemailer is configured for sending verification and password reset emails. Update SMTP settings in `.env`.

## 🐳 Docker Support

Dockerfile is included for containerization:

```bash
docker build -t qr-ordering-backend .
docker run -p 5000:5000 --env-file .env qr-ordering-backend
```

## 🧪 Testing

Currently, no automated tests are configured. Consider adding:

- Unit tests (Jest, Mocha)
- Integration tests
- API endpoint tests (Supertest)

## 🔐 Security Best Practices

- ✅ Use strong JWT secrets in production
- ✅ Change default admin password immediately
- ✅ Use HTTPS in production
- ✅ Keep dependencies updated
- ✅ Sanitize user inputs
- ✅ Use environment variables for sensitive data
- ✅ Implement rate limiting for API endpoints
- ✅ Enable CORS only for trusted origins

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Troubleshooting

### Database Connection Issues

- Verify MySQL is running
- Check database credentials in `.env`
- Ensure database exists: `CREATE DATABASE mini-qr-ordering;`

### Port Already in Use

- Change the PORT in `.env`
- Kill the process using port 5000: `lsof -ti:5000 | xargs kill` (Mac/Linux)

### Email Not Sending

- Verify SMTP credentials
- Check firewall settings
- Use app-specific passwords for Gmail

### Seeds Not Running

- Ensure database is created and accessible
- Check for existing data that might conflict
- Review console logs for specific errors

## 📞 Support

For issues, questions, or contributions, please open an issue in the repository.

---

**Built with ❤️ for efficient restaurant operations**
