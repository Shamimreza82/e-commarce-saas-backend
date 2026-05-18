import { appConfig } from '@/config/app.config';
import { envConfig } from '@/config/env.config';

import { createApp } from './createApp';
import { logger } from './logger';

import type { Server } from 'node:http';

const shutdown = async (server: Server, signal: string): Promise<void> => {
  logger.info({ signal }, 'Received shutdown signal');

  await new Promise<void>((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

  logger.info('Shutdown completed');
};

export const startServer = (): Server => {
  const app = createApp();

  const server = app.listen(appConfig.port, () => {
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

  const handleSignal = (signal: 'SIGINT' | 'SIGTERM'): void => {
    void shutdown(server, signal)
      .catch((error: unknown) => {
        logger.error({ err: error }, 'Shutdown failed');
      })
      .finally(() => {
        process.exit(0);
      });
  };

  process.on('SIGINT', () => {
    handleSignal('SIGINT');
  });

  process.on('SIGTERM', () => {
    handleSignal('SIGTERM');
  });

  // TODO: add handlers for uncaught exceptions and unhandled promise rejections
  process.on('uncaughtException', (error) => {
    logger.fatal({ err: error }, 'Uncaught exception');
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    logger.fatal({ err: reason }, 'Unhandled rejection');
    process.exit(1);
  });

  return server;
};
