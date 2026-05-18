import { StatusCodes } from 'http-status-codes';

import { catchAsync } from '@/shared/utils/catchAsync';
import { sendResponse } from '@/shared/utils/sendResponse';

import { TenantService } from './tenant.service';
import { TUpdateTenant } from './tenant.validation';

const getMyTenant = catchAsync(async (req, res) => {
  const tenantId = req.tenantId;
  const result = await TenantService.getMyTenant(tenantId);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Tenant retrieved successfully',
    data: result,
  });
});

const updateTenant = catchAsync(async (req, res) => {
  const tenantId = req.tenantId;
  const result = await TenantService.updateTenant(tenantId, req.body as TUpdateTenant);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Tenant updated successfully',
    data: result,
  });
});

const getTenantBySlug = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const result = await TenantService.getTenantBySlug(slug);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Store details retrieved successfully',
    data: result,
  });
});

export const TenantController = {
  getMyTenant,
  updateTenant,
  getTenantBySlug,
};
