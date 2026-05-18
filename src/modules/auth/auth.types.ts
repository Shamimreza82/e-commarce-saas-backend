import { UserRole } from '@prisma/client';

export type TAuthGuard = keyof typeof UserRole;

export interface TJwtPayload {
  id: string;
  email: string;
  role: UserRole;
  tenantId: string;
}

export interface TUserPayload extends TJwtPayload {}
