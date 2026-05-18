import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '@/shared/utils/catchAsync';
import { sendResponse } from '@/shared/utils/sendResponse';
import { CategoryService } from './category.service';
import { TCreateCategory, TUpdateCategory } from './category.validation';

const createCategory = catchAsync(async (req, res) => {
  const tenantId = req.tenantId;
  const result = await CategoryService.createCategory(tenantId, req.body as TCreateCategory);

  sendResponse(res, StatusCodes.CREATED, {
    success: true,
    message: 'Category created successfully',
    data: result,
  });
});

const updateCategory = catchAsync(async (req, res) => {
  const tenantId = req.tenantId;
  const { id } = req.params;
  const result = await CategoryService.updateCategory(tenantId, id, req.body as TUpdateCategory);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Category updated successfully',
    data: result,
  });
});

const deleteCategory = catchAsync(async (req, res) => {
  const tenantId = req.tenantId;
  const { id } = req.params;
  const result = await CategoryService.deleteCategory(tenantId, id);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Category deleted successfully',
    data: result,
  });
});

const getAllCategories = catchAsync(async (req, res) => {
  const tenantId = req.tenantId;
  const result = await CategoryService.getAllCategories(tenantId);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Categories retrieved successfully',
    data: result,
  });
});

export const CategoryController = {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
};
