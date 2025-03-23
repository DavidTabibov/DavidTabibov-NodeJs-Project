import dotenv from 'dotenv';
dotenv.config();

import connectDB from './src/Config/db.js';
import { initializeData } from './src/Config/initialData.js';

(async () => {
    try {
        await connectDB();
        console.log("Connected to MongoDB...");

        await initializeData();
        console.log("Data seeding completed successfully.");
    } catch (error) {
        console.error("Error during data seeding:", error);
    } finally {
        process.exit(0);
    }
})();
