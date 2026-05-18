import { z } from 'zod';

const createBrand = z.object({
  body: z.object({
    name: z.string().min(2).max(50),
    slug: z.string().min(2).max(50).optional(),
    logoUrl: z.string().url().optional().nullable(),
    description: z.string().max(500).optional().nullable(),
  }),
});

const updateBrand = z.object({
  body: z.object({
    name: z.string().min(2).max(50).optional(),
    slug: z.string().min(2).max(50).optional(),
    logoUrl: z.string().url().optional().nullable(),
    description: z.string().max(500).optional().nullable(),
  }),
});

export type TCreateBrand = z.infer<typeof createBrand>['body'];
export type TUpdateBrand = z.infer<typeof updateBrand>['body'];

export const brandValidation = {
  createBrand,
  updateBrand,
};
