# WMA E-Commerce Platform

A full-stack e-commerce application built with Node.js, Express, MySQL, and Vanilla JavaScript.

## Features

- User authentication (JWT-based)
- Product catalog with categories
- Shopping cart management
- Order processing and checkout
- Admin dashboard with metrics
- RESTful API

## Tech Stack

**Backend:**
- Node.js 22
- Express 5
- MySQL 8
- TypeORM
- JWT Authentication
- BCrypt password hashing

**Frontend:**
- Vanilla JavaScript
- HTML5
- CSS3

## Prerequisites

- Node.js 22 or higher
- MySQL 8 or higher
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd wma-ecommerce
```

### 2. Install backend dependencies

```bash
Stop-Process -Name node -Force

Get-Process node

cd backend

npm install

```

### 3. Configure environment variables

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and fill in your database credentials and JWT secret:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=wma_ecommerce

JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=24h

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=5
```

### 4. Set up the database

Run the migration to create the database schema:

```bash
npm run migrate
```

Seed the database with sample data:

```bash
npm run seed
```

### 5. Start the server

Development mode (with auto-restart):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The API will be available at `http://localhost:3000/`


## Run the server and test the service: Open

* Frontend:- http://localhost:3000/ 

* Backend:- http://localhost:3000/docs 


## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

### Users

- `GET /api/v1/users/me` - Get current user info (requires auth)

### Products

- `GET /api/v1/products` - Get all products (with filters)
- `GET /api/v1/products/:id` - Get product by ID
- `POST /api/v1/products` - Create product (admin only)
- `PUT /api/v1/products/:id` - Update product (admin only)
- `DELETE /api/v1/products/:id` - Delete product (admin only)

### Categories

- `GET /api/v1/categories` - Get all categories
- `GET /api/v1/categories/:id` - Get category by ID

### Cart

- `GET /api/v1/carts` - Get user's cart (requires auth)
- `POST /api/v1/carts/items` - Add item to cart (requires auth)
- `DELETE /api/v1/carts/items/:productId` - Remove item from cart (requires auth)
- `POST /api/v1/carts/checkout` - Checkout cart (requires auth)

### Orders

- `GET /api/v1/orders` - Get user's orders (requires auth)
- `GET /api/v1/orders/:id` - Get order details (requires auth)
- `PATCH /api/v1/orders/:id/status` - Update order status (admin only)

### Admin

- `GET /api/v1/admin/metrics` - Get dashboard metrics (admin only)
- `GET /api/v1/admin/orders` - Get all orders (admin only)
- `GET /api/v1/admin/metrics/sales` - Get sales summary (admin only)

## Default Credentials

**Admin User:**
- Email: `admin@wma.com`
- Password: `password123`
## 
## وسجّل الدخول كمشرف 

 Email: admin@example.com

 Password: Password123!

**Regular User:**
- Email: `john@example.com`
- Password: `password123`

## Testing

Run tests:

```bash
npm test
```

Run tests with coverage:

```bash
npm test -- --coverage
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── authJwt.js
│   │   ├── rateLimit.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── productRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   └── adminRoutes.js
│   ├── scripts/
│   │   ├── migrate.js
│   │   └── seed.js
│   ├── app.js
│   └── server.js
├── schema.sql
├── seed.sql
├── .env.example
├── package.json
└── README.md
```

## License

ISC

## تشغيل الخادم 

 Stop-Process -Name node -Force

Get-Process node

 cd backend


 npm install

 npm run migrate

npm run seed

 npm run dev

 npm start

Verification Steps

بعد التشغيل: راقب الطرفية حتى تظهر الرسالة 
Server listening on port 3000.
اختبار الخدمة: افتح 

## http://localhost:3000/ 

للواجهة الأمامية، و 

## http://localhost:3000/docs 

للتوثيق.

Feedback submitted

Code