const prisma = require('../prisma/client');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

// addCoupon
const addCoupon = async (req, res,next) => {
  try {
    const data = { ...req.body };
    if(!data.startTime){
      data.startTime = new Date();
    }
    await prisma.coupon.create({ data });
    res.send({ message: 'Coupon Added Successfully!' });
  } catch (error) {
    next(error)
  }
};
// addAllCoupon
const addAllCoupon = async (req, res,next) => {
  try {
    await prisma.coupon.deleteMany();
    await prisma.coupon.createMany({ data: req.body, skipDuplicates: true });
    res.status(200).send({
      message: 'Coupon Added successfully!',
    });
  } catch (error) {
    next(error)
  }
};
// getAllCoupons
const getAllCoupons = async (req, res,next) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.send(coupons);
  } catch (error) {
    next(error)
  }
};
// getCouponById
const getCouponById = async (req, res,next) => {
  try {
    const coupon = await prisma.coupon.findUnique({ where: { id: req.params.id } });
    res.send(coupon);
  } catch (error) {
    next(error)
  }
};
// updateCoupon
const updateCoupon = async (req, res,next) => {
  try {
    const coupon = await prisma.coupon.findUnique({ where: { id: req.params.id } });
    if (coupon) {
      const updateData = {
        title: req.body.title,
        couponCode: req.body.couponCode,
        endTime: new Date(dayjs().utc().format(req.body.endTime)),
        discountPercentage: req.body.discountPercentage,
        minimumAmount: req.body.minimumAmount,
        productType: req.body.productType,
        logo: req.body.logo,
      };
      await prisma.coupon.update({
        where: { id: req.params.id },
        data: updateData
      });
      res.send({ message: 'Coupon Updated Successfully!' });
    } else {
      res.status(404).send({ message: 'Coupon Not Found' });
    }
  } catch (error) {
    next(error)
  }
};
// deleteCoupon
const deleteCoupon = async (req, res,next) => {
  try {
    await prisma.coupon.delete({ where: { id: req.params.id } });
    res.status(200).json({
      success:true,
      message:'Coupon delete successfully',
    })
  } catch (error) {
    next(error)
  }
};

module.exports = {
  addCoupon,
  addAllCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
};
