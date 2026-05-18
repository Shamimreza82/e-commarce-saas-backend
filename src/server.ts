import { createApp } from './bootstrap/createApp';
import { logger } from './bootstrap/logger';
import { appConfig } from './config/app.config';
import { envConfig } from './config/env.config';

const app = createApp();

if (process.env['VERCEL']) {
  // For Vercel, we just export the app
  module.exports = app;
} else {
  // For other environments, we start the server manually
  try {
    app.listen(appConfig.port, () => {
      logger.info(
        {
          event: 'SERVER_START',
          port: appConfig.port,
          environment: envConfig.nodeEnv,
          pid: process.pid,
          nodeVersion: process.version,
        },
        'Server started successfully',
      );
    });

    // Handle signals for non-vercel environments
    const shutdown = (signal: string) => {
      logger.info({ signal }, 'Received shutdown signal');
      process.exit(0);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('uncaughtException', (error) => {
      logger.fatal({ err: error }, 'Uncaught exception');
      process.exit(1);
    });
    process.on('unhandledRejection', (reason) => {
      logger.fatal({ err: reason }, 'Unhandled rejection');
      process.exit(1);
    });
  } catch (error: unknown) {
    logger.fatal({ err: error }, 'Startup failed');
    process.exit(1);
  }
}

export default app;
