import express from 'express';
import Shop from '../models/Shop.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Create a shop (Shop Owner only)
router.post('/', requireRole(['shopowner']), async (req, res) => {
    try {
        const { name, type, description, logo, telegramBotToken } = req.body;
        const owner = req.user._id;
        // Prevent multiple shops per owner (optional)
        const existingShop = await Shop.findOne({ owner });
        if (existingShop) return res.status(400).json({ msg: 'Shop already exists for this owner.' });

        const shop = new Shop({ name, type, description, logo, telegramBotToken, owner });
        await shop.save();
        res.status(201).json(shop);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// Get current user's shop (Shop Owner)
router.get('/my', requireRole(['shopowner']), async (req, res) => {
    try {
        const shop = await Shop.findOne({ owner: req.user._id });
        if (!shop) return res.status(404).json({ msg: 'Shop not found.' });
        res.json(shop);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// Update shop (Shop Owner only)
router.put('/my', requireRole(['shopowner']), async (req, res) => {
    try {
        const updates = req.body;
        const shop = await Shop.findOneAndUpdate(
            { owner: req.user._id },
            updates,
            { new: true }
        );
        if (!shop) return res.status(404).json({ msg: 'Shop not found.' });
        res.json(shop);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// Super Admin: Get all shops
router.get('/', requireRole(['superadmin']), async (req, res) => {
    try {
        const shops = await Shop.find().populate('owner', 'name email phone');
        res.json(shops);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

router.delete('/my', requireRole(['shopowner']), async (req, res) => {
    const shop = await Shop.findOneAndUpdate(
        { owner: req.user._id },
        { isActive: false },
        { new: true }
    );
    res.json({ msg: 'Shop deactivated', shop });
});

router.get('/:id', async (req, res) => {
    const shop = await Shop.findById(req.params.id).select('-telegramBotToken');
    if (!shop) return res.status(404).json({ msg: 'Shop not found' });
    res.json(shop);
});



export default router;