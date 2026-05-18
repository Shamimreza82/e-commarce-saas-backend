import { ProductRepository } from './product.repository';
import { TCreateProduct } from './product.validation';
import { prisma } from '@/bootstrap/prisma';
import { AppError } from '@/shared/errors/AppError';
import { StatusCodes } from 'http-status-codes';

const createProduct = async (tenantId: string, payload: TCreateProduct) => {
  return ProductRepository.create(tenantId, payload);
};

const getAllProducts = async (tenantId: string) => {
  return ProductRepository.findAll(tenantId);
};

const getProductById = async (tenantId: string, id: string) => {
  return ProductRepository.findById(tenantId, id);
};

const updateProduct = async (tenantId: string, id: string, payload: Partial<TCreateProduct>) => {
  return ProductRepository.update(tenantId, id, payload);
};

const deleteProduct = async (tenantId: string, id: string) => {
  return ProductRepository.delete(tenantId, id);
};

const getProductBySlug = async (tenantSlug: string, productSlug: string) => {
  // 1. Find tenant first
  const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
  if (!tenant) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Store not found');
  }

  // 2. Find product by slug within that tenant
  const product = await ProductRepository.findBySlug(tenant.id, productSlug);
  if (!product) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');
  }

  return product;
};

const getPublicProducts = async (tenantSlug: string) => {
  const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
  if (!tenant) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Store not found');
  }

  return ProductRepository.findAll(tenant.id);
};

export const ProductService = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductBySlug,
  getPublicProducts,
};
