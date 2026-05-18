import 'dotenv/config';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { AppError } from '@/shared/errors/AppError';

export type NodeEnvironment = 'development' | 'test' | 'production';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  CORS_ENABLED: z.coerce.boolean().default(true),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  CORS_ORIGINS: z.string().default('*,https://medicine-server-frontend.vercel.app'),
  TRUST_PROXY: z
    .string()
    .optional()
    .transform((value) => value === '1' || value === 'true'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(120),
  
  // Auth
  JWT_ACCESS_SECRET: z.string().min(16).default('dev-access-secret-change-me'),
  JWT_REFRESH_SECRET: z.string().min(16).default('dev-refresh-secret-change-me'),
  JWT_ACCESS_EXPIRES_IN: z.string().min(1).default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().min(1).default('365d'),
  SALT_ROUNDS: z.coerce.number().int().positive().default(10),
  GOOGLE_CLIENT_ID: z.string().optional(),

  // Logging
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  HTTP_LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),

  // Email
  NODE_MAILER_EMAIL: z.string().email().optional(),
  NODE_MAILER_PASS: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  const formattedErrors = parsed.error.issues
    .map((issue) => `${issue.path.join('.') || 'ENV'}: ${issue.message}`)
    .join('; ');
  throw new AppError(
    StatusCodes.BAD_REQUEST,
    `Invalid environment configuration: ${formattedErrors}`,
  );
}

export const envConfig = {
  nodeEnv: parsed.data.NODE_ENV as NodeEnvironment,
  port: parsed.data.PORT,
  databaseUrl: parsed.data.DATABASE_URL,
  corsOrigins: parsed.data.CORS_ORIGINS,
  trustProxy: parsed.data.TRUST_PROXY ?? false,
  rateLimitWindowMs: parsed.data.RATE_LIMIT_WINDOW_MS,
  rateLimitMaxRequests: parsed.data.RATE_LIMIT_MAX_REQUESTS,

  jwtAccessSecret: parsed.data.JWT_ACCESS_SECRET,
  jwtExpiresIn: parsed.data.JWT_ACCESS_EXPIRES_IN,
  jwtRefreshSecret: parsed.data.JWT_REFRESH_SECRET,
  jwtRefreshExpiresIn: parsed.data.JWT_REFRESH_EXPIRES_IN,
  saltRounds: parsed.data.SALT_ROUNDS,
  googleClientId: parsed.data.GOOGLE_CLIENT_ID,

  logLevel: parsed.data.LOG_LEVEL,
  httpLogLevel: parsed.data.HTTP_LOG_LEVEL,

  mailEmail: parsed.data.NODE_MAILER_EMAIL,
  mailPass: parsed.data.NODE_MAILER_PASS,

  corsEnabled: parsed.data.CORS_ENABLED,
} as const;
