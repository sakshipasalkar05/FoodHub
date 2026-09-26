require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const session = require('express-session');
const pool = require('./db');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
}));

function isProductInCart(cart, id) {
   for(let i = 0; i < cart.length; i++) {
      if(cart[i].id == id) {
         return true;
      }
   }
   return false;
}

function calculateTotal(cart, req) {
   let total = 0;
   for(let i = 0; i < cart.length; i++) {
      if(cart[i].sale_price) {
         total = total + (cart[i].sale_price * cart[i].quantity);
      } else {
         total = total + (cart[i].price * cart[i].quantity);
      }
   }
   req.session.total = total;
   return total;
}

app.get('/', (req, res) => {
   pool.query("SELECT * FROM products", (err, result) => {
      if(err) {
         console.log(err);
         res.render('pages/index', {result: []});
      } else {
         res.render('pages/index', {result: result});
      }
   });
});

app.post('/add_to_cart', (req, res) => {
   const id = req.body.id;
   const name = req.body.name;
   const price = req.body.price;
   const sale_price = req.body.sale_price;
   const quantity = req.body.quantity;
   const image = req.body.image;
   const product = {id: id, name: name, price: price, sale_price: sale_price, quantity: quantity, image: image};

   if(req.session.cart) {
      const cart = req.session.cart;
      if(!isProductInCart(cart, id)) {
         cart.push(product);
      }
   } else {
      req.session.cart = [product];
   }

   calculateTotal(req.session.cart, req);
   res.redirect('/cart');
});

app.get('/cart', (req, res) => {
   const cart = req.session.cart;
   const total = req.session.total;
   res.render('pages/cart', {cart: cart, total: total});
});

app.post('/remove_product', (req, res) => {
   const id = req.body.id;
   const cart = req.session.cart;

   for(let i = 0; i < cart.length; i++) {
      if(cart[i].id == id) {
         cart.splice(i, 1);
      }
   }

   calculateTotal(cart, req);
   res.redirect('/cart');
});

app.post('/edit_product_quantity', (req, res) => {
   const id = req.body.id;
   const quantity = req.body.quantity;
   const increase_btn = req.body.increase_product_quantity;
   const decrease_btn = req.body.decrease_product_quantity;
   const cart = req.session.cart;

   if(increase_btn) {
      for(let i = 0; i < cart.length; i++) {
         if(cart[i].id == id) {
            if(cart[i].quantity > 0) {
               cart[i].quantity = parseInt(cart[i].quantity) + 1;
            }
         }
      }
   }

   if(decrease_btn) {
      for(let i = 0; i < cart.length; i++) {
         if(cart[i].id == id) {
            if(cart[i].quantity > 1) {
               cart[i].quantity = parseInt(cart[i].quantity) - 1;
            }
         }
      }
   }

   calculateTotal(cart, req);
   res.redirect('/cart');
});

app.get('/checkout', (req, res) => {
   const total = req.session.total;
   res.render('pages/checkout', {total: total});
});

app.post('/place_order', (req, res) => {
   const name = req.body.name;
   const email = req.body.email;
   const phone = req.body.phone;
   const city = req.body.city;
   const address = req.body.address;
   const cost = req.session.total;
   const status = "not paid";
   const date = new Date();
   let products_ids = "";
   const id = Date.now();
   req.session.order_id = id;
   
   const cart = req.session.cart;
   for(let i = 0; i < cart.length; i++) {
      products_ids = products_ids + "," + cart[i].id;
   }

   const query = "INSERT INTO orders (id, cost, name, email, status, city, address, phone, date, products_ids) VALUES ?";
   const values = [[id, cost, name, email, status, city, address, phone, date, products_ids]];
   
   pool.query(query, [values], (err, result) => {
      if(err) console.log(err);
      
      for(let i = 0; i < cart.length; i++) {
         const query2 = "INSERT INTO order_items (order_id, product_id, product_name, product_price, product_image, product_quantity, order_date) VALUES ?";
         const values2 = [[id, cart[i].id, cart[i].name, cart[i].price, cart[i].image, cart[i].quantity, new Date()]];
         pool.query(query2, [values2], (err, result) => {
            if(err) console.log(err);
         });
      }
      res.redirect('/payment');
   });
});

app.get('/payment', (req, res) => {
   const total = req.session.total;
   res.render('pages/payment', {total: total});
});

app.get("/verify_payment", (req, res) => {
   const transaction_id = req.query.transaction_id;
   const order_id = req.session.order_id;

   const query = "INSERT INTO payments (order_id, transaction_id, date) VALUES ?";
   const values = [[order_id, transaction_id, new Date()]];
   
   pool.query(query, [values], (err, result) => {
      if(err) console.log(err);
      pool.query("UPDATE orders SET status='paid' WHERE id='" + order_id + "'", (err, result) => {
         if(err) console.log(err);
      });
      res.redirect('/thank_you');
   });
});

app.get("/thank_you", (req, res) => {
   const order_id = req.session.order_id;
   res.render("pages/thank_you", {order_id: order_id});
});

app.get('/single_product', (req, res) => {
   const id = req.query.id;
   pool.query("SELECT * FROM products WHERE id='" + id + "'", (err, result) => {
      if(err) console.log(err);
      res.render('pages/single_product', {result: result});
   });
});

app.get('/products', (req, res) => {
   pool.query("SELECT * FROM products", (err, result) => {
      if(err) console.log(err);
      res.render('pages/products', {result: result});
   });
});

app.get('/about', (req, res) => {
   res.render('pages/about');
});

app.listen(8080, () => {
   console.log("Server running on port 8080");
});