import express from 'express';
import { auth, isAdmin, isBusiness } from '../MiddleWare/authMiddleware.js';
import { getAllCards, getUserCards, getCardById, createCard } from '../Controllers/cardController.js';
import { updateCard, toggleLikeCard, deleteCard } from '../Controllers/cardOperations.js';
import Card from '../Schemas/cardSchema.js';

const router = express.Router();

// Public routes – שליפת כרטיסים
router.get('/', getAllCards);

// Protected routes – דרוש אימות
router.get('/my-cards', auth, getUserCards); // יש למקם את הנתיב הזה לפני הנתיב הדינמי
router.get('/:id', getCardById);

router.post('/', auth, isBusiness, createCard);
router.put('/:id', auth, updateCard);
router.patch('/:id', auth, toggleLikeCard);

// Route לעדכון bizNumber – רק מנהלים
router.patch('/:id/biz-number', auth, isAdmin, async (req, res) => {
    const { bizNumber } = req.body;
    if (!bizNumber) {
        return res.status(400).json({ error: 'bizNumber is required' });
    }
    const bizNumberInt = parseInt(bizNumber, 10);
    if (bizNumberInt < 1000000 || bizNumberInt > 9999999) {
        return res.status(400).json({ error: 'Business number must be between 1,000,000 and 9,999,999' });
    }
    try {
        // בדיקת זמינות bizNumber לכרטיס אחר
        const existingCard = await Card.findOne({
            bizNumber: bizNumberInt,
            _id: { $ne: req.params.id }
        });
        if (existingCard) {
            return res.status(400).json({ error: 'This business number is already in use by another card' });
        }
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
        res.status(400).json({ error: error.message });
    }
});

// Delete card – רק בעל הכרטיס או מנהל
router.delete('/:id', auth, deleteCard);

export default router;
