const prisma = require('../prisma/client');

// create product service
exports.createProductService = async (data) => {
  const { brand, category, ...productData } = data;
  
  // ensure brand and category exist by extracting their IDs
  // or creating the product with connections
  const product = await prisma.product.create({
    data: {
      ...productData,
      brandId: brand.id,
      brandName: brand.name,
      categoryId: category.id,
      categoryName: category.name,
    }
  });

  return product;
};

// create all product service
exports.addAllProductService = async (data) => {
  await prisma.product.deleteMany();
  
  const formattedData = data.map(item => {
    const { brand, category, _id, ...rest } = item;
    return {
      ...rest,
      brandId: brand.id || brand._id,
      brandName: brand.name,
      categoryId: category.id || category._id,
      categoryName: category.name,
    };
  });

  const products = await prisma.product.createMany({
    data: formattedData,
    skipDuplicates: true
  });
  return products;
};

// get product data
exports.getAllProductsService = async () => {
  const products = await prisma.product.findMany({
    include: { reviews: true }
  });
  return products;
};

// get type of product service
exports.getProductTypeService = async (req) => {
  const type = req.params.type;
  const query = req.query;
  let products;

  if (query.new === "true") {
    products = await prisma.product.findMany({
      where: { productType: type },
      orderBy: { createdAt: 'desc' },
      take: 40,
      include: { reviews: true }
    });
  } else if (query.featured === "true") {
    products = await prisma.product.findMany({
      where: {
        productType: type,
        featured: true,
      },
      include: { reviews: true }
    });
  } else if (query.topSellers === "true") {
    products = await prisma.product.findMany({
      where: { productType: type },
      orderBy: { sellCount: 'desc' },
      take: 8,
      include: { reviews: true }
    });
  } else {
    products = await prisma.product.findMany({
      where: { productType: type },
      include: { reviews: true }
    });
  }
  return products;
};

// get offer product service
exports.getOfferTimerProductService = async (query) => {
  const products = await prisma.product.findMany({
    where: {
      productType: query,
      offerEndDate: { gt: new Date() },
    },
    include: { reviews: true }
  });
  return products;
};

// get popular product service by type
exports.getPopularProductServiceByType = async (type) => {
  // Prisma doesn't have a direct sortBy relation length, so we fetch and sort in memory
  // For production, consider adding a reviewCount field or using raw queries
  const products = await prisma.product.findMany({
    where: { productType: type },
    include: { reviews: true }
  });
  
  products.sort((a, b) => b.reviews.length - a.reviews.length);
  return products.slice(0, 8);
};

exports.getTopRatedProductService = async () => {
  const products = await prisma.product.findMany({
    where: {
      reviews: {
        some: {} // Exists
      }
    },
    include: { reviews: true }
  });

  const topRatedProducts = products.map((product) => {
    const totalRating = product.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating = totalRating / product.reviews.length;

    return {
      ...product,
      rating: averageRating,
    };
  });

  topRatedProducts.sort((a, b) => b.rating - a.rating);
  return topRatedProducts;
};

// get product data
exports.getProductService = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      reviews: {
        include: {
          user: {
            select: { name: true, email: true, imageURL: true }
          }
        }
      }
    }
  });
  return product;
};

// get product data
exports.getRelatedProductService = async (productId) => {
  const currentProduct = await prisma.product.findUnique({
    where: { id: productId },
    select: { categoryName: true }
  });

  if (!currentProduct) return [];

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryName: currentProduct.categoryName,
      id: { not: productId },
    }
  });
  return relatedProducts;
};

// update a product
exports.updateProductService = async (id, currProduct) => {
  const { brand, category, ...productData } = currProduct;
  
  const updateData = { ...productData };
  if (brand) {
    updateData.brandName = brand.name;
    updateData.brandId = brand.id;
  }
  if (category) {
    updateData.categoryName = category.name;
    updateData.categoryId = category.id;
  }

  const product = await prisma.product.update({
    where: { id },
    data: updateData
  });

  return product;
};

// get Reviews Products
exports.getReviewsProducts = async () => {
  const products = await prisma.product.findMany({
    where: {
      reviews: {
        some: {}
      }
    },
    include: {
      reviews: {
        include: {
          user: { select: { name: true, email: true, imageURL: true } }
        }
      }
    }
  });

  return products;
};

// get Reviews Products
exports.getStockOutProducts = async () => {
  const result = await prisma.product.findMany({
    where: { status: "out-of-stock" },
    orderBy: { createdAt: 'desc' }
  });
  return result;
};

// get Reviews Products
exports.deleteProduct = async (id) => {
  const result = await prisma.product.delete({
    where: { id }
  });
  return result;
};