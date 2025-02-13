import Card from '../Schemas/cardSchema.js';

const generateBizNumber = async () => {
    while (true) {
        const randomNumber = Math.floor(Math.random() * 1000000) + 1000000;
        const existingCard = await Card.findOne({ bizNumber: randomNumber.toString() });
        if (!existingCard) {
            return randomNumber.toString();
        }
    }
};

const validateBizNumberAvailability = async (bizNumber) => {
    const existingCard = await Card.findOne({ bizNumber });
    return !existingCard;
};

export { generateBizNumber, validateBizNumberAvailability };