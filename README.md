# CalmandCode - Food Ordering Platform

A full-stack food delivery and ordering web application built with Node.js and Express. Users can browse menu items, manage shopping carts, and complete orders with PayPal payment integration.

## 🎯 Features

- **Product Catalog** - Browse menu with categories (Pizza, Burger, Pasta, Fries)
- **Shopping Cart** - Add/remove items, adjust quantities, real-time total calculation
- **User Checkout** - Enter delivery address and customer details
- **PayPal Integration** - Secure payment processing
- **Order Tracking** - Get order ID and delivery confirmation
- **Responsive Design** - Works on desktop and mobile devices
- **Admin Database** - MySQL backend for products, orders, and payments

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js, Express.js |
| **Database** | MySQL, mysql2 |
| **Frontend** | EJS, Bootstrap 4, jQuery |
| **Session Management** | express-session |
| **Payment** | PayPal SDK |
| **Environment** | dotenv |

## 📋 Requirements

- Node.js (v14+)
- MySQL Server
- npm

## ⚙️ Installation

1. **Clone repository:**
```bash
git clone https://github.com/your-username/calmandcode.git
cd calmandcode
```

2. **Install dependencies:**
```bash
npm install
```

3. **Setup environment variables** - Create `.env` file:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=node_project

   
4. **Create MySQL database:**
```sql
CREATE DATABASE node_project;
```

5. **Import database schema:**
Run the SQL commands from `db-schema.sql` in MySQL Workbench

6. **Add product images** to `public/images/` folder

7. **Start server:**
```bash
node index.js
```

8. **Open browser:**
http://localhost:8080


## 📁 Project Structure
calmandcode/
├── index.js # Main server file
├── db.js # Database connection pool
├── .env # Environment variables
├── package.json # Dependencies
├── public/
│ ├── css/ # Stylesheets
│ ├── js/ # Client-side scripts
│ └── images/ # Product images
└── views/
└── pages/ # EJS templates
├── index.ejs
├── products.ejs
├── cart.ejs
├── checkout.ejs
├── payment.ejs
└── thank_you.ejs


## 🗄️ Database Schema

- **products** - Menu items with price and images
- **orders** - Customer orders and delivery details
- **order_items** - Individual items per order
- **payments** - Payment transaction records

## 🔧 Available Routes

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/` | Home page with products |
| GET | `/products` | All products menu |
| GET | `/single_product?id=1` | Product details |
| POST | `/add_to_cart` | Add item to cart |
| GET | `/cart` | View shopping cart |
| POST | `/remove_product` | Remove from cart |
| POST | `/edit_product_quantity` | Update quantity |
| GET | `/checkout` | Checkout page |
| POST | `/place_order` | Create order |
| GET | `/payment` | Payment page |
| GET | `/verify_payment` | Verify PayPal payment |
| GET | `/thank_you` | Order confirmation |
| GET | `/about` | About page |

## 🔐 Security Notes

- Store sensitive data in `.env` (never commit)
- Use parameterized queries to prevent SQL injection
- Add input validation on all forms
- Never expose PayPal Client ID in frontend code

## 📦 NPM Scripts

```bash
npm start          # Start server
npm install        # Install dependencies
```

## 🚀 Deployment

For production deployment, consider:
- Environment variables on hosting platform
- Use connection pooling for database
- Enable HTTPS
- Set up proper error logging


## 🤝 Contributing

Contributions welcome! Fork repo and submit pull requests.

---

**Demo:** Visit http://localhost:8080 after setup
