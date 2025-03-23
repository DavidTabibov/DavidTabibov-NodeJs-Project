import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync, appendFileSync } from 'fs';

// הגדרת __dirname עבור מודולי ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logError = (error, req) => {
    if (error.statusCode >= 400) {
        const logsDir = join(__dirname, '..', 'Logs');
        const currentDate = new Date().toISOString().split('T')[0];
        const logFilePath = join(logsDir, `${currentDate}.log`);

        // יצירת תיקיית לוגים אם אינה קיימת
        if (!existsSync(logsDir)) {
            mkdirSync(logsDir, { recursive: true });
        }

        const logEntry = {
            timestamp: new Date().toISOString(),
            statusCode: error.statusCode || 500,
            method: req.method,
            url: req.originalUrl,
            message: error.message,
            details: {
                body: req.body,
                params: req.params,
                query: req.query,
                userId: req.user?._id
            }
        };

        // סינון נתונים רגישים
        if (logEntry.details.body?.password) {
            logEntry.details.body.password = '[FILTERED]';
        }

        try {
            appendFileSync(logFilePath, JSON.stringify(logEntry) + '\n', 'utf8');

            if (process.env.NODE_ENV === 'development') {
                console.error('\x1b[31m%s\x1b[0m', 'Error:', {
                    statusCode: error.statusCode,
                    message: error.message,
                    path: req.originalUrl
                });
            }
        } catch (err) {
            console.error('Failed to write to error log:', err);
        }
    }
};

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    err.statusCode = statusCode;
    logError(err, req);
    res.json({
        status: 'error',
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        requestId: req.id
    });
};

// 404 Handler
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// Joi validation error handler
const validationError = (err, req, res, next) => {
    if (err.isJoi) {
        res.status(400);
        return next(new Error(err.details[0].message));
    }
    next(err);
};

export { errorHandler, notFound, validationError };
