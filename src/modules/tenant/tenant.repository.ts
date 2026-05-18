import { prisma } from '@/bootstrap/prisma';
import { TUpdateTenant } from './tenant.validation';

export const TenantRepository = {
  /**
   * Find tenant by slug
   */
  findBySlug: async (slug: string) => {
    if (!slug) return null;
    return prisma.tenant.findUnique({
      where: { slug },
      include: {
        owner: {
          select: {
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });
  },

  /**
   * Find tenant by ID
   */
  findById: async (id: string) => {
    if (!id) return null;
    return prisma.tenant.findUnique({
      where: { id },
      include: { storeSettings: true },
    });
  },

  /**
   * Find tenant by slug or custom domain (for storefront resolution)
   */
  findBySlugOrDomain: async (identifier: string) => {
    if (!identifier) return null;
    return prisma.tenant.findFirst({
      where: {
        OR: [
          { slug: identifier },
          { customDomain: identifier },
        ],
      },
      include: { storeSettings: true },
    });
  },

  /**
   * Update tenant details and its store settings
   */
  update: async (id: string, data: any) => {
    if (!id) return null;
    const { storeSettings, ...tenantData } = data;

    return prisma.tenant.update({
      where: { id },
      data: {
        ...tenantData,
        storeSettings: storeSettings ? {
          upsert: {
            create: storeSettings,
            update: storeSettings,
          },
        } : undefined,
      },
      include: { storeSettings: true },
    });
  },

  /**
   * Find tenant by owner ID
   */
  findByOwnerId: async (ownerId: string) => {
    return prisma.tenant.findFirst({
      where: { ownerId },
    });
  },
};
