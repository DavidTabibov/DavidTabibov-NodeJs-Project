import Card from '../Schemas/cardSchema.js';

export const generateUniqueBizNumber = async () => {
    const maxAttempts = 100;
    let attempts = 0;

    while (attempts < maxAttempts) {
        // Generate a number between 1,000,000 and 9,999,999
        const randomNumber = Math.floor(Math.random() * 9000000) + 1000000;
        const existingCard = await Card.findOne({ bizNumber: randomNumber });
        if (!existingCard) {
            return randomNumber;
        }
        attempts++;
    }
    throw new Error('Failed to generate unique business number after maximum attempts');
};
