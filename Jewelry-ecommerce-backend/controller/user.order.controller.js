const prisma = require('../prisma/client');
const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
const isToday = require("dayjs/plugin/isToday");
const isYesterday = require("dayjs/plugin/isYesterday");
const isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
const isSameOrAfter = require("dayjs/plugin/isSameOrAfter");

// Apply necessary plugins to dayjs
dayjs.extend(customParseFormat);
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

// get all orders user
module.exports.getOrderByUser = async (req, res,next) => {
  try {
    const { page, limit } = req.query;

    const pages = Number(page) || 1;
    const limits = Number(limit) || 8;
    const skip = (pages - 1) * limits;

    const userId = req.user.id || req.user._id;

    const totalDoc = await prisma.order.count({ where: { userId } });

    // total padding order count
    const totalPendingOrder = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      _count: true,
      where: { status: "pending", userId }
    });

    // total processing order count
    const totalProcessingOrder = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      _count: true,
      where: { status: "processing", userId }
    });

    // total delivered order count
    const totalDeliveredOrder = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      _count: true,
      where: { status: "delivered", userId }
    });

    // query for orders
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { id: 'desc' },
      skip,
      take: limits
    });

    res.send({
      orders,
      pending: totalPendingOrder._count || 0,
      processing: totalProcessingOrder._count || 0,
      delivered: totalDeliveredOrder._count || 0,
      totalDoc,
    });
  } catch (error) {
    next(error)
  }
};

// getOrderById
module.exports.getOrderById = async (req, res,next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id }
    });
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error)
  }
};

// getDashboardAmount
exports.getDashboardAmount = async (req, res,next) => {
  try {
    const todayStart = dayjs().startOf("day").toDate();
    const todayEnd = dayjs().endOf("day").toDate();

    const yesterdayStart = dayjs().subtract(1, "day").startOf("day").toDate();
    const yesterdayEnd = dayjs().subtract(1, "day").endOf("day").toDate();

    const monthStart = dayjs().startOf("month").toDate();
    const monthEnd = dayjs().endOf("month").toDate();

    const todayOrders = await prisma.order.findMany({
      where: { createdAt: { gte: todayStart, lte: todayEnd } }
    });

    let todayCashPaymentAmount = 0;
    let todayCardPaymentAmount = 0;

    todayOrders.forEach((order) => {
      if (order.paymentMethod === "COD") {
        todayCashPaymentAmount += order.totalAmount;
      } else if (order.paymentMethod === "Card") {
        todayCardPaymentAmount += order.totalAmount;
      }
    });

    const yesterdayOrders = await prisma.order.findMany({
      where: { createdAt: { gte: yesterdayStart, lte: yesterdayEnd } }
    });

    let yesterDayCashPaymentAmount = 0;
    let yesterDayCardPaymentAmount = 0;

    yesterdayOrders.forEach((order) => {
      if (order.paymentMethod === "COD") {
        yesterDayCashPaymentAmount += order.totalAmount;
      } else if (order.paymentMethod === "Card") {
        yesterDayCardPaymentAmount += order.totalAmount;
      }
    });

    const monthlyOrders = await prisma.order.findMany({
      where: { createdAt: { gte: monthStart, lte: monthEnd } }
    });

    const totalOrders = await prisma.order.findMany();
    
    const todayOrderAmount = todayOrders.reduce((total, order) => total + order.totalAmount, 0);
    const yesterdayOrderAmount = yesterdayOrders.reduce((total, order) => total + order.totalAmount, 0);
    const monthlyOrderAmount = monthlyOrders.reduce((total, order) => total + order.totalAmount, 0);
    const totalOrderAmount = totalOrders.reduce((total, order) => total + order.totalAmount, 0);

    res.status(200).send({
      todayOrderAmount,
      yesterdayOrderAmount,
      monthlyOrderAmount,
      totalOrderAmount,
      todayCardPaymentAmount,
      todayCashPaymentAmount,
      yesterDayCardPaymentAmount,
      yesterDayCashPaymentAmount,
    });
  } catch (error) {
    next(error)
  }
};

// get sales report
exports.getSalesReport = async (req, res,next) => {
  try {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);

    const salesOrderChartData = await prisma.order.findMany({
      where: {
        updatedAt: {
          gte: startOfWeek,
          lte: new Date(),
        }
      }
    });

    const salesReport = salesOrderChartData.reduce((acc, value) => {
      const onlyDate = value.updatedAt.toISOString().split("T")[0];

      if (!acc[onlyDate]) {
        acc[onlyDate] = { date: onlyDate, total: 0, order: 0 };
      }
      acc[onlyDate].total += value.totalAmount;
      acc[onlyDate].order += 1;
      return acc;
    }, {});

    const salesReportData = Object.values(salesReport);

    res.status(200).json({ salesReport: salesReportData });
  } catch (error) {
    next(error)
  }
};

// Most Selling Category
exports.mostSellingCategory = async (req, res,next) => {
  try {
    const orders = await prisma.order.findMany({
      select: { cart: true }
    });

    const categoryCount = {};

    orders.forEach(order => {
      if (order.cart && Array.isArray(order.cart)) {
        order.cart.forEach(item => {
          if (item.productType) {
            if (!categoryCount[item.productType]) {
              categoryCount[item.productType] = 0;
            }
            categoryCount[item.productType] += (item.orderQuantity || 1);
          }
        });
      }
    });

    const categoryData = Object.keys(categoryCount).map(key => {
      return { _id: key, count: categoryCount[key] };
    });

    // Sort descending by count
    categoryData.sort((a, b) => b.count - a.count);

    res.status(200).json({ categoryData: categoryData.slice(0, 5) });
  } catch (error) {
    next(error)
  }
};

// dashboard recent order
exports.getDashboardRecentOrder = async (req, res,next) => {
  try {
    const { page, limit } = req.query;

    const pages = Number(page) || 1;
    const limits = Number(limit) || 8;
    const skip = (pages - 1) * limits;

    const statuses = ["pending", "processing", "delivered", "cancel"];

    const totalDoc = await prisma.order.count({
      where: { status: { in: statuses } }
    });

    const orders = await prisma.order.findMany({
      where: { status: { in: statuses } },
      orderBy: { updatedAt: 'desc' },
      skip,
      take: limits,
      select: {
        invoice: true,
        createdAt: true,
        updatedAt: true,
        paymentMethod: true,
        name: true,
        userId: true, // Prisma can't directly select user as object without include
        user: true, 
        totalAmount: true,
        status: true,
      }
    });

    res.status(200).send({
      orders: orders,
      page: page,
      limit: limit,
      totalOrder: totalDoc,
    });
  } catch (error) {
    next(error)
  }
};
