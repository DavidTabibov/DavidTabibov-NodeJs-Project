import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { auth, isAdmin } from '../MiddleWare/authMiddleware.js'; // ✅ Ensure `.js` is included
import User from '../Schemas/userSchema.js'; // ✅ Ensure `.js` is included

const router = express.Router();
// POST /users/login - Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Validate password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Generate token
        const token = jwt.sign(
            { _id: user._id, isBusiness: user.isBusiness, isAdmin: user.isAdmin },
            process.env.JWT_SECRET
        );

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /users - Register new user
router.post('/', async (req, res) => {
    try {
        // Check if user already exists
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: 'User already registered' });
        }

        // Create new user
        user = new User(req.body);

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();

        // Generate token
        const token = jwt.sign(
            { _id: user._id, isBusiness: user.isBusiness, isAdmin: user.isAdmin },
            process.env.JWT_SECRET
        );

        res.status(201).json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// GET /users/:id - Get user by ID
router.get('/:id', auth, async (req, res) => {
    try {
        // Users can only access their own data unless they're admin
        if (req.params.id !== req.user._id && !req.user.isAdmin) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /users - Get all users (admin only)
router.get('/', auth, isAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /users/:id - Update user
router.put('/:id', auth, async (req, res) => {
    try {
        // Users can only update their own data
        if (req.params.id !== req.user._id && !req.user.isAdmin) {
            return res.status(403).json({ error: 'Access denied - Only admin can update other users' });
        }
        // Don't allow updates to isAdmin status
        if (!req.user.isAdmin) {
            delete req.body.isAdmin;
        }

        // If password is being updated, hash it
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PATCH /users/:id - Update business status
router.patch('/:id', auth, async (req, res) => {
    try {
        // Users can only update their own business status
        if (req.params.id !== req.user._id && !req.user.isAdmin) {
            return res.status(403).json({ error: 'Access denied - Only admin can change other users status' });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isBusiness: req.body.isBusiness },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE /users/:id - Delete user
router.delete('/:id', auth, async (req, res) => {
    try {
        // Users can only delete their own account or admin can delete any account
        if (req.params.id !== req.user._id && !req.user.isAdmin) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;