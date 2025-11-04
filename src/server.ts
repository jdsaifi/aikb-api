import app from './app';
import { config } from './config';
import os from 'os';
import cluster from 'cluster';
import { MongooseConnect } from './library/mongooseConnect';
import { Logger } from './utils/logger';

async function runServer() {
    // Connect to the database
    MongooseConnect()
        .then(() => {
            Logger.info('Database connected successfully');

            app.listen(config.port, () => {
                Logger.info(
                    `Server is running @ ${os.hostname()}:${config.port}`
                );
                Logger.info(`Environment: ${config.env}`);
            });
        })
        .catch((error) => {
            Logger.error({
                event: 'Database Connection Error',
                error,
            });
            process.exit(1);
        });

    // app.listen(config.port, () => {
    //     console.log(`Server is running on http://localhost:${config.port}`);
    //     console.log(`Environment: ${config.env}`);
    // });
}

// runServer().catch((error) => {
//     console.error('Failed to start the server:', error);
//     process.exit(1);
// });

if (cluster.isPrimary) {
    const noCPU: number = config.env == 'development' ? 1 : os.cpus().length;
    for (let i = 0; i < noCPU; i++) {
        cluster.fork();
    }
} else {
    runServer();
}
