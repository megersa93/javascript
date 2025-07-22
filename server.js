// server.js
// Main entry point for the E-commerce Node.js application

const express = require('express');
const app = express();
const port = 3000;

// Import route modules
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');

// --- Middleware Setup ---

// Enable JSON body parsing for POST requests
app.use(express.json());

// Serve static files from the 'public' directory
// This means any files in the 'public' folder (like index.html, CSS, images, product.html)
// will be accessible directly via the server's root URL.
app.use(express.static('public'));

// --- Route Mounting ---

// Mount product routes under the /api/products path
app.use('/api/products', productRoutes);

// Mount cart routes under the /api/cart path
app.use('/api/cart', cartRoutes);

// --- Catch-all Route for 404 Not Found errors ---
// This middleware will be executed for any request that doesn't match
// the routes defined above.
app.use((req, res, next) => {
  res.status(404).send('Sorry, that page cannot be found!');
});

// --- Server Start ---

// Start the server and listen for incoming requests on the specified port
app.listen(port, () => {
  console.log(`E-commerce Server is running on http://localhost:${port}`);
  console.log(`Visit http://localhost:${port} to view products.`);
  console.log(`API endpoints: /api/products, /api/products/:id, /api/cart, /api/cart/add, /api/cart/remove`);
});