import { config } from '../config';
import { Logger } from '../utils/logger';
import mongoose from 'mongoose';

// mongoose events
mongoose.connection.on('connected', function () {
    Logger.info('[Mongoose connected]');
});

mongoose.connection.on('error', function (err) {
    Logger.error('[Mongoose connection has occured error]', err);
});

mongoose.connection.on('disconnected', function () {
    Logger.warn('[Mongoose connection is disconnected]');
});

export const MongooseConnect = async () => {
    try {
        const connectionInstance = await mongoose.connect(config.dbUrl, {
            dbName: config.dbName,
            autoIndex: true, // Don't do this in production, it's for development only
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            family: 4, // Use IPv4, skip trying IPv6
        });
        Logger.info(
            `Mongoose Connection Hosted @ ${connectionInstance.connection.host}`
        );
    } catch (err) {
        Logger.error('[Mongoose connection failed]', err);
        process.exit(1);
    }
};
