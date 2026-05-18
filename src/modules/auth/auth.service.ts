import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';
import axios from 'axios';

import { envConfig } from '@/config/env.config';
import { AppError } from '@/shared/errors/AppError';
import sendEmail from '@/shared/utils/sendEmail';

import { AUTH_MESSAGES } from './auth.constand';
import { TJwtPayload } from './auth.types';
import { TSignUp, TSignIn, TChangePassword, TForgotPassword, TResetPassword, TGoogleAuth, TVerifyEmail } from './auth.validation';
import { AuthRepository } from './auth.repository';
import { googleOAuthClient } from '@/config/oauth';

/**
 * Generate a JWT token for a user
 */
const generateToken = (payload: TJwtPayload, expiresIn: string = '7d'): string => {
  return jwt.sign(payload, envConfig.jwtAccessSecret as string, { expiresIn } as jwt.SignOptions);
};

/**
 * Register a new tenant and its owner
 */
const register = async (payload: TSignUp) => {
  const { email, password } = payload;

  const existingUser = await AuthRepository.findUserByEmail(email);
  if (existingUser) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Email already in use');
  }

  // Generate store info automatically
  const emailPrefix = email.split('@')[0] || 'store';
  const timestamp = Date.now().toString().slice(-4);
  let finalStoreSlug = emailPrefix.toLowerCase().replace(/[^a-z0-9-]/g, '');
  const finalStoreName = `${emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1)}'s Store`;

  // Ensure unique slug
  const existingTenant = await AuthRepository.findTenantBySlug(finalStoreSlug);
  if (existingTenant) {
    finalStoreSlug = `${finalStoreSlug}-${timestamp}`;
  }

  const hashedPassword = await bcrypt.hash(password, envConfig.saltRounds);

  const result = await AuthRepository.createTenantAndOwner({
    storeName: finalStoreName,
    storeSlug: finalStoreSlug,
    email,
    passwordHash: hashedPassword,
  });

  if (!result.owner) {
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Owner not found');
  }

  // Generate immediate access token
  const jwtPayload: TJwtPayload = {
    id: result.owner.id,
    email: result.owner.email,
    role: result.owner.role as UserRole,
    tenantId: result.id,
  };

  const token = generateToken(jwtPayload);

  // Still send verification email in background if needed, 
  // but we'll return the token for immediate access
  
  return {
    token,
    tenant: { id: result.id, name: result.name, slug: result.slug },
    user: { id: result.owner.id, name: result.owner.name, email: result.owner.email, role: result.owner.role }
  };
};

/**
 * Login a user
 */
const login = async (payload: TSignIn) => {
  const { email, password } = payload;

  const user = await AuthRepository.findUserByEmail(email);

  if (!user) {
    throw new AppError(StatusCodes.UNAUTHORIZED, AUTH_MESSAGES.INVALID_CREDENTIALS);
  }

  if (!user.isActive) {
    throw new AppError(StatusCodes.FORBIDDEN, AUTH_MESSAGES.ACCOUNT_INACTIVE);
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new AppError(StatusCodes.UNAUTHORIZED, AUTH_MESSAGES.INVALID_CREDENTIALS);
  }

  if (!user.isEmailVerified) {
    throw new AppError(StatusCodes.UNAUTHORIZED, AUTH_MESSAGES.EMAIL_NOT_VERIFIED);
  }

  const jwtPayload: TJwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role as UserRole,
    tenantId: user.tenantId,
  };

  const token = generateToken(jwtPayload);

  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
};

/**
 * Verify user email
 */
const verifyEmail = async (query: TVerifyEmail) => {
  const { token } = query;

  try {
    const decoded = jwt.verify(token, envConfig.jwtAccessSecret) as { userId: string };
    const user = await AuthRepository.findUserById(decoded.userId);

    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, AUTH_MESSAGES.USER_NOT_FOUND);
    }

    if (user.isEmailVerified) {
      return { message: AUTH_MESSAGES.EMAIL_ALREADY_VERIFIED };
    }

    await AuthRepository.updateUserVerification(user.id, true);

    return { message: AUTH_MESSAGES.VERIFY_EMAIL_SUCCESS };
  } catch (error) {
    throw new AppError(StatusCodes.UNAUTHORIZED, AUTH_MESSAGES.INVALID_TOKEN);
  }
};

/**
 * Google OAuth login/register
 */
const googleAuth = async (payload: TGoogleAuth) => {
  const { idToken } = payload;
  let email: string;
  let name: string;
  let avatarUrl: string | undefined;

  try {
    // 1. Try to verify as ID Token first (standard JWT)
    try {
      const ticket = await googleOAuthClient.verifyIdToken({
        idToken,
        audience: envConfig.googleClientId,
      });
      const googlePayload = ticket.getPayload();
      if (!googlePayload || !googlePayload.email) {
        throw new Error('Invalid ID Token payload');
      }
      email = googlePayload.email;
      name = googlePayload.name || email.split('@')[0];
      avatarUrl = googlePayload.picture;
    } catch (idTokenError) {
      // 2. If ID Token verification fails, try as Access Token (implicit flow)
      const response = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${idToken}`);
      const userInfo = response.data;
      
      if (!userInfo || !userInfo.email) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid Google token (neither ID nor Access token)');
      }
      email = userInfo.email;
      name = userInfo.name || email.split('@')[0];
      avatarUrl = userInfo.picture;
    }

    let user = await AuthRepository.findUserByEmail(email);

    if (!user) {
      // Automatic Tenant & User Creation for Google Registration
      const emailPrefix = email.split('@')[0] || 'store';
      const timestamp = Date.now().toString().slice(-4);
      let finalStoreSlug = emailPrefix.toLowerCase().replace(/[^a-z0-9-]/g, '');
      const finalStoreName = `${emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1)}'s Store`;

      // Ensure unique slug
      const existingTenant = await AuthRepository.findTenantBySlug(finalStoreSlug);
      if (existingTenant) {
        finalStoreSlug = `${finalStoreSlug}-${timestamp}`;
      }

      // Google users don't have a password, we'll use a random string
      const randomPassword = await bcrypt.hash(Math.random().toString(36), envConfig.saltRounds);

      const result = await AuthRepository.createTenantAndOwner({
        storeName: finalStoreName,
        storeSlug: finalStoreSlug,
        name,
        email,
        passwordHash: randomPassword,
        avatarUrl,
      });
      
      user = await AuthRepository.findUserByEmail(email);
      if (user) {
        // Mark email as verified since it's from Google
        await AuthRepository.updateUserVerification(user.id, true);
      }
    } else {
      // Sync Google info for existing user
      await AuthRepository.updateUserProfile(user.id, {
        name: user.name || name,
        avatarUrl: avatarUrl || user.avatarUrl,
        isEmailVerified: true,
      });
      // Fetch updated user
      user = await AuthRepository.findUserById(user.id);
    }

    if (!user) {
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to process Google authentication');
    }

    const jwtPayload: TJwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role as UserRole,
      tenantId: user.tenantId,
    };

    const token = generateToken(jwtPayload);

    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    throw new AppError(StatusCodes.UNAUTHORIZED, `Google authentication failed: ${error.message}`);
  }
};

/**
 * Forgot password - send reset link
 */
const forgotPassword = async (payload: TForgotPassword) => {
  const { email } = payload;

  const user = await AuthRepository.findUserByEmail(email);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, AUTH_MESSAGES.USER_NOT_FOUND);
  }

  const resetToken = jwt.sign(
    { email: user.email },
    envConfig.jwtAccessSecret,
    { expiresIn: '15m' }
  );

  const resetLink = `${envConfig.nodeEnv === 'production' ? 'https://your-domain.com' : 'http://localhost:3000'}/reset-password?token=${resetToken}`;

  await sendEmail(
    email,
    'Reset your password',
    `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 15 minutes.</p>`
  );

  return { message: AUTH_MESSAGES.PASSWORD_RESET_LINK_SENT };
};

/**
 * Reset password using token
 */
const resetPassword = async (payload: TResetPassword) => {
  const { token, newPassword } = payload;

  try {
    const decoded = jwt.verify(token, envConfig.jwtAccessSecret) as { email: string };
    const user = await AuthRepository.findUserByEmail(decoded.email);

    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, AUTH_MESSAGES.USER_NOT_FOUND);
    }

    const hashedPassword = await bcrypt.hash(newPassword, envConfig.saltRounds);
    await AuthRepository.updateUserPassword(user.id, hashedPassword);

    return { message: AUTH_MESSAGES.PASSWORD_RESET_SUCCESS };
  } catch (error) {
    throw new AppError(StatusCodes.UNAUTHORIZED, AUTH_MESSAGES.INVALID_TOKEN);
  }
};

/**
 * Change user password
 */
const changePassword = async (userId: string, payload: TChangePassword) => {
  const { currentPassword, newPassword } = payload;

  const user = await AuthRepository.findUserById(userId);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, AUTH_MESSAGES.USER_NOT_FOUND);
  }

  const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordMatch) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Current password does not match');
  }

  const hashedPassword = await bcrypt.hash(newPassword, envConfig.saltRounds);

  await AuthRepository.updateUserPassword(userId, hashedPassword);

  return { message: AUTH_MESSAGES.PASSWORD_CHANGE_SUCCESS };
};

/**
 * Get current user details
 */
const getMe = async (userId: string) => {
  const user = await AuthRepository.findUserById(userId);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, AUTH_MESSAGES.USER_NOT_FOUND);
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    tenantId: user.tenantId,
    avatarUrl: user.avatarUrl,
  };
};

export const AuthService = {
  register,
  login,
  verifyEmail,
  googleAuth,
  forgotPassword,
  resetPassword,
  changePassword,
  getMe,
};
