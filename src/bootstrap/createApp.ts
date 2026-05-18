import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import { corsConfig } from '@/config/cors.config';
import globalErrorHandler from '@/middlewares/globalErrorHandler';
import { requestContext } from '@/middlewares/requestContext';
import { sendResponse } from '@/shared/utils/sendResponse';

import { httpLogger } from './logger';
import { appConfig } from '../config/app.config';
import { openApiDocument } from '../docs/openapi';
import { notFound } from '../middlewares/notFound';
import { rateLimiter } from '../middlewares/rateLimiter';
import { apiRouter } from '../routes';

import type { RequestHandler } from 'express';

export const createApp = () => {
  const app = express();

  app.disable('x-powered-by');
  if (appConfig.trustProxy) {
    app.set('trust proxy', 1);
  }

  app.use(httpLogger as unknown as RequestHandler);
  app.use(helmet() as unknown as RequestHandler);
  app.use(cors(corsConfig));
  app.use(rateLimiter);
  app.use(compression());
  app.use(cookieParser());
  app.use(express.json({ limit: '1mb' }) as unknown as RequestHandler);
  app.use(express.urlencoded({ extended: false }) as unknown as RequestHandler);
  app.use(requestContext);

  app.get('/', (_req, res) => {
    sendResponse(res, 200, {
      success: true,
      message: 'Api Worked',
    });
  });

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
  app.use('/api/v1', apiRouter);
  app.use(notFound);
  app.use(globalErrorHandler);

  return app;
};
