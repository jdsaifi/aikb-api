import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morganMiddleware from './middleware/morgan';
import responseFormatter from './middleware/response';
import errorHandler from './middleware/error';
import { Logger } from './utils/logger';
import { corsOptions } from './utils/corsOptions';
import path from 'path';

import routes from './routes';

const app: Express = express();

app.use(cors(corsOptions));
// Explicitly handle OPTIONS requests (preflight)
// app.options('*', cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(cookieParser());

/** middlewares */
app.use(morganMiddleware);
app.use(responseFormatter);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.on('error', (error) => {
    Logger.error({
        event: 'App Error',
        error,
    });
    throw error;
});

app.get('/healthcheck', (req, res) => {
    console.log('Healthcheck endpoint hit');
    res.status(200).json({
        status: 'ok',
        message: 'API is running',
        dt: new Date().toISOString(),
    });
});

app.get('/', (req, res) => {
    console.log('Received a request at /');
    res.send('Welcome to the Law Interview API!');
});

// Register routes
app.use('/api', routes);

/** error handler middleware */
app.use(errorHandler);

/** unhandeled error */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    // log error
    Logger.error({
        event: 'Unhandled Error',
        error: err,
        request: {
            method: req.method,
            url: req.url,
            body: req.body,
            headers: req.headers,
        },
    });
    // Handle the error
    res.status(500).json({
        status: 'error',
        error: {
            code: 500,
            messages: ['Internal server error.', err?.message],
        },
        metadata: {
            timestamp: new Date().toISOString(),
        },
    });
});

export default app;
