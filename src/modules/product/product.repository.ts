import { prisma } from '@/bootstrap/prisma';
import { TCreateProduct } from './product.validation';
import { ProductStatus } from '@prisma/client';

export const ProductRepository = {
  /**
   * Create a new product with a default variant
   */
  create: async (tenantId: string, data: TCreateProduct) => {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9-]/g, '-') + '-' + Date.now().toString().slice(-4);

    return prisma.$transaction(async (tx) => {
      // 1. Create the Product
      const product = await tx.product.create({
        data: {
          tenantId,
          name: data.name,
          slug,
          description: data.description,
          type: data.type,
          status: data.status,
          categoryId: data.categoryId,
          brandId: data.brandId,
          searchKeywords: data.searchKeywords,
          taxCode: data.taxCode,
          images: {
            create: data.images?.map((img, index) => ({
              tenantId,
              url: img.url,
              isPrimary: img.isPrimary,
              position: index,
            })),
          },
        },
      });

      // 2. Create the default Variant
      const variant = await tx.productVariant.create({
        data: {
          productId: product.id,
          sku: data.sku,
          barcode: data.barcode,
          price: data.price,
          compareAtPrice: data.compareAtPrice,
          costPerItem: data.costPerItem,
          weight: data.weight,
          length: data.length,
          width: data.width,
          height: data.height,
          fulfillmentType: data.fulfillmentType,
          inventoryLevels: {
            create: {
              quantity: data.quantity,
              warehouse: {
                connectOrCreate: {
                  where: data.warehouseId ? { id: data.warehouseId } : { code: 'DEFAULT-' + tenantId },
                  create: {
                    tenantId,
                    name: 'Default Warehouse',
                    code: 'DEFAULT-' + tenantId,
                  }
                }
              }
            }
          }
        },
      });

      return tx.product.findUnique({
        where: { id: product.id },
        include: {
          variants: {
            include: {
              inventoryLevels: true
            }
          },
          images: true,
          category: true,
          brand: true,
        },
      });
    });
  },

  /**
   * Find a single product by slug for a tenant
   */
  findBySlug: async (tenantId: string, slug: string) => {
    return prisma.product.findFirst({
      where: { slug, tenantId },
      include: {
        images: true,
        variants: {
          include: {
            inventoryLevels: true
          }
        },
        category: true,
        brand: true,
      }
    });
  },

  /**
   * Find a single product by ID for a tenant
   */
  findById: async (tenantId: string, id: string) => {
    return prisma.product.findUnique({
      where: { id, tenantId },
      include: {
        images: true,
        variants: {
          include: {
            inventoryLevels: true
          }
        },
        category: true,
        brand: true,
      }
    });
  },

  /**
   * Update a product and its primary variant
   */
  update: async (tenantId: string, id: string, data: Partial<TCreateProduct>) => {
    return prisma.$transaction(async (tx) => {
      // 1. Update Product
      const product = await tx.product.update({
        where: { id, tenantId },
        data: {
          name: data.name,
          description: data.description,
          type: data.type,
          status: data.status,
          categoryId: data.categoryId,
          brandId: data.brandId,
          searchKeywords: data.searchKeywords,
          taxCode: data.taxCode,
        },
      });

      // 2. Update the default Variant
      const existingVariant = await tx.productVariant.findFirst({
        where: { productId: id }
      });

      if (existingVariant) {
        await tx.productVariant.update({
          where: { id: existingVariant.id },
          data: {
            sku: data.sku,
            barcode: data.barcode,
            price: data.price,
            compareAtPrice: data.compareAtPrice,
            costPerItem: data.costPerItem,
            weight: data.weight,
            length: data.length,
            width: data.width,
            height: data.height,
            fulfillmentType: data.fulfillmentType,
          }
        });

        // 3. Update inventory
        if (data.quantity !== undefined) {
          await tx.productInventory.updateMany({
            where: { variantId: existingVariant.id },
            data: { quantity: data.quantity }
          });
        }
      }

      // 4. Update Images: If images are provided in data, replace them.
      // Note: Front-end sends 'images' array transformed from 'imageUrl'
      if (data.images !== undefined) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        if (data.images && data.images.length > 0) {
          await tx.productImage.createMany({
            data: data.images.map((img, index) => ({
              tenantId,
              productId: id,
              url: img.url,
              isPrimary: img.isPrimary,
              position: index,
            }))
          });
        }
      }

      return tx.product.findUnique({
        where: { id },
        include: {
          variants: { include: { inventoryLevels: true } },
          images: true,
        }
      });
    });
  },

  /**
   * Delete a product
   */
  delete: async (tenantId: string, id: string) => {
    return prisma.product.delete({
      where: { id, tenantId }
    });
  },

  /**
   * Find all products for a tenant
   */
  findAll: async (tenantId: string) => {
    return prisma.product.findMany({
      where: { tenantId },
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
        variants: {
          include: {
            inventoryLevels: true
          },
          take: 1,
        },
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  },
};
