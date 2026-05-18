import { CategoryRepository } from './category.repository';
import { TCreateCategory, TUpdateCategory } from './category.validation';

const createCategory = async (tenantId: string, payload: TCreateCategory) => {
  return CategoryRepository.create(tenantId, payload);
};

const updateCategory = async (tenantId: string, id: string, payload: TUpdateCategory) => {
  return CategoryRepository.update(tenantId, id, payload);
};

const deleteCategory = async (tenantId: string, id: string) => {
  return CategoryRepository.delete(tenantId, id);
};

const getAllCategories = async (tenantId: string) => {
  return CategoryRepository.findAll(tenantId);
};

const getCategoryById = async (tenantId: string, id: string) => {
  return CategoryRepository.findById(tenantId, id);
};

export const CategoryService = {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
};
