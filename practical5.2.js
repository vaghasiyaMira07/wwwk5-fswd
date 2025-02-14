const express = require('express');

const app = express();
const PORT = 3000;

// Sample product data
const products = [
    { id: 1, name: "Smartphone", category: "electronics", price: 500 },
    { id: 2, name: "Laptop", category: "electronics", price: 1200 },
    { id: 3, name: "Headphones", category: "accessories", price: 100 },
    { id: 4, name: "Tablet", category: "electronics", price: 800 },
    { id: 5, name: "Backpack", category: "fashion", price: 50 }
];

// Route: Get all products
app.get('/products', (req, res) => {
    const { category } = req.query;
    if (category) {
        const filteredProducts = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
        return res.json(filteredProducts);
    }
    res.json(products);
});

// Route: Get a specific product by ID
app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
});

// Start server
app.listen(PORT, () => {
    console.log(`E-Commerce API running on http://localhost:${PORT}`);
});
