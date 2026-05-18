import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

import { envConfig } from '@/config/env.config';
import { AppError } from '@/shared/errors/AppError';
import { catchAsync } from '@/shared/utils/catchAsync';

import { AUTH_MESSAGES } from '@/modules/auth/auth.constand';
import { TJwtPayload } from '@/modules/auth/auth.types';

import type { UserRole } from '@prisma/client';

export const auth = (...roles: UserRole[]) => {
  return catchAsync(async (req, _res, next) => {
    const token = req.cookies?.['token'] || req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, AUTH_MESSAGES.UNAUTHORIZED);
    }

    try {
      const decoded = jwt.verify(token, envConfig.jwtAccessSecret) as TJwtPayload;

      if (roles.length > 0 && !roles.includes(decoded.role)) {
        throw new AppError(StatusCodes.FORBIDDEN, AUTH_MESSAGES.FORBIDDEN);
      }

      req.user = decoded;
      req.tenantId = decoded.tenantId;

      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError(StatusCodes.UNAUTHORIZED, AUTH_MESSAGES.INVALID_TOKEN);
      }
      throw error;
    }
  });
};
