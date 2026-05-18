import { z } from 'zod';

const signUp = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
  }),
});

const signIn = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

const changePassword = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
  }),
});

const forgotPassword = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
  }),
});

const resetPassword = z.object({
  body: z.object({
    token: z.string().min(1, 'Reset token is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
  }),
});

const googleAuth = z.object({
  body: z.object({
    idToken: z.string().min(1, 'Google ID token is required'),
  }),
});

const verifyEmail = z.object({
  query: z.object({
    token: z.string().min(1, 'Verification token is required'),
  }),
});

export type TSignUp = z.infer<typeof signUp>['body'];
export type TSignIn = z.infer<typeof signIn>['body'];
export type TChangePassword = z.infer<typeof changePassword>['body'];
export type TForgotPassword = z.infer<typeof forgotPassword>['body'];
export type TResetPassword = z.infer<typeof resetPassword>['body'];
export type TGoogleAuth = z.infer<typeof googleAuth>['body'];
export type TVerifyEmail = z.infer<typeof verifyEmail>['query'];

export const authValidation = {
  signUp,
  signIn,
  changePassword,
  forgotPassword,
  resetPassword,
  googleAuth,
  verifyEmail,
};
