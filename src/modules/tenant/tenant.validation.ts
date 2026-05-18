import { z } from 'zod';

const updateTenant = z.object({
  body: z.object({
    name: z.string().min(3).max(50).optional(),
    description: z.string().max(500).optional().nullable(),
    logoUrl: z.string().url().optional().nullable(),
    bannerUrl: z.string().url().optional().nullable(),
    contactEmail: z.string().email().optional().nullable(),
    contactPhone: z.string().max(20).optional().nullable(),
    address: z.string().max(200).optional().nullable(),
    currency: z.string().length(3).optional(),
    timezone: z.string().optional(),
    customDomain: z.string().min(3).max(100).optional().nullable(),
    
    // Nested Store Settings
    storeSettings: z.object({
      primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional(),
      fontFamily: z.string().optional(),
      socialLinks: z.record(z.string().url().or(z.literal(""))).optional(),
      seoTitle: z.string().max(100).optional().nullable(),
      seoDescription: z.string().max(300).optional().nullable(),
      enableCustomerReviews: z.boolean().optional(),
      enableWishlist: z.boolean().optional(),
      refundPolicy: z.string().optional().nullable(),
      privacyPolicy: z.string().optional().nullable(),
      termsOfService: z.string().optional().nullable(),
    }).optional(),
  }),
});

export type TUpdateTenant = z.infer<typeof updateTenant>['body'];

export const tenantValidation = {
  updateTenant,
};
