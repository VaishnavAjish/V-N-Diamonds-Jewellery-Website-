require('dotenv').config();
const prisma = require('./prisma/client');

const brandData = require('./utils/brands');
const categoryData = require('./utils/categories');
const productsData = require('./utils/products');
const couponData = require('./utils/coupons');
const userData = require('./utils/users');
const adminData = require('./utils/admin');
const orderData = require('./utils/orders');
const reviewsData = require('./utils/reviews');
const fs = require('fs');

const importData = async () => {
  let log = "";
  try {
    log += "Starting import...\n";

    // Delete existing data
    await prisma.review.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.brand.deleteMany();
    await prisma.user.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.coupon.deleteMany();
    log += "Deleted existing data.\n";

    // Brands
    if (brandData.length > 0) {
      await prisma.brand.createMany({
        data: brandData.map(b => ({
          id: b._id,
          name: b.name,
          logo: b.logo,
          description: b.description,
          email: b.email,
          website: b.website,
          location: b.location,
          status: b.status,
        })),
        skipDuplicates: true
      });
      log += "Brands inserted.\n";
    }

    // Categories
    if (categoryData.length > 0) {
      await prisma.category.createMany({
        data: categoryData.map(c => ({
          id: c._id,
          img: c.img,
          parent: c.parent,
          children: c.children || [],
          productType: c.productType,
          description: c.description,
          status: c.status
        })),
        skipDuplicates: true
      });
      log += "Categories inserted.\n";
    }

    // Fetch existing categories and brands by name
    const existingCats = await prisma.category.findMany();
    const catByName = new Map(existingCats.map(c => [c.parent, c.id]));
    
    const existingBrands = await prisma.brand.findMany();
    const brandByName = new Map(existingBrands.map(b => [b.name, b.id]));

    // Products
    if (productsData.length > 0) {
      await prisma.product.createMany({
        data: productsData.map(p => {
          const catName = p.category?.name || "";
          const mappedCatId = catByName.get(catName) || p.category?.id || p.category?._id;
          
          const brandName = p.brand?.name || "";
          const mappedBrandId = brandByName.get(brandName) || p.brand?.id || p.brand?._id;
          
          return {
            id: p._id,
            sku: p.sku,
            img: p.img,
            title: p.title,
            slug: p.slug,
            unit: p.unit,
            imageURLs: p.imageURLs || [],
            parent: p.parent,
            children: p.children,
            price: Number(p.price) || 0,
            discount: Number(p.discount) || 0,
            quantity: Number(p.quantity) || 0,
            brandId: mappedBrandId,
            brandName: brandName,
            categoryId: mappedCatId,
            categoryName: catName,
            status: p.status,
            productType: p.productType,
            description: p.description,
            videoId: p.videoId,
            additionalInformation: p.additionalInformation || [],
            tags: p.tags || [],
            sizes: p.sizes || [],
            offerStartDate: p.offerDate?.startDate ? new Date(p.offerDate.startDate) : null,
            offerEndDate: p.offerDate?.endDate ? new Date(p.offerDate.endDate) : null,
            featured: p.featured || false,
            sellCount: p.sellCount || 0,
          };
        }),
        skipDuplicates: true
      });
      log += "Products inserted.\n";
    }

    // Coupons
    if (couponData.length > 0) {
      await prisma.coupon.createMany({
        data: couponData.map(c => ({
          id: c._id,
          title: c.title,
          logo: c.logo,
          couponCode: c.couponCode,
          startTime: c.startTime ? new Date(c.startTime) : null,
          endTime: new Date(c.endTime),
          discountPercentage: Number(c.discountPercentage) || 0,
          minimumAmount: Number(c.minimumAmount) || 0,
          productType: c.productType,
          status: c.status
        })),
        skipDuplicates: true
      });
      log += "Coupons inserted.\n";
    }

    // Admins
    if (adminData.length > 0) {
      await prisma.admin.createMany({
        data: adminData.map(a => ({
          id: a._id,
          name: 'Superadmin',
          email: 'superadmin@gmail.com', // Fix the swapped name/email just in case!
          image: a.image,
          phone: a.phone,
          status: a.status || "active",
          password: a.password,
          role: a.role,
        })),
        skipDuplicates: true
      });
      log += "Admins inserted.\n";
    }

    // Users
    if (userData.length > 0) {
      await prisma.user.createMany({
        data: userData.map(u => ({
          id: u._id,
          name: u.name,
          email: u.email,
          password: u.password,
          role: u.role,
          contactNumber: u.contactNumber,
          shippingAddress: u.shippingAddress,
          imageURL: u.imageURL,
          phone: u.phone,
          address: u.address,
          bio: u.bio,
          status: u.status
        })),
        skipDuplicates: true
      });
      log += "Users inserted.\n";
    }

    // Orders — skip any whose userId doesn't exist in the DB
    if (orderData.length > 0) {
      const existingUserIds = new Set((await prisma.user.findMany()).map(u => u.id));
      const validOrders = orderData.filter(o => existingUserIds.has(o.user || o.userId));
      log += `Orders: ${validOrders.length} valid out of ${orderData.length}.\n`;

      if (validOrders.length > 0) {
        await prisma.order.createMany({
          data: validOrders.map(o => ({
            id: o._id,
            userId: o.user || o.userId,
            cart: o.cart || [],
            name: o.name,
            address: o.address,
            email: o.email,
            contact: o.contact,
            city: o.city,
            country: o.country,
            zipCode: String(o.zipCode),
            subTotal: Number(o.subTotal) || 0,
            shippingCost: Number(o.shippingCost) || 0,
            discount: Number(o.discount) || 0,
            totalAmount: Number(o.totalAmount) || 0,
            shippingOption: o.shippingOption,
            cardInfo: o.cardInfo,
            paymentIntent: o.paymentIntent,
            paymentMethod: o.paymentMethod,
            orderNote: o.orderNote,
            status: o.status
          })),
          skipDuplicates: true
        });
        log += "Orders inserted.\n";
      }
    }

    // Reviews
    if (reviewsData.length > 0) {
      const existingUsers = new Set((await prisma.user.findMany()).map(u => u.id));
      const existingProducts = new Set((await prisma.product.findMany()).map(p => p.id));
      
      const validReviews = reviewsData.filter(r => {
        const uId = r.user || r.userId;
        const pId = r.product || r.productId;
        return existingUsers.has(uId) && existingProducts.has(pId);
      });

      await prisma.review.createMany({
        data: validReviews.map(r => ({
          id: r._id,
          userId: r.user || r.userId,
          productId: r.product || r.productId,
          rating: Number(r.rating) || 0,
          comment: r.comment
        })),
        skipDuplicates: true
      });
      log += "Reviews inserted.\n";
    }

    log += 'Data inserted successfully into PostgreSQL via Prisma!\n';
    fs.writeFileSync('seed-log.txt', log);
    process.exit(0);
  } catch (error) {
    log += `ERROR: ${error.message}\n${error.stack}`;
    fs.writeFileSync('seed-log.txt', log);
    process.exit(1);
  }
};

importData();
