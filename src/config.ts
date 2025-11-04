import path from 'path';
import dotenv from 'dotenv';
dotenv.config({
    path: path.join(__dirname, '../.env'),
});

export const config = {
    port: process.env.PORT || 3047,
    env: process.env.NODE_ENV || 'development',
    dbUrl: process.env.DB_URL || 'mongodb://localhost:27017?retryWrites=true',
    dbName: process.env.DB_NAME || 'main_db',
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
    logLevel: process.env.LOG_LEVEL || 'info',
    apiPrefix: process.env.API_PREFIX || '/api',
    corsOrigin: process.env.CORS_ORIGIN || '*',
    rateLimit: {
        windowMs:
            parseInt(process.env.RATE_LIMIT_WINDOW_MS || '15') * 60 * 1000, // 15 minutes
        max: parseInt(process.env.RATE_LIMIT_MAX || '100'), // limit each IP to 100 requests per windowMs
    },
    sessionSecret: process.env.SESSION_SECRET || 'your_session_secret',
    sessionCookie: {
        maxAge:
            parseInt(process.env.SESSION_COOKIE_MAX_AGE!) ||
            24 * 60 * 60 * 6000, // 1 hour
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // true in production
        sameSite: 'lax', // CSRF protection
        path: '/',
        domain: process.env.SESSION_COOKIE_DOMAIN || undefined, // Set domain if needed
    },
    uploadDir: process.env.UPLOAD_DIR || 'uploads',
    allowedFileTypes: process.env.ALLOWED_FILE_TYPES
        ? process.env.ALLOWED_FILE_TYPES.split(',')
        : ['image/jpeg', 'image/png', 'application/pdf'],
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10 MB
    smtp: {
        host: process.env.SMTP_HOST || 'smtp.example.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        user: process.env.SMTP_USER || '    ',
        pass: process.env.SMTP_PASS || '',
        secure: true, // true for 465, false for other ports
    },
    emailFrom: process.env.EMAIL_FROM || '  <   >',
    emailTo: process.env.EMAIL_TO || '  <   >',
    emailSubject: process.env.EMAIL_SUBJECT || 'Default Subject',
    emailText: process.env.EMAIL_TEXT || 'Default email text',
    emailHtml: process.env.EMAIL_HTML || '<p>Default email HTML content</p>',
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD || '',
        db: parseInt(process.env.REDIS_DB || '0'),
    },
    enable_logs: process.env.ENABLE_DEBUG_LOGS || false,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || '',
    publicCompany: {
        companyId: process.env.PUBLIC_COMPANY_ID || '',
        userGroupId: process.env.PUBLIC_COMPANY_USER_GROUP_ID || '',
    },
    pinecone: {
        apiKey: process.env.PINECONE_API_KEY || '',
        indexName: process.env.PINECONE_INDEX_NAME || 'ai-kb-platform',
        environment: process.env.PINECONE_ENVIRONMENT || 'us-west4-gcp',
    },
};
