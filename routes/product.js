import express from 'express';
import Product from '../models/Product.js';
import Shop from '../models/Shop.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Create product (Shop Owner only)
router.post('/add', requireRole(['shopowner']), async (req, res) => {
    try {
        const { name, price, description, image } = req.body;
        const shop = await Shop.findOne({ owner: req.user._id, isActive: true });
        if (!shop) return res.status(400).json({ msg: 'Active shop not found for owner.' });

        const product = new Product({ name, price, description, image, shop: shop._id });
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// Get all products for current shop owner
router.get('/my', requireRole(['shopowner']), async (req, res) => {
    try {
        const shop = await Shop.findOne({ owner: req.user._id, isActive: true });
        if (!shop) return res.status(400).json({ msg: 'Active shop not found for owner.' });

        const products = await Product.find({ shop: shop._id, isActive: true });
        res.json(products);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// Update product (Shop Owner only)
router.put('/:id', requireRole(['shopowner']), async (req, res) => {
    try {
        const shop = await Shop.findOne({ owner: req.user._id, isActive: true });
        if (!shop) return res.status(400).json({ msg: 'Active shop not found for owner.' });

        const product = await Product.findOneAndUpdate(
            { _id: req.params.id, shop: shop._id },
            req.body,
            { new: true }
        );
        if (!product) return res.status(404).json({ msg: 'Product not found.' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// Delete product (soft delete)
router.delete('/:id', requireRole(['shopowner']), async (req, res) => {
    try {
        const shop = await Shop.findOne({ owner: req.user._id, isActive: true });
        if (!shop) return res.status(400).json({ msg: 'Active shop not found for owner.' });

        const product = await Product.findOneAndUpdate(
            { _id: req.params.id, shop: shop._id },
            { isActive: false },
            { new: true }
        );
        if (!product) return res.status(404).json({ msg: 'Product not found.' });
        res.json({ msg: 'Product deactivated', product });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// Public: Get products by shop id
router.get('/shop/:shopId', async (req, res) => {
    try {
        const products = await Product.find({ shop: req.params.shopId, isActive: true });
        res.json(products);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

export default router;