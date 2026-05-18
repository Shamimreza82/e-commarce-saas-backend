import express from 'express';
import { auth } from '@/middlewares/auth';
import { validateRequest } from '@/middlewares/validateRequest';
import { AUTH_ROLES } from '../auth/auth.utils';
import { ProductController } from './product.controller';
import { productValidation } from './product.validation';

const router = express.Router();

router.get(
  '/',
  auth(AUTH_ROLES.TENANT_ADMIN, AUTH_ROLES.MANAGER, AUTH_ROLES.STAFF),
  ProductController.getAllProducts
);

router.post(
  '/',
  auth(AUTH_ROLES.TENANT_ADMIN, AUTH_ROLES.MANAGER),
  validateRequest(productValidation.createProduct),
  ProductController.createProduct
);

router.get(
  '/:id',
  auth(AUTH_ROLES.TENANT_ADMIN, AUTH_ROLES.MANAGER, AUTH_ROLES.STAFF),
  ProductController.getProductById
);

router.patch(
  '/:id',
  auth(AUTH_ROLES.TENANT_ADMIN, AUTH_ROLES.MANAGER),
  // validateRequest(productValidation.updateProduct), // Optional: Add update validation if needed
  ProductController.updateProduct
);

router.delete(
  '/:id',
  auth(AUTH_ROLES.TENANT_ADMIN, AUTH_ROLES.MANAGER),
  ProductController.deleteProduct
);

// Public route for storefront
router.get(
  '/public/:tenantSlug',
  ProductController.getPublicProducts
);

router.get(
  '/public/:tenantSlug/:productSlug',
  ProductController.getProductBySlug
);

export const ProductRouter = router;
