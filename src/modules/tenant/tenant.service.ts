import { StatusCodes } from 'http-status-codes';
import { AppError } from '@/shared/errors/AppError';
import { TenantRepository } from './tenant.repository';
import { TUpdateTenant } from './tenant.validation';

const getMyTenant = async (tenantId: string) => {
  const tenant = await TenantRepository.findById(tenantId);
  if (!tenant) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Tenant not found');
  }
  return tenant;
};

const updateTenant = async (tenantId: string, payload: TUpdateTenant) => {
  const tenant = await TenantRepository.findById(tenantId);
  if (!tenant) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Tenant not found');
  }

  return TenantRepository.update(tenantId, payload);
};

const getTenantBySlug = async (slug: string) => {
  const tenant = await TenantRepository.findBySlugOrDomain(slug);
  if (!tenant) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Store not found');
  }

  return tenant;
};

export const TenantService = {
  getMyTenant,
  updateTenant,
  getTenantBySlug,
};
