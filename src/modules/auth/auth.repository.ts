import { UserRole } from '@prisma/client';
import { prisma } from '@/bootstrap/prisma';

export const AuthRepository = {
  /**
   * Find a user by email
   */
  findUserByEmail: async (email: string) => {
    return prisma.user.findFirst({
      where: { email },
      include: { tenant: true },
    });
  },

  /**
   * Find a user by ID
   */
  findUserById: async (id: string) => {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  /**
   * Find a tenant by slug
   */
  findTenantBySlug: async (slug: string) => {
    return prisma.tenant.findUnique({
      where: { slug },
    });
  },

  /**
   * Create a new tenant and owner in a transaction
   */
  createTenantAndOwner: async (data: {
    storeName: string;
    storeSlug: string;
    name?: string;
    email: string;
    passwordHash: string;
    avatarUrl?: string;
  }) => {
    return prisma.$transaction(async (tx) => {
      // 1. Create Tenant first
      const tenant = await tx.tenant.create({
        data: {
          name: data.storeName,
          slug: data.storeSlug,
        },
      });

      // 2. Create Owner (User) linked to the Tenant
      const owner = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: data.passwordHash,
          avatarUrl: data.avatarUrl,
          role: UserRole.TENANT_ADMIN,
          tenantId: tenant.id,
          isEmailVerified: true, // Allow immediate access
          isActive: true,
        },
      });

      // 3. Update Tenant to set the ownerId
      return tx.tenant.update({
        where: { id: tenant.id },
        data: { ownerId: owner.id },
        include: {
          owner: true,
        },
      });
    });
  },

  /**
   * Update user password
   */
  updateUserPassword: async (userId: string, passwordHash: string) => {
    return prisma.user.update({
      where: { id: userId },
      data: { password: passwordHash },
    });
  },

  /**
   * Update user verification status
   */
  updateUserVerification: async (userId: string, status: boolean) => {
    return prisma.user.update({
      where: { id: userId },
      data: { isEmailVerified: status },
    });
  },

  /**
   * Update user profile information (e.g. from Google)
   */
  updateUserProfile: async (userId: string, data: { name?: string; avatarUrl?: string; isEmailVerified?: boolean }) => {
    return prisma.user.update({
      where: { id: userId },
      data,
    });
  },

  /**
   * Create a user with specified role and verified status (e.g., for Google Auth)
   */
  createUser: async (data: {
    name?: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    tenantId: string;
    isEmailVerified: boolean;
  }) => {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.passwordHash,
        role: data.role,
        tenantId: data.tenantId,
        isEmailVerified: data.isEmailVerified,
        isActive: true,
      },
    });
  },
};
