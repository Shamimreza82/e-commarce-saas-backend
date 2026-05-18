import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '@/shared/utils/catchAsync';
import { sendResponse } from '@/shared/utils/sendResponse';
import { ProductService } from './product.service';
import { TCreateProduct } from './product.validation';

const createProduct = catchAsync(async (req, res) => {
  const tenantId = req.tenantId;
  const result = await ProductService.createProduct(tenantId, req.body as TCreateProduct);

  sendResponse(res, StatusCodes.CREATED, {
    success: true,
    message: 'Product created successfully',
    data: result,
  });
});

const getAllProducts = catchAsync(async (req, res) => {
  const tenantId = req.tenantId;
  const result = await ProductService.getAllProducts(tenantId);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Products retrieved successfully',
    data: result,
  });
});

const getProductById = catchAsync(async (req, res) => {
  const tenantId = req.tenantId;
  const { id } = req.params;
  const result = await ProductService.getProductById(tenantId, id);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Product retrieved successfully',
    data: result,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const tenantId = req.tenantId;
  const { id } = req.params;
  const result = await ProductService.updateProduct(tenantId, id, req.body as Partial<TCreateProduct>);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Product updated successfully',
    data: result,
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  const tenantId = req.tenantId;
  const { id } = req.params;
  const result = await ProductService.deleteProduct(tenantId, id);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Product deleted successfully',
    data: result,
  });
});

const getProductBySlug = catchAsync(async (req, res) => {
  const { tenantSlug, productSlug } = req.params;
  const result = await ProductService.getProductBySlug(tenantSlug, productSlug);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Product retrieved successfully',
    data: result,
  });
});

const getPublicProducts = catchAsync(async (req, res) => {
  const { tenantSlug } = req.params;
  const result = await ProductService.getPublicProducts(tenantSlug);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Products retrieved successfully',
    data: result,
  });
});

export const ProductController = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductBySlug,
  getPublicProducts,
};
