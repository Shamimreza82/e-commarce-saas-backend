import path from 'node:path';

import pino, { type LoggerOptions } from 'pino';

import { envConfig } from '@/config/env.config';

import { getFileTransport, getPrettyTransport, logDir } from './transports';

const isProduction = envConfig.nodeEnv === 'production';

const redactPaths = [
  'req.headers.authorization',
  'req.headers.cookie',
  'req.body.password',
  'req.body.token',
  'req.body.refreshToken',
  'password',
  'token',
  'refreshToken',
  'accessToken',
];

const options: LoggerOptions = {
  level: envConfig.logLevel,
  messageKey: 'message',
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => ({ level: label }),
    bindings: (bindings) => ({
      pid: bindings['pid'],
      host: bindings['hostname'],
      environment: envConfig.nodeEnv,
    }),
  },
  redact: {
    paths: redactPaths,
    remove: true,
  },
};

// Use file transport in production (except on Vercel), otherwise pretty print
const transport = isProduction && !process.env['VERCEL']
  ? getFileTransport(path.join(logDir, 'app.log'))
  : getPrettyTransport();

export const logger = pino(options, transport);
export { httpLogger } from './httpLogger';
