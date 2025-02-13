import { connect } from 'mongoose';

const connectDB = async () => {
    try {
        const mongoURI = process.env.NODE_ENV === 'production'
            ? process.env.MONGODB_URI_ATLAS
            : process.env.MONGODB_URI;

        await connect(mongoURI);
        console.log(`Connected to MongoDB... Environment: ${process.env.NODE_ENV}`);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;