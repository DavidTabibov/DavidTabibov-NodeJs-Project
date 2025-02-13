import morgan from 'morgan';
import path from 'path';
import fs from 'fs';

const logsDir = path.join(process.cwd(), 'src', 'Logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

morgan.token('timestamp', () => new Date().toISOString());

const logFormat = ':timestamp :method :url :status :response-time ms';

const accessLogStream = fs.createWriteStream(
    path.join(logsDir, 'access.log'),
    { flags: 'a' }
);

const logger = morgan(logFormat, {
    stream: accessLogStream
});

let combinedLogger = logger;

if (process.env.NODE_ENV === 'development') {
    morgan.token('coloredStatus', (req, res) => {
        const status = res.statusCode;
        const color = status >= 500 ? 31
            : status >= 400 ? 33
                : status >= 300 ? 36
                    : 32;
        return `\x1b[${color}m${status}\x1b[0m`;
    });

    const devLogFormat = '\x1b[36m:timestamp\x1b[0m :method :url :coloredStatus :response-time ms';
    const consoleLogger = morgan(devLogFormat);

    combinedLogger = (req, res, next) => {
        consoleLogger(req, res, (err) => {
            if (err) return next(err);
            logger(req, res, next);
        });
    };
}

export default combinedLogger;