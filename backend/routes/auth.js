// backend/routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // make sure .js extension

const router = express.Router();

// =================== REGISTER ===================
router.post('/register', async (req, res) => {
    try {
        const { name, email, rollNo, password } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ message: 'Missing fields' });

        const existing = await User.findOne({ email });
        if (existing)
            return res.status(400).json({ message: 'Email already registered' });

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        const user = new User({ name, email, rollNo, password: hashed });
        await user.save();

        const token = jwt.sign(
            { id: user._id, name: user.name, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// =================== LOGIN ===================
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: 'Missing fields' });

        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user._id, name: user.name, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
