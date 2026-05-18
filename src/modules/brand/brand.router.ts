import express from 'express';
import { auth } from '@/middlewares/auth';
import { validateRequest } from '@/middlewares/validateRequest';
import { AUTH_ROLES } from '../auth/auth.utils';
import { BrandController } from './brand.controller';
import { brandValidation } from './brand.validation';

const router = express.Router();

router.get(
  '/',
  auth(AUTH_ROLES.TENANT_ADMIN, AUTH_ROLES.MANAGER, AUTH_ROLES.STAFF),
  BrandController.getAllBrands
);

router.post(
  '/',
  auth(AUTH_ROLES.TENANT_ADMIN, AUTH_ROLES.MANAGER),
  validateRequest(brandValidation.createBrand),
  BrandController.createBrand
);

router.patch(
  '/:id',
  auth(AUTH_ROLES.TENANT_ADMIN, AUTH_ROLES.MANAGER),
  validateRequest(brandValidation.updateBrand),
  BrandController.updateBrand
);

router.delete(
  '/:id',
  auth(AUTH_ROLES.TENANT_ADMIN, AUTH_ROLES.MANAGER),
  BrandController.deleteBrand
);

export const BrandRouter = router;
