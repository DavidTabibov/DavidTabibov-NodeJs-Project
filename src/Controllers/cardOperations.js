import Card from '../Schemas/cardSchema.js';
import { formatCardResponse, validateUpdate } from './cardUtils.js';

const updateCard = async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) return res.status(404).json({ error: 'Card not found' });
        if (card.user_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const { error, allowedFields } = validateUpdate(req.body);
        if (error) return res.status(400).json(error);

        const updatedCard = await Card.findByIdAndUpdate(req.params.id, allowedFields, { new: true });
        res.json(formatCardResponse(updatedCard));
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const toggleLikeCard = async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) return res.status(404).json({ error: 'Card not found' });

        const likeIndex = card.likes.indexOf(req.user._id);
        if (likeIndex === -1) {
            card.likes.push(req.user._id);
        } else {
            card.likes.splice(likeIndex, 1);
        }

        await card.save();
        res.json(formatCardResponse(card));
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteCard = async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) return res.status(404).json({ error: 'Card not found' });
        if (card.user_id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ error: 'Access denied' });
        }

        await card.deleteOne();
        res.json({ message: 'Card deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { updateCard, toggleLikeCard, deleteCard };