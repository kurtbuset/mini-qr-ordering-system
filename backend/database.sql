-- ============================================
-- QR Ordering System Database Schema
-- ============================================
-- Database: qr_ordering_system
-- Description: Database schema for a QR-based food ordering system
-- Created: 2026-06-18
-- ============================================

-- Create database (uncomment if needed)
-- CREATE DATABASE IF NOT EXISTS qr_ordering_system;
-- USE qr_ordering_system;

-- ============================================
-- Table: accounts
-- Description: User accounts for admin/staff access
-- ============================================
CREATE TABLE IF NOT EXISTS accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    passwordHash VARCHAR(255) NOT NULL,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    verified DATETIME DEFAULT NULL,
    resetToken VARCHAR(255) DEFAULT NULL,
    resetTokenExpires DATETIME DEFAULT NULL,
    passwordReset DATETIME DEFAULT NULL,
    created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_resetToken (resetToken)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: refreshTokens
-- Description: JWT refresh tokens for authentication
-- ============================================
CREATE TABLE IF NOT EXISTS refreshTokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(500) NOT NULL,
    expires DATETIME NOT NULL,
    created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    createdByIp VARCHAR(45) DEFAULT NULL,
    revoked DATETIME DEFAULT NULL,
    revokedByIp VARCHAR(45) DEFAULT NULL,
    replacedByToken VARCHAR(500) DEFAULT NULL,
    accountId INT NOT NULL,
    INDEX idx_token (token(255)),
    INDEX idx_accountId (accountId),
    FOREIGN KEY (accountId) REFERENCES accounts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: products
-- Description: Menu items/products available for ordering
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT DEFAULT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(500) DEFAULT NULL,
    category VARCHAR(100) DEFAULT NULL,
    is_available TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_is_available (is_available),
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: orders
-- Description: Customer orders (dine-in or takeout)
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    table_number VARCHAR(20) DEFAULT NULL,
    customer_name VARCHAR(100) DEFAULT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    order_type ENUM('dine_in', 'takeout') NOT NULL,
    order_status ENUM('pending', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    payment_method ENUM('debit_card', 'credit_card', 'pay_at_counter') NOT NULL,
    payment_status ENUM('pending', 'paid', 'failed') NOT NULL DEFAULT 'pending',
    payment_notes VARCHAR(500) DEFAULT NULL,
    payment_transaction_id VARCHAR(100) DEFAULT NULL,
    payment_card_last4 VARCHAR(4) DEFAULT NULL,
    payment_card_type VARCHAR(20) DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_order_number (order_number),
    INDEX idx_table_number (table_number),
    INDEX idx_order_status (order_status),
    INDEX idx_payment_status (payment_status),
    INDEX idx_order_type (order_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: order_items
-- Description: Individual items within an order
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Sample Data: Products
-- ============================================

-- Burgers
INSERT INTO products (name, description, price, category, image_url, is_available) VALUES
('Classic American Burger', 'A classic American-style burger with all the traditional fixings', 10.99, 'Burgers', '/images/classic-american-burger.jpg', 1),
('Hamburger', 'Simple and delicious hamburger with fresh ingredients', 9.99, 'Burgers', '/images/hamburger.jpg', 1),
('Cheesy Burger', 'Juicy burger loaded with melted cheese', 8.50, 'Burgers', '/images/cheesy-burger.jpg', 1),
('Hawaiian Burger', 'Tropical burger with pineapple and Hawaiian-style toppings', 11.00, 'Burgers', '/images/hawaiian-burger.jpg', 1);

-- Hotdogs
INSERT INTO products (name, description, price, category, image_url, is_available) VALUES
('Classic HotDog', 'Traditional hotdog with mustard and ketchup', 6.00, 'Hotdogs', '/images/classic-hotdog.jpg', 1),
('Cheesy HotDog', 'Hotdog topped with melted cheese', 8.50, 'Hotdogs', '/images/cheesy-hotdog.jpg', 1),
('XL HotDog', 'Extra large hotdog with premium toppings', 10.99, 'Hotdogs', '/images/xl-hotdog.jpg', 1);

-- Drinks
INSERT INTO products (name, description, price, category, image_url, is_available) VALUES
('Coke', 'Refreshing Coca-Cola soft drink', 2.99, 'Drinks', '/images/coke.jpg', 1),
('Juice', 'Fresh fruit juice - ask for available flavors', 3.50, 'Drinks', '/images/juice.jpg', 1),
('Coffee', 'Freshly brewed coffee', 4.50, 'Drinks', '/images/coffee.jpg', 1);

-- ============================================
-- Sample Data: Admin Account
-- ============================================
-- Default Admin Account
-- Email: admin@qrorders.com
-- Password: Admin@123
-- Note: The password hash below is for 'Admin@123' - CHANGE THIS IN PRODUCTION!

-- Check if admin account exists and insert if not
INSERT INTO accounts (email, passwordHash, firstName, lastName, role, verified, created)
SELECT * FROM (SELECT 
    'admin@qrorders.com' as email,
    '$2a$10$YourHashedPasswordHere' as passwordHash,
    'Admin' as firstName,
    'User' as lastName,
    'Admin' as role,
    NOW() as verified,
    NOW() as created
) AS tmp
WHERE NOT EXISTS (
    SELECT email FROM accounts WHERE email = 'admin@qrorders.com'
) LIMIT 1;

-- To generate a new password hash, use this command in Node.js:
-- const bcrypt = require('bcryptjs');
-- bcrypt.hash('Admin@123', 10).then(hash => console.log(hash));


-- ============================================
-- Sample Data: Orders (Optional)
-- ============================================
-- Example dine-in order
INSERT INTO orders (order_number, table_number, total_amount, order_type, order_status, payment_method, payment_status, created_at) VALUES
('ORD-2026-0001', '5', 25.48, 'dine_in', 'completed', 'credit_card', 'paid', NOW() - INTERVAL 2 HOUR);

-- Get the last inserted order ID
SET @last_order_id = LAST_INSERT_ID();

-- Order items for the dine-in order
INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, subtotal, created_at) VALUES
(@last_order_id, 1, 'Classic American Burger', 2, 10.99, 21.98, NOW() - INTERVAL 2 HOUR),
(@last_order_id, 8, 'Coke', 1, 2.99, 2.99, NOW() - INTERVAL 2 HOUR);

-- Example takeout order
INSERT INTO orders (order_number, customer_name, total_amount, order_type, order_status, payment_method, payment_status, created_at) VALUES
('ORD-2026-0002', 'John Doe', 15.49, 'takeout', 'pending', 'pay_at_counter', 'pending', NOW() - INTERVAL 30 MINUTE);

-- Get the last inserted order ID
SET @last_order_id = LAST_INSERT_ID();

-- Order items for the takeout order
INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, subtotal, created_at) VALUES
(@last_order_id, 3, 'Cheesy Burger', 1, 8.50, 8.50, NOW() - INTERVAL 30 MINUTE),
(@last_order_id, 5, 'Classic HotDog', 1, 6.00, 6.00, NOW() - INTERVAL 30 MINUTE);

-- ============================================
-- Useful Queries
-- ============================================

-- View all orders with total items
-- SELECT o.*, COUNT(oi.id) as item_count 
-- FROM orders o 
-- LEFT JOIN order_items oi ON o.id = oi.order_id 
-- GROUP BY o.id 
-- ORDER BY o.created_at DESC;

-- View order details with items
-- SELECT o.order_number, o.table_number, o.customer_name, o.total_amount, 
--        oi.product_name, oi.quantity, oi.unit_price, oi.subtotal
-- FROM orders o
-- JOIN order_items oi ON o.id = oi.order_id
-- WHERE o.order_number = 'ORD-2026-0001';

-- View products by category
-- SELECT category, COUNT(*) as product_count, 
--        AVG(price) as avg_price, 
--        SUM(is_available) as available_count
-- FROM products 
-- GROUP BY category;

-- Daily sales summary
-- SELECT DATE(created_at) as order_date, 
--        COUNT(*) as total_orders, 
--        SUM(total_amount) as total_sales,
--        AVG(total_amount) as avg_order_value
-- FROM orders 
-- WHERE order_status = 'completed'
-- GROUP BY DATE(created_at)
-- ORDER BY order_date DESC;

-- ============================================
-- End of SQL Script
-- ============================================
