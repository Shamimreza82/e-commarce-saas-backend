import { Router } from 'express';

import { AuthRouter } from '@/modules/auth/auth.router';
import { TenantRouter } from '@/modules/tenant/tenant.router';
import { ProductRouter } from '@/modules/product/product.router';
import { CategoryRouter } from '@/modules/category/category.router';
import { BrandRouter } from '@/modules/brand/brand.router';

export const apiRouter = Router();

apiRouter.use('/auth', AuthRouter);
apiRouter.use('/tenants', TenantRouter);
apiRouter.use('/products', ProductRouter);
apiRouter.use('/categories', CategoryRouter);
apiRouter.use('/brands', BrandRouter);

