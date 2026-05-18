import express from 'express';
import { auth } from '@/middlewares/auth';
import { validateRequest } from '@/middlewares/validateRequest';
import { AUTH_ROLES } from '../auth/auth.utils';
import { CategoryController } from './category.controller';
import { categoryValidation } from './category.validation';

const router = express.Router();

router.get(
  '/',
  auth(AUTH_ROLES.TENANT_ADMIN, AUTH_ROLES.MANAGER, AUTH_ROLES.STAFF),
  CategoryController.getAllCategories
);

router.post(
  '/',
  auth(AUTH_ROLES.TENANT_ADMIN, AUTH_ROLES.MANAGER),
  validateRequest(categoryValidation.createCategory),
  CategoryController.createCategory
);

router.patch(
  '/:id',
  auth(AUTH_ROLES.TENANT_ADMIN, AUTH_ROLES.MANAGER),
  validateRequest(categoryValidation.updateCategory),
  CategoryController.updateCategory
);

router.delete(
  '/:id',
  auth(AUTH_ROLES.TENANT_ADMIN, AUTH_ROLES.MANAGER),
  CategoryController.deleteCategory
);

export const CategoryRouter = router;
