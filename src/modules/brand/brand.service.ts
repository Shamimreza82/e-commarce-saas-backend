import { BrandRepository } from './brand.repository';
import { TCreateBrand, TUpdateBrand } from './brand.validation';

const createBrand = async (tenantId: string, payload: TCreateBrand) => {
  return BrandRepository.create(tenantId, payload);
};

const updateBrand = async (tenantId: string, id: string, payload: TUpdateBrand) => {
  return BrandRepository.update(tenantId, id, payload);
};

const deleteBrand = async (tenantId: string, id: string) => {
  return BrandRepository.delete(tenantId, id);
};

const getAllBrands = async (tenantId: string) => {
  return BrandRepository.findAll(tenantId);
};

export const BrandService = {
  createBrand,
  updateBrand,
  deleteBrand,
  getAllBrands,
};
