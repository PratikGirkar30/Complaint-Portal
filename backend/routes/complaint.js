import express from 'express';
import Complaint from '../models/complaint.js';
import { requireAuth, requireAdmin, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// PUBLIC: submit complaint (token optional)
router.post('/submit', optionalAuth, async (req, res) => {
    try {
        const { title, description, category, isAnonymous, name, email, rollNo } = req.body;
        console.log(req.body);
        let userRef = req.user ? req.user.id : null;
        let storedName, storedEmail, storedRoll;
        if (req.body.isAnonymous == true) {
            storedName = 'Anonymous';
            storedEmail = undefined;
            storedRoll = undefined;
        } else if (req.user) {
            // Logged-in user, use info from token
            storedName = req.user.name;
            storedEmail = req.user.email;
            storedRoll = req.user.rollNo || rollNo;
        } else {
            // Not logged-in, take from form
            storedName = name || 'Anonymous';
            storedEmail = email || undefined;
            storedRoll = rollNo || undefined;
        }

        const complaint = new Complaint({
            title,
            description,
            category,
            isAnonymous,
            user: userRef,
            name: storedName,
            email: storedEmail,
            rollNo: storedRoll
        });

        await complaint.save();
        res.status(201).json({ message: 'Complaint submitted successfully', complaint });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET logged-in user's complaints
router.get('/my', requireAuth, async (req, res) => {
    try {
        const complaints = await Complaint.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(complaints);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET all complaints (admin)
router.get('/', requireAuth, requireAdmin, async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .populate('user', 'name email rollNo')
            .sort({ createdAt: -1 });
        res.json(complaints);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update complaint status (admin)
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const updated = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const deleted = await Complaint.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Complaint not found" });
        res.json({ message: "Complaint deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;

