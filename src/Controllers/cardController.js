import Card from '../Schemas/cardSchema.js';
import { formatCardResponse } from '../Utils/cardUtils.js';
import { generateUniqueBizNumber } from '../Services/bizNumberService.js';

// Get all cards
export const getAllCards = async (req, res) => {
    try {
        const cards = await Card.find().lean();
        if (!cards.length) return res.status(404).json({ message: "No cards found" });
        res.status(200).json(cards.map(formatCardResponse));
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Get cards belonging to the authenticated user
export const getUserCards = async (req, res) => {
    try {
        const cards = await Card.find({ user_id: req.user._id });
        res.json(cards.map(formatCardResponse));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a card by ID
export const getCardById = async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) return res.status(404).json({ error: 'Card not found' });
        res.json(formatCardResponse(card));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new card
export const createCard = async (req, res) => {
    try {
        const bizNumber = await generateUniqueBizNumber();
        const newCard = await new Card({ ...req.body, user_id: req.user._id, bizNumber }).save();
        res.status(201).json(formatCardResponse(newCard));
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
