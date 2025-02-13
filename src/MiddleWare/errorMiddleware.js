import { existsSync, mkdirSync, appendFileSync } from 'fs';
import { join } from 'path';

// Create error logger
const logError = (error, req) => {
    if (error.statusCode >= 400) {
        const logsDir = join(__dirname, '..', 'Logs');
        const currentDate = new Date().toISOString().split('T')[0];
        const logFilePath = join(logsDir, `${currentDate}.log`);

        // Create logs directory if it doesn't exist
        if (!existsSync(logsDir)) {
            mkdirSync(logsDir, { recursive: true });
        }

        const logEntry = {
            timestamp: new Date().toISOString(),
            statusCode: error.statusCode || 500,
            method: req.method,
            url: req.originalUrl,
            message: error.message,
            // Additional helpful info
            details: {
                body: req.body,
                params: req.params,
                query: req.query,
                userId: req.user?._id
            }
        };
        // Security: Remove sensitive data
        if (logEntry.details.body?.password) {
            logEntry.details.body.password = '[FILTERED]';
        }

        try {
            appendFileSync(
                logFilePath,
                JSON.stringify(logEntry) + '\n',
                'utf8'
            );

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
    // Set status code
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);

    // Log error
    err.statusCode = statusCode;
    logError(err, req);

    // Send error response
    res.json({
        status: 'error',
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        // Add request ID or correlation ID if you implement it later
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
