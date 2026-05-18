import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '@/shared/utils/catchAsync';
import { sendResponse } from '@/shared/utils/sendResponse';
import { BrandService } from './brand.service';
import { TCreateBrand, TUpdateBrand } from './brand.validation';

const createBrand = catchAsync(async (req, res) => {
  const tenantId = req.tenantId;
  const result = await BrandService.createBrand(tenantId, req.body as TCreateBrand);

  sendResponse(res, StatusCodes.CREATED, {
    success: true,
    message: 'Brand created successfully',
    data: result,
  });
});

const updateBrand = catchAsync(async (req, res) => {
  const tenantId = req.tenantId;
  const { id } = req.params;
  const result = await BrandService.updateBrand(tenantId, id, req.body as TUpdateBrand);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Brand updated successfully',
    data: result,
  });
});

const deleteBrand = catchAsync(async (req, res) => {
  const tenantId = req.tenantId;
  const { id } = req.params;
  const result = await BrandService.deleteBrand(tenantId, id);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Brand deleted successfully',
    data: result,
  });
});

const getAllBrands = catchAsync(async (req, res) => {
  const tenantId = req.tenantId;
  const result = await BrandService.getAllBrands(tenantId);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Brands retrieved successfully',
    data: result,
  });
});

export const BrandController = {
  createBrand,
  updateBrand,
  deleteBrand,
  getAllBrands,
};
