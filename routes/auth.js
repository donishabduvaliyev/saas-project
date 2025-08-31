import express    from  'express';
import bcrypt    from   'bcryptjs';
import jwt     from  'jsonwebtoken';
import User   from  '../models/User.js';
import { requireRole } from '../middleware/roleMiddleware.js';
const router = express.Router();

// register
router.post('/register', async (req, res) => {
    const { name, email, password, role ,phone} = req.body;
    try {
        const userExists = await User.findOne({ phone });
        if (userExists) return res.status(400).json({ msg: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name,phone, email, password: hashedPassword, role });
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { phone, password } = req.body;
    try {
        const user = await User.findOne({ phone });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

router.get('/admin-only', requireRole(['superadmin']), (req, res) => {
    res.json({ msg: 'Welcome, Super Admin!' });
});

// Shop Owner or Super Admin can access
router.get('/shop-dashboard', requireRole(['shopowner', 'superadmin']), (req, res) => {
    res.json({ msg: 'Welcome to Shop Dashboard!' });
});

export default router;