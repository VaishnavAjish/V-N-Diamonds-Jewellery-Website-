const categories = require('./utils/categories');
const products = require('./utils/products');
const fs = require('fs');

const validCatIds = new Set(categories.map(c => c._id));
const validBrandIds = new Set(require('./utils/brands').map(b => b._id));

const mismatchedCategories = products.filter(p => {
  const catId = p.category?.id || p.category?._id;
  return !validCatIds.has(catId);
});

const mismatchedBrands = products.filter(p => {
  const brandId = p.brand?.id || p.brand?._id;
  return !validBrandIds.has(brandId);
});

fs.writeFileSync('mismatch-results.json', JSON.stringify({
  categoryMismatches: mismatchedCategories.map(p => ({ title: p.title, catId: p.category?.id || p.category?._id, catName: p.category?.name })),
  brandMismatches: mismatchedBrands.map(p => ({ title: p.title, brandId: p.brand?.id || p.brand?._id, brandName: p.brand?.name }))
}, null, 2));

console.log('done');
