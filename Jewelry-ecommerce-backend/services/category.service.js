const ApiError = require('../errors/api-error');
const prisma = require('../prisma/client');

// create category service
exports.createCategoryService = async (data) => {
  const category = await prisma.category.create({ data });
  return category;
}

// create all category service
exports.addAllCategoryService = async (data) => {
  await prisma.category.deleteMany();
  const result = await prisma.category.createMany({ data, skipDuplicates: true });
  return result;
}

// get all show category service
exports.getShowCategoryServices = async () => {
  const category = await prisma.category.findMany({
    where: { status: 'Show' },
    include: { products: true }
  });
  return category;
}

// get all category 
exports.getAllCategoryServices = async () => {
  const category = await prisma.category.findMany();
  return category;
}

// get type of category service
exports.getCategoryTypeService = async (param) => {
  const categories = await prisma.category.findMany({
    where: { productType: param },
    include: { products: true }
  });
  return categories;
}

// delete category service
exports.deleteCategoryService = async (id) => {
  const result = await prisma.category.delete({
    where: { id }
  });
  return result;
}

// update category
exports.updateCategoryService = async (id, payload) => {
  const isExist = await prisma.category.findUnique({ where: { id } });

  if (!isExist) {
    throw new ApiError(404, 'Category not found !');
  }

  const result = await prisma.category.update({
    where: { id },
    data: payload
  });
  return result;
}

// get single category
exports.getSingleCategoryService = async (id) => {
  const result = await prisma.category.findUnique({
    where: { id }
  });
  return result;
}