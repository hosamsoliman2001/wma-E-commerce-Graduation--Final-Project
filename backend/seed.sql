
-- ecommerce_full_seed_with_mysql.sql
-- قاعدة بيانات MySQL لمتجر إلكتروني تجريبي

CREATE DATABASE IF NOT EXISTS ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecommerce_db;

DROP TABLE IF EXISTS products;
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    category VARCHAR(100),
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (name, description, price, stock, category, image) VALUES
('iPhone 15 Pro', 'Apple smartphone with A17 chip', 1299.99, 10, 'Mobiles', '/images/iphone15pro.jpg'),
('Samsung Galaxy S24', 'Flagship Android with AMOLED screen', 1199.99, 15, 'Mobiles', '/images/galaxys24.jpg'),
('MacBook Air M3', 'Lightweight laptop with Apple M3 chip', 1699.00, 8, 'Laptops', '/images/macbookairm3.jpg'),
('Dell XPS 13', 'High-end Windows ultrabook', 1599.00, 12, 'Laptops', '/images/dellxps13.jpg'),
('Sony WH-1000XM5', 'Noise cancelling wireless headphones', 399.99, 20, 'Audio', '/images/sonywh1000xm5.jpg'),
('AirPods Pro 2', 'Wireless earbuds with active noise cancellation', 249.99, 30, 'Audio', '/images/airpodspro2.jpg'),
('Canon EOS R6', 'Mirrorless camera with 4K recording', 2499.00, 5, 'Cameras', '/images/canoneosr6.jpg'),
('Nikon Z6 II', 'Mirrorless camera 24.5MP sensor', 2299.00, 4, 'Cameras', '/images/nikonz6ii.jpg'),
('Apple Watch Ultra 2', 'Premium smartwatch with GPS and cellular', 799.00, 18, 'Wearables', '/images/applewatchultra2.jpg'),
('Fitbit Charge 6', 'Fitness tracker with heart rate monitor', 199.00, 25, 'Wearables', '/images/fitbitcharge6.jpg'),
('Logitech MX Master 3S', 'Ergonomic wireless mouse', 129.00, 40, 'Accessories', '/images/mxmaster3s.jpg'),
('Razer BlackWidow V4', 'Mechanical gaming keyboard', 179.99, 35, 'Accessories', '/images/razerblackwidowv4.jpg');

