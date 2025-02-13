import express from 'express';
import { auth, isAdmin, isBusiness } from '../MiddleWare/authMiddleware.js'; // ✅ Ensure `.js` is included
import Card from '../Schemas/cardSchema.js'; // ✅ Ensure `.js` is included

const router = express.Router();
// GET /cards - Get all cards
router.get('/', async (req, res) => {
    try {
        const cards = await Card.find();
        res.json(cards);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /cards/my-cards - Get user's cards
router.get('/my-cards', auth, async (req, res) => {
    try {
        const cards = await Card.find({ user_id: req.user._id });
        res.json(cards);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /cards/:id - Get card by ID
router.get('/:id', async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }
        res.json(card);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /cards - Create new card
router.post('/', auth, isBusiness, async (req, res) => {
    try {
        const card = new Card({
            ...req.body,
            user_id: req.user._id,
            bizNumber: await generateUniqueBizNumber()
        });
        await card.save();
        res.status(201).json(card);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT /cards/:id - Update card
router.put('/:id', auth, async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }

        // Verify card owner
        if (card.user_id.toString() !== req.user._id && !req.user.isAdmin) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const updatedCard = await Card.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedCard);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PATCH /cards/:id - Like/unlike card
router.patch('/:id', auth, async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }

        const userLikeIndex = card.likes.indexOf(req.user._id);
        if (userLikeIndex === -1) {
            card.likes.push(req.user._id);
        } else {
            card.likes.splice(userLikeIndex, 1);
        }

        await card.save();
        res.json(card);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PATCH /cards/:id/biz-number - Update bizNumber (admin only)
router.patch('/:id/biz-number', auth, isAdmin, async (req, res) => {
    try {
        const { bizNumber } = req.body;

        // Check if bizNumber is provided
        if (!bizNumber) {
            return res.status(400).json({ error: 'bizNumber is required' });
        }

        // Check bizNumber range
        const bizNumberInt = parseInt(bizNumber);
        if (bizNumberInt < 1000000 || bizNumberInt > 9999999) {
            return res.status(400).json({
                error: 'Business number must be between 1,000,000 and 9,999,999'
            });
        }

        // Check if this bizNumber is already in use by another card
        const existingCard = await Card.findOne({
            bizNumber: bizNumberInt,
            _id: { $ne: req.params.id } // Exclude current card
        });

        if (existingCard) {
            return res.status(400).json({
                error: 'This business number is already in use by another card'
            });
        }

        // Update the card
        const card = await Card.findByIdAndUpdate(
            req.params.id,
            { bizNumber: bizNumberInt },
            { new: true }
        );

        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }

        res.json(card);
    } catch (error) {
        res.status(400).json({
            error: 'Failed to update business number',
            details: error.message
        });
    }
});

// DELETE /cards/:id - Delete card
router.delete('/:id', auth, async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }

        // Check if user is card owner or admin
        if (card.user_id.toString() !== req.user._id && !req.user.isAdmin) {
            return res.status(403).json({ error: 'Access denied' });
        }

        await card.deleteOne();
        res.json({ message: 'Card deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Helper function to generate unique bizNumber
async function generateUniqueBizNumber() {
    const maxAttempts = 100; // מניעת לולאה אינסופית
    let attempts = 0;

    while (attempts < maxAttempts) {
        // יצירת מספר בין 1,000,000 ל-9,999,999
        const randomNumber = Math.floor(Math.random() * 9000000) + 1000000;

        // בדיקה שהמספר לא בשימוש
        const existingCard = await Card.findOne({ bizNumber: randomNumber });

        if (!existingCard) {
            return randomNumber;
        }

        attempts++;
    }

    // אם לא נמצא מספר פנוי אחרי 100 ניסיונות
    throw new Error('Failed to generate unique business number after maximum attempts');
}

export default router;