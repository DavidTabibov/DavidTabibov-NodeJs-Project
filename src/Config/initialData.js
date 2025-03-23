import bcryptjs from 'bcryptjs';
import mongoose from 'mongoose';

import User from '../Schemas/userSchema.js';
import Card from '../Schemas/cardSchema.js';

const createInitialUsers = async () => {
    const users = [
        {
            name: { first: "Regular", middle: "", last: "User" },
            phone: "050-0000000",
            email: "regular@example.com",
            password: "Aa123456!",
            image: { url: "", alt: "" },
            address: {
                state: "",
                country: "Israel",
                city: "Tel Aviv",
                street: "Main Street",
                houseNumber: 1,
                zip: 0
            },
            isBusiness: false,
            isAdmin: false
        },
        {
            name: { first: "Business", middle: "", last: "User" },
            phone: "050-0000000",
            email: "business@example.com",
            password: "Aa123456!",
            image: { url: "", alt: "" },
            address: {
                state: "",
                country: "Israel",
                city: "Tel Aviv",
                street: "Business St",
                houseNumber: 2,
                zip: 0
            },
            isBusiness: true,
            isAdmin: false
        },
        {
            name: { first: "Admin", middle: "", last: "User" },
            phone: "050-0000000",
            email: "admin@example.com",
            password: "Aa123456!",
            image: { url: "", alt: "" },
            address: {
                state: "",
                country: "Israel",
                city: "Tel Aviv",
                street: "Admin St",
                houseNumber: 3,
                zip: 0
            },
            isBusiness: true,
            isAdmin: true
        }
    ];

    for (const userData of users) {
        try {
            const exists = await User.findOne({ email: userData.email });
            if (!exists) {
                const salt = await bcryptjs.genSalt(10);
                userData.password = await bcryptjs.hash(userData.password, salt);
                await new User(userData).save();
                console.log(`Created user: ${userData.email}`);
            } else {
                console.log(`User already exists: ${userData.email}`);
            }
        } catch (error) {
            console.error(`Error creating user ${userData.email}:`, error.message);
        }
    }

    // ודא שקיים משתמש עסקי - אם לא, זרוק שגיאה ברורה
    const businessUser = await User.findOne({ isBusiness: true });
    if (!businessUser) {
        throw new Error('No business user found. Please check the user data.');
    }
    return businessUser;
};

const createInitialCards = async (businessUserId) => {
    const cards = [
        {
            title: "First Business Card",
            subtitle: "Electronics Store",
            description: "Your one-stop electronics shop",
            phone: "050-0000000",
            email: "store1@cards.com",
            web: "https://www.test.co.il",
            image: {
                url: "https://cdn.pixabay.com/photo/2016/04/20/08/21/entrepreneur-1340649_960_720.jpg",
                alt: "business card image",
                _id: new mongoose.Types.ObjectId()
            },
            address: {
                state: "",
                country: "test",
                city: "test",
                street: "test",
                houseNumber: 1,
                zip: 0,
                _id: new mongoose.Types.ObjectId()
            },
            bizNumber: 1000001,
            likes: [],
            user_id: businessUserId
        },
        {
            title: "Second Business Card",
            subtitle: "Restaurant",
            description: "Fine dining experience",
            phone: "050-0000000",
            email: "store2@cards.com",
            web: "https://www.test.co.il",
            image: {
                url: "https://cdn.pixabay.com/photo/2016/04/20/08/21/entrepreneur-1340649_960_720.jpg",
                alt: "business card image",
                _id: new mongoose.Types.ObjectId()
            },
            address: {
                state: "",
                country: "test",
                city: "test",
                street: "test",
                houseNumber: 2,
                zip: 0,
                _id: new mongoose.Types.ObjectId()
            },
            bizNumber: 1000002,
            likes: [],
            user_id: businessUserId
        },
        {
            title: "third card",
            subtitle: "this is the third card",
            description: "this is the third card in the database",
            phone: "050-0000000",
            email: "thirdcard@gmail.com",
            web: "https://www.test.co.il",
            image: {
                url: "https://cdn.pixabay.com/photo/2016/04/20/08/21/entrepreneur-1340649_960_720.jpg",
                alt: "business card image",
                _id: new mongoose.Types.ObjectId()
            },
            address: {
                state: "",
                country: "test",
                city: "test",
                street: "test",
                houseNumber: 3,
                zip: 0,
                _id: new mongoose.Types.ObjectId()
            },
            bizNumber: 6943518,
            likes: [],
            user_id: businessUserId
        }
    ];

    for (const cardData of cards) {
        try {
            const exists = await Card.findOne({ bizNumber: cardData.bizNumber });
            if (!exists) {
                await new Card(cardData).save();
                console.log(`Created card with bizNumber: ${cardData.bizNumber}`);
            } else {
                console.log(`Card already exists with bizNumber: ${cardData.bizNumber}`);
            }
        } catch (error) {
            console.error(`Error creating card with bizNumber ${cardData.bizNumber}:`, error.message);
        }
    }
};

const initializeData = async () => {
    try {
        console.log('Starting data initialization...');
        const businessUser = await createInitialUsers();
        await createInitialCards(businessUser._id);
        console.log('Data initialization completed successfully');
    } catch (error) {
        console.error('Error initializing data:', error);
        throw error;
    }
};

export { initializeData };
