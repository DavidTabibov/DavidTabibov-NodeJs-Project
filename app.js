import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import connectDB from './src/Config/db.js';
import userRoutes from './src/Routes/userRoutes.js';
import cardRoutes from './src/Routes/cardRoutes.js';
import loggerMiddleware from './src/MiddleWare/loggerMiddleware.js';
import { errorHandler, notFound } from './src/MiddleWare/errorMiddleware.js';
import { initializeData } from './src/Config/initialData.js';

dotenv.config();

const app = express();
app.use('/public', express.static(path.join(process.cwd(), 'src', 'public')));
// Create logs directory with ES modules compatible path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDir = path.join(__dirname, 'src', 'Logs');

if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}
// Connect to MongoDB and initialize data
const startServer = async () => {
    try {
        await connectDB();
        console.log('Connected to MongoDB...');

        if (process.env.NODE_ENV === 'development') {
            await initializeData();
        }

        // Middleware
        app.use(express.json());

        // Enhanced CORS configuration
        app.use(cors({
            origin: (origin, callback) => {
                const allowedOrigins = process.env.ALLOWED_ORIGIN.split(',');
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                } else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
            allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
            exposedHeaders: ['x-auth-token'],
            credentials: true,
            optionsSuccessStatus: 200
        }));

        app.use(loggerMiddleware);

        // Enhanced health check route
        app.get('/health', (req, res) => {
            res.json({
                status: 'OK',
                environment: process.env.NODE_ENV,
                timestamp: new Date(),
                mongoConnection: mongoose.connection.readyState === 1,
                serverUptime: process.uptime()
            });
        });

        // Routes
        app.use('/api/users', userRoutes);
        app.use('/api/cards', cardRoutes);

        // 404 handler and Error middleware
        app.use(notFound);
        app.use(errorHandler);

        const port = process.env.PORT || 3000;
        const server = app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
            console.log(`Environment: ${process.env.NODE_ENV}`);
        });

        // Graceful shutdown
        const gracefulShutdown = () => {
            console.log('Starting graceful shutdown...');
            server.close(async () => {
                console.log('Server closed');
                try {
                    await mongoose.connection.close();
                    console.log('MongoDB connection closed');
                    process.exit(0);
                } catch (err) {
                    console.error('Error during shutdown:', err);
                    process.exit(1);
                }
            });
        };

        // Handle shutdown signals
        process.on('SIGTERM', gracefulShutdown);
        process.on('SIGINT', gracefulShutdown);

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Error handling for uncaught exceptions and unhandled rejections
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
    process.exit(1);
});

// Start the server
startServer();