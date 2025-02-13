import jwt from 'jsonwebtoken';
import User from '../Schemas/userSchema.js';
import Card from '../Schemas/cardSchema.js';

const auth = async (req, res, next) => {
    try {
        const token = req.header('x-auth-token');
        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(401).json({ error: 'User does not exist.' });
        }

        // שינוי כאן - שמירת כל פרטי המשתמש
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token.' });
    }
};

const isAdmin = (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    next();
};

const isBusiness = (req, res, next) => {
    if (!req.user.isBusiness) {
        return res.status(403).json({ error: 'Access denied. Business users only.' });
    }
    next();
};

const isCardOwner = async (req, res, next) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) {
            return res.status(404).json({ error: 'Card not found.' });
        }

        if (card.user_id.toString() !== req.user._id && !req.user.isAdmin) {
            return res.status(403).json({ error: 'Access denied. Card owner only.' });
        }

        req.card = card;
        next();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};

export { auth, isAdmin, isBusiness, isCardOwner };