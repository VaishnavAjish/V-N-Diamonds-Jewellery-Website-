const ApiError = require('../errors/api-error');
const prisma = require('../prisma/client');

// addBrandService
module.exports.addBrandService = async (data) => {
  const brand = await prisma.brand.create({ data });
  return brand;
}

// create all Brands service
exports.addAllBrandService = async (data) => {
  await prisma.brand.deleteMany();
  // prisma createMany doesn't return the inserted documents, so we can return success count
  const result = await prisma.brand.createMany({ data, skipDuplicates: true });
  return result;
}

// get all Brands service
exports.getBrandsService = async () => {
  const brands = await prisma.brand.findMany({
    where: { status: 'active' },
    include: { products: true }
  });
  return brands;
}

// delete Brands service
exports.deleteBrandsService = async (id) => {
  const brand = await prisma.brand.delete({
    where: { id }
  });
  return brand;
}

// update brand
exports.updateBrandService = async (id, payload) => {
  const isExist = await prisma.brand.findUnique({ where: { id } });

  if (!isExist) {
    throw new ApiError(404, 'Brand not found !');
  }

  const result = await prisma.brand.update({
    where: { id },
    data: payload
  });
  return result;
}

// get single brand
exports.getSingleBrandService = async (id) => {
  const result = await prisma.brand.findUnique({
    where: { id }
  });
  return result;
}