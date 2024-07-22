const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
    const products = await Product.find({});
    res.json(products);
});

// Get product by ID
router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.json(product);
});

// Create a product
router.post('/', async (req, res) => {
    const { name, price, description, countInStock, image } = req.body;
    const product = new Product({
        name,
        price,
        description,
        countInStock,
        image,
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// Update a product
router.put('/:id', async (req, res) => {
    const { name, price, description, countInStock, image } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name;
        product.price = price;
        product.description = description;
        product.countInStock = countInStock;
        product.image = image;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// Delete a product
router.delete('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        await product.remove();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

module.exports = router;
