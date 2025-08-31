import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Shop from '../models/Shop.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Create order (Customer)
router.post('/create', requireRole(['customer']), async (req, res) => {
    try {
        const { shopId, items, customerName, customerPhone, customerAddress, customerTelegramId } = req.body;
        if (!shopId || !items || items.length === 0) {
            return res.status(400).json({ msg: 'Shop and items are required.' });
        }
        const shop = await Shop.findById(shopId);
        if (!shop || !shop.isActive) {
            return res.status(404).json({ msg: 'Shop not found or inactive.' });
        }

        // Validate products and calculate total
        let total = 0;
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product || !product.isActive) {
                return res.status(400).json({ msg: `Product not found: ${item.product}` });
            }
            total += product.price * item.quantity;
        }

        const order = new Order({
            shop: shopId,
            customer: req.user._id,
            items,
            total,
            status: 'pending',
            customerName,
            customerPhone,
            customerAddress,
            customerTelegramId
        });
        await order.save();
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// Get orders for shop owner
router.get('/shop', requireRole(['shopowner']), async (req, res) => {
    try {
        const shop = await Shop.findOne({ owner: req.user._id, isActive: true });
        if (!shop) return res.status(404).json({ msg: 'Active shop not found.' });

        const orders = await Order.find({ shop: shop._id }).populate('customer', 'name phone');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// Get orders for customer
router.get('/my', requireRole(['customer']), async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.user._id }).populate('shop', 'name');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// Update order status (Shop Owner only)
router.put('/:id/status', requireRole(['shopowner']), async (req, res) => {
    try {
        const { status } = req.body;
        if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({ msg: 'Invalid status.' });
        }
        const shop = await Shop.findOne({ owner: req.user._id, isActive: true });
        if (!shop) return res.status(404).json({ msg: 'Active shop not found.' });

        const order = await Order.findOneAndUpdate(
            { _id: req.params.id, shop: shop._id },
            { status },
            { new: true }
        );
        if (!order) return res.status(404).json({ msg: 'Order not found.' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// Super Admin: Get all orders
router.get('/all', requireRole(['superadmin']), async (req, res) => {
    try {
        const orders = await Order.find().populate('shop', 'name').populate('customer', 'name phone');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

export default router;