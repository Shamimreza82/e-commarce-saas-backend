import { UserRole } from '@prisma/client';

export const AUTH_ROLES = {
  SUPER_ADMIN: UserRole.SUPER_ADMIN,
  TENANT_ADMIN: UserRole.TENANT_ADMIN,
  MANAGER: UserRole.MANAGER,
  STAFF: UserRole.STAFF,
} as const;





export const cookieOptions = {
  httpOnly: true,
  secure: process.env['NODE_ENV'] === 'production',
  sameSite: 'none' as const,
};