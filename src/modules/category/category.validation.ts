import { z } from 'zod';

const createCategory = z.object({
  body: z.object({
    name: z.string().min(2).max(50),
    slug: z.string().min(2).max(50).optional(),
    parentId: z.string().cuid().optional().nullable(),
  }),
});

const updateCategory = z.object({
  body: z.object({
    name: z.string().min(2).max(50).optional(),
    slug: z.string().min(2).max(50).optional(),
    parentId: z.string().cuid().optional().nullable(),
  }),
});

export type TCreateCategory = z.infer<typeof createCategory>['body'];
export type TUpdateCategory = z.infer<typeof updateCategory>['body'];

export const categoryValidation = {
  createCategory,
  updateCategory,
};
