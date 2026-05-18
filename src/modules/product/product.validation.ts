import { z } from 'zod';
import { ProductType, ProductStatus, FulfillmentType } from '@prisma/client';

const createProduct = z.object({
  body: z.object({
    // Product
    name: z.string().min(3).max(100),
    description: z.string().max(2000).optional().nullable(),
    type: z.nativeEnum(ProductType).default(ProductType.PHYSICAL),
    status: z.nativeEnum(ProductStatus).default(ProductStatus.DRAFT),
    categoryId: z.string().cuid().optional().nullable(),
    brandId: z.string().cuid().optional().nullable(),
    searchKeywords: z.array(z.string()).optional(),
    taxCode: z.string().optional().nullable(),
    
    // Variant
    sku: z.string().min(3).max(50),
    barcode: z.string().optional().nullable(),
    price: z.number().positive(),
    compareAtPrice: z.number().positive().optional().nullable(),
    costPerItem: z.number().positive().optional().nullable(),
    
    // Logistics
    weight: z.number().positive().optional().nullable(),
    length: z.number().positive().optional().nullable(),
    width: z.number().positive().optional().nullable(),
    height: z.number().positive().optional().nullable(),
    fulfillmentType: z.nativeEnum(FulfillmentType).default(FulfillmentType.SELLER_FULFILLED),
    
    // Inventory
    quantity: z.number().int().nonnegative().default(0),
    warehouseId: z.string().cuid().optional().nullable(),
    
    // Media
    images: z.array(z.object({
      url: z.string().url(),
      isPrimary: z.boolean().default(false),
    })).optional(),
  }),
});

export type TCreateProduct = z.infer<typeof createProduct>['body'];

export const productValidation = {
  createProduct,
};
