export const corsOptions = {
    origin: [
        'http://localhost:3060',
        'https://law.mindsharpner.com',
        'http://localhost:8080',
        'https://aikb-api.mindsharpner.com',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
};
