const prisma = require('../prisma/client');
const productServices = require("../services/product.service");
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');
const { cloudinaryServices } = require('../services/cloudinary.service');

// bulk import products from an uploaded vendor Excel sheet
exports.bulkImportExcel = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  const { brandId } = req.body;
  if (!brandId) {
    return res.status(400).json({ success: false, message: 'brandId is required' });
  }

  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'product-import-'));
  const ext = path.extname(req.file.originalname || '').toLowerCase();
  const isCsv = ext === '.csv';
  const filePath = path.join(workDir, isCsv ? 'upload.csv' : 'upload.xlsx');
  const imgDir = path.join(workDir, 'images');
  fs.writeFileSync(filePath, req.file.buffer);

  try {
    const brand = await prisma.brand.findUnique({ where: { id: brandId } });
    if (!brand) {
      return res.status(400).json({ success: false, message: 'Brand not found' });
    }

    let rows;
    if (isCsv) {
      rows = await runExtractCsvScript(filePath);
    } else {
      rows = await runExtractScript(filePath, imgDir);
    }

    // pre-create all distinct categories once, instead of one upsert per row
    const categoryNames = [...new Set(rows.map((r) => r.categoryName || 'Uncategorized'))];
    const categoryByName = {};
    for (const name of categoryNames) {
      categoryByName[name] = await prisma.category.upsert({
        where: { parent: name },
        update: {},
        create: { parent: name, children: [], productType: 'jewelry' },
      });
    }

    // pre-load existing SKUs for this brand once, instead of one lookup per row
    const existingProducts = await prisma.product.findMany({
      where: { brandId: brand.id, sku: { in: rows.map((r) => r.sku) } },
      select: { id: true, sku: true },
    });
    const existingBySku = new Map(existingProducts.map((p) => [p.sku, p.id]));

    let created = 0;
    let updated = 0;
    const errors = [];

    const importRow = async (row) => {
      try {
        const category = categoryByName[row.categoryName || 'Uncategorized'];

        let imgUrl = '';
        if (row.imagePath && fs.existsSync(row.imagePath)) {
          const uploadResult = await cloudinaryServices.cloudinaryImageUpload(fs.readFileSync(row.imagePath));
          imgUrl = uploadResult.secure_url;
        }

        const price = parseFloat(String(row.saleTotal).replace(/[^0-9.]/g, '')) || 0;
        const title = row.settingType || row.subCategory || row.sku;
        const description = row.description || [
          row.shape && `Shape: ${row.shape}`,
          row.metalCombined && `Metal: ${row.metalCombined}`,
          row.grossGms && `Gross Weight: ${row.grossGms}g`,
          row.diamondPcs && `Diamond Pieces: ${row.diamondPcs}`,
          row.certificate && `Certificate: ${row.certificate}`,
          row.certNo && `Cert. No: ${row.certNo}`,
        ].filter(Boolean).join(', ');

        const productData = {
          sku: row.sku,
          title,
          unit: 'pcs',
          img: imgUrl,
          imageURLs: imgUrl ? [{ color: { name: '', clrCode: '' }, img: imgUrl }] : [],
          parent: category.parent,
          children: row.subCategory || '',
          price,
          discount: 0,
          quantity: 1,
          brandId: brand.id,
          brandName: brand.name,
          categoryId: category.id,
          categoryName: category.parent,
          status: 'in-stock',
          productType: 'jewelry',
          description,
          additionalInformation: [
            { key: 'Jewellery', value: row.categoryName },
            { key: 'Product', value: row.subCategory },
            { key: 'Poetic Name', value: row.settingType },
            { key: 'Lot Number', value: row.sku },
            { key: 'Metal', value: row.metalId },
            { key: 'Metal gms', value: row.metalGms },
            { key: 'Diamond Pcs', value: row.diamondPcs },
            { key: 'Shape', value: row.shape },
            { key: 'Certificate', value: row.certificate },
            { key: 'Cert.No', value: row.certNo },
            { key: 'Gross Gms', value: row.grossGms },
            { key: 'USD Price', value: row.saleTotal },
          ].filter((item) => item.value),
          tags: [row.shape, row.metalId].filter(Boolean),
          sizes: [],
          featured: false,
        };

        const existingId = existingBySku.get(row.sku);
        if (existingId) {
          await prisma.product.update({ where: { id: existingId }, data: productData });
          updated += 1;
        } else {
          await prisma.product.create({ data: productData });
          created += 1;
        }
      } catch (rowErr) {
        errors.push({ row: row.row, sku: row.sku, message: rowErr.message });
      }
    };

    // process rows with bounded concurrency so cloudinary uploads run in parallel
    const CONCURRENCY = 8;
    for (let i = 0; i < rows.length; i += CONCURRENCY) {
      await Promise.all(rows.slice(i, i + CONCURRENCY).map(importRow));
    }

    res.status(200).json({
      success: true,
      message: 'Bulk import complete',
      data: { totalRows: rows.length, created, updated, errors },
    });
  } catch (error) {
    next(error);
  } finally {
    fs.rmSync(workDir, { recursive: true, force: true });
  }
};

const STANDARD_SHAPES = ['Round', 'Oval', 'Emerald', 'Princess', 'Radiant', 'Marquise', 'Asscher', 'Cushion', 'Heart'];

// dynamic sidebar filter options (category, color, shape) derived from live product data
exports.getDynamicFilters = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({ select: { categoryName: true, tags: true, additionalInformation: true } });

    const categorySet = new Set();
    let hasOtherShape = false;

    for (const p of products) {
      if (p.categoryName) categorySet.add(p.categoryName);

      const tags = p.tags || [];
      const matchedStandard = STANDARD_SHAPES.some((shape) =>
        tags.some((t) => (t || '').trim().toLowerCase() === shape.toLowerCase())
      );
      if (!matchedStandard && tags.length > 0) {
        hasOtherShape = true;
      }
    }

    // always show all standard shapes so the filter is a stable, complete list
    const shape = [...STANDARD_SHAPES];
    if (hasOtherShape) shape.push('Other');

    const metalSet = new Set(['14K', '18K']);
    for (const p of products) {
      if (Array.isArray(p.additionalInformation)) {
        const metalItem = p.additionalInformation.find((i) => i && typeof i.key === 'string' && i.key.toLowerCase() === 'metal');
        if (metalItem && metalItem.value) {
          metalSet.add(metalItem.value.trim());
        }
      }
    }

    res.status(200).json({
      success: true,
      data: {
        category: [...categorySet],
        color: [], // leaving this just in case frontend still expects it
        metal: [...metalSet],
        shape,
      },
    });
  } catch (error) {
    next(error);
  }
};

function runExtractScript(xlsxPath, imgDir) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '..', 'scripts', 'extract_excel_products.py');
    const py = spawn('python', [scriptPath, xlsxPath, imgDir]);
    let stdout = '';
    let stderr = '';
    py.stdout.on('data', (d) => { stdout += d; });
    py.stderr.on('data', (d) => { stderr += d; });
    py.on('error', reject);
    py.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(stderr || `extract script exited with code ${code}`));
      }
      try {
        const parsed = JSON.parse(stdout);
        if (parsed && parsed.error) return reject(new Error(parsed.error));
        resolve(parsed);
      } catch (e) {
        reject(new Error('Failed to parse extractor output: ' + e.message));
      }
    });
  });
}

function runExtractCsvScript(csvPath) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '..', 'scripts', 'extract_csv_products.py');
    const py = spawn('python', [scriptPath, csvPath]);
    let stdout = '';
    let stderr = '';
    py.stdout.on('data', (d) => { stdout += d; });
    py.stderr.on('data', (d) => { stderr += d; });
    py.on('error', reject);
    py.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(stderr || `csv extract script exited with code ${code}`));
      }
      try {
        const parsed = JSON.parse(stdout);
        if (parsed && parsed.error) return reject(new Error(parsed.error));
        resolve(parsed);
      } catch (e) {
        reject(new Error('Failed to parse csv extractor output: ' + e.message));
      }
    });
  });
}

// add product
exports.addProduct = async (req, res,next) => {
  console.log('product--->',req.body);
  try {
    const firstItem = {
      color: {
        name:'',
        clrCode:''
      },
      img: req.body.img,
    };
    const imageURLs = [firstItem, ...req.body.imageURLs];
    const result = await productServices.createProductService({
      ...req.body,
      imageURLs: imageURLs,
    });

    console.log('product-result',result)
 
    res.status(200).json({
      success:true,
      status: "success",
      message: "Product created successfully!",
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(error)
  }
};


// add all product
module.exports.addAllProducts = async (req,res,next) => {
  try {
    const result = await productServices.addAllProductService(req.body);
    res.json({
      message:'Products added successfully',
      result,
    })
  } catch (error) {
    next(error)
  }
}

// get all products
exports.getAllProducts = async (req,res,next) => {
  try {
    const result = await productServices.getAllProductsService();
    res.status(200).json({
      success:true,
      data:result,
    })
  } catch (error) {
    next(error)
  }
}

// get all products by type
module.exports.getProductsByType = async (req,res,next) => {
  try {
    const result = await productServices.getProductTypeService(req);
    res.status(200).json({
      success:true, 
      data:result,
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

// get offer product controller
module.exports.getOfferTimerProducts = async (req,res,next) => {
  try {
    const result = await productServices.getOfferTimerProductService(req.query.type);
    res.status(200).json({
      success:true, 
      data:result,
    })
  } catch (error) {
    next(error)
  }
}

// get Popular Product By Type
module.exports.getPopularProductByType = async (req,res,next) => {
  try {
    const result = await productServices.getPopularProductServiceByType(req.params.type);
    res.status(200).json({
      success:true, 
      data:result,
    })
  } catch (error) {
    next(error)
  }
}

// get top rated Products
module.exports.getTopRatedProducts = async (req,res,next) => {
  try {
    const result = await productServices.getTopRatedProductService();
    res.status(200).json({
      success:true, 
      data:result,
    })
  } catch (error) {
    next(error)
  }
}

// getSingleProduct
exports.getSingleProduct = async (req,res,next) => {
  try {
    const product = await productServices.getProductService(req.params.id)
    res.json(product)
  } catch (error) {
    next(error)
  }
}

// get Related Product
exports.getRelatedProducts = async (req,res,next) => {
  try {
    const products = await productServices.getRelatedProductService(req.params.id)
    res.status(200).json({
      success:true, 
      data:products,
    })
  } catch (error) {
    next(error)
  }
}

// update product
exports.updateProduct = async (req, res,next) => {
  try {
    const product = await productServices.updateProductService(req.params.id,req.body)
    res.send({ data: product, message: "Product updated successfully!" });
  } catch (error) {
    next(error)
  }
};

// update product
exports.reviewProducts = async (req, res,next) => {
  try {
    const products = await productServices.getReviewsProducts()
    res.status(200).json({
      success:true, 
      data:products,
    })
  } catch (error) {
    next(error)
  }
};

// update product
exports.stockOutProducts = async (req, res,next) => {
  try {
    const products = await productServices.getStockOutProducts();
    res.status(200).json({
      success:true, 
      data:products,
    })
  } catch (error) {
    next(error)
  }
};

// update product
exports.deleteProduct = async (req, res,next) => {
  try {
    await productServices.deleteProduct(req.params.id);
    res.status(200).json({
      message:'Product delete successfully'
    })
  } catch (error) {
    next(error)
  }
};

