import { prisma } from '@/bootstrap/prisma';
import { TCreateCategory, TUpdateCategory } from './category.validation';

export const CategoryRepository = {
  create: async (tenantId: string, data: TCreateCategory) => {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    return prisma.category.create({
      data: {
        tenantId,
        name: data.name,
        slug,
        parentId: data.parentId,
      },
    });
  },

  update: async (tenantId: string, id: string, data: TUpdateCategory) => {
    return prisma.category.update({
      where: { id, tenantId },
      data,
    });
  },

  delete: async (tenantId: string, id: string) => {
    return prisma.category.delete({
      where: { id, tenantId },
    });
  },

  findById: async (tenantId: string, id: string) => {
    return prisma.category.findUnique({
      where: { id, tenantId },
      include: {
        parent: true,
        children: true,
        _count: {
          select: { products: true }
        }
      }
    });
  },

  findAll: async (tenantId: string) => {
    return prisma.category.findMany({
      where: { tenantId },
      include: {
        parent: true,
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: 'asc' },
    });
  },
};
