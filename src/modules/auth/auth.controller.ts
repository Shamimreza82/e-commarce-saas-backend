import { StatusCodes } from 'http-status-codes';

import { catchAsync } from '@/shared/utils/catchAsync';
import { sendResponse } from '@/shared/utils/sendResponse';

import { AUTH_MESSAGES } from './auth.constand';
import { AuthService } from './auth.service';
import { TSignUp, TSignIn, TChangePassword, TForgotPassword, TResetPassword, TGoogleAuth, TVerifyEmail } from './auth.validation';

const cookieOptions = {
  httpOnly: true,
  secure: process.env['NODE_ENV'] === 'production',
  sameSite: process.env['NODE_ENV'] === 'production' ? ('none' as const) : ('lax' as const),
  path: '/',
};

const register = catchAsync(async (req, res) => {
  const result = await AuthService.register(req.body as TSignUp);

  if (result.token) {
    res.cookie('token', result.token, cookieOptions);
  }

  sendResponse(res, StatusCodes.CREATED, {
    success: true,
    message: AUTH_MESSAGES.REGISTRATION_SUCCESS,
    data: result,
  });
});

const login = catchAsync(async (req, res) => {
  const { token, user } = await AuthService.login(req.body as TSignIn);

  res.cookie('token', token, cookieOptions);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: AUTH_MESSAGES.LOGIN_SUCCESS,
    data: { token, user },
  });
});

const verifyEmail = catchAsync(async (req, res) => {
  const result = await AuthService.verifyEmail(req.query as unknown as TVerifyEmail);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: result.message,
    data: null,
  });
});

const googleAuth = catchAsync(async (req, res) => {
  const { token, user } = await AuthService.googleAuth(req.body as TGoogleAuth);

  res.cookie('token', token, cookieOptions);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: AUTH_MESSAGES.LOGIN_SUCCESS,
    data: { token, user },
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  const result = await AuthService.forgotPassword(req.body as TForgotPassword);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: result.message,
    data: null,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const result = await AuthService.resetPassword(req.body as TResetPassword);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: result.message,
    data: null,
  });
});

const logout = catchAsync((_req, res) => {
  res.clearCookie('token', cookieOptions);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: AUTH_MESSAGES.LOGOUT_SUCCESS,
    data: null,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await AuthService.changePassword(userId, req.body as TChangePassword);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: AUTH_MESSAGES.PASSWORD_CHANGE_SUCCESS,
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await AuthService.getMe(userId);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'User profile retrieved successfully',
    data: result,
  });
});

export const AuthController = {
  register,
  login,
  verifyEmail,
  googleAuth,
  forgotPassword,
  resetPassword,
  logout,
  changePassword,
  getMe,
};
