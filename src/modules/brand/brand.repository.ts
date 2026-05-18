import { prisma } from '@/bootstrap/prisma';
import { TCreateBrand, TUpdateBrand } from './brand.validation';

export const BrandRepository = {
  create: async (tenantId: string, data: TCreateBrand) => {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    return prisma.brand.create({
      data: {
        tenantId,
        name: data.name,
        slug,
        logoUrl: data.logoUrl,
        description: data.description,
      },
    });
  },

  update: async (tenantId: string, id: string, data: TUpdateBrand) => {
    return prisma.brand.update({
      where: { id, tenantId },
      data,
    });
  },

  delete: async (tenantId: string, id: string) => {
    return prisma.brand.delete({
      where: { id, tenantId },
    });
  },

  findById: async (tenantId: string, id: string) => {
    return prisma.brand.findUnique({
      where: { id, tenantId },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
  },

  findAll: async (tenantId: string) => {
    return prisma.brand.findMany({
      where: { tenantId },
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: 'asc' },
    });
  },
};
