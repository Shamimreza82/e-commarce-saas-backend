import express from 'express';

import { auth } from '@/middlewares/auth';
import { validateRequest } from '@/middlewares/validateRequest';

import { AuthController } from './auth.controller';
import { AUTH_ROLES } from './auth.utils';
import { authValidation } from './auth.validation';

const router = express.Router();

router.post(
  '/register',
  validateRequest(authValidation.signUp),
  AuthController.register
);

router.post(
  '/login',
  validateRequest(authValidation.signIn),
  AuthController.login
);

router.get(
  '/verify-email',
  validateRequest(authValidation.verifyEmail),
  AuthController.verifyEmail
);

router.post(
  '/oauth/google',
  validateRequest(authValidation.googleAuth),
  AuthController.googleAuth
);

router.post(
  '/forgot-password',
  validateRequest(authValidation.forgotPassword),
  AuthController.forgotPassword
);

router.post(
  '/reset-password',
  validateRequest(authValidation.resetPassword),
  AuthController.resetPassword
);

router.post('/logout', AuthController.logout);

router.post(
  '/change-password',
  auth(AUTH_ROLES.TENANT_ADMIN, AUTH_ROLES.MANAGER, AUTH_ROLES.STAFF),
  validateRequest(authValidation.changePassword),
  AuthController.changePassword
);

router.get(
  '/me',
  auth(AUTH_ROLES.TENANT_ADMIN, AUTH_ROLES.MANAGER, AUTH_ROLES.STAFF),
  AuthController.getMe
);

export const AuthRouter = router;
