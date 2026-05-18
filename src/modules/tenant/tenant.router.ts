import express from 'express';
import { auth } from '@/middlewares/auth';
import { validateRequest } from '@/middlewares/validateRequest';
import { AUTH_ROLES } from '../auth/auth.utils';
import { TenantController } from './tenant.controller';
import { tenantValidation } from './tenant.validation';

const router = express.Router();

router.get(
  '/me',
  auth(AUTH_ROLES.TENANT_ADMIN, AUTH_ROLES.MANAGER),
  TenantController.getMyTenant
);

router.patch(
  '/me',
  auth(AUTH_ROLES.TENANT_ADMIN),
  validateRequest(tenantValidation.updateTenant),
  TenantController.updateTenant
);

router.get(
  '/:slug',
  TenantController.getTenantBySlug
);

export const TenantRouter = router;
