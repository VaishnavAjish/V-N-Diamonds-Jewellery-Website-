const { secret } = require("../config/secret");
const stripe = require("stripe")(secret.stripe_key);
const prisma = require('../prisma/client');

// create-payment-intent
exports.paymentIntent = async (req, res, next) => {
  try {
    const product = req.body;
    const price = Number(product.price);
    const amount = price * 100;
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "usd",
      amount: amount,
      payment_method_types: ["card"],
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log(error);
    next(error)
  }
};
// addOrder
exports.addOrder = async (req, res, next) => {
  try {
    const { user, ...orderData } = req.body;
    
    // In Mongoose, it might pass user as ID or object. Handle accordingly:
    const userId = typeof user === 'string' ? user : user?._id || user?.id;
    
    const orderItems = await prisma.order.create({
      data: {
        ...orderData,
        userId: userId,
      }
    });

    res.status(200).json({
      success: true,
      message: "Order added successfully",
      order: orderItems,
    });
  }
  catch (error) {
    console.log(error);
    next(error)
  }
};
// get Orders
exports.getOrders = async (req, res, next) => {
  try {
    const orderItems = await prisma.order.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({
      success: true,
      data: orderItems,
    });
  }
  catch (error) {
    console.log(error);
    next(error)
  }
};
// get Orders
exports.getSingleOrder = async (req, res, next) => {
  try {
    const orderItem = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { user: true }
    });
    res.status(200).json(orderItem);
  }
  catch (error) {
    console.log(error);
    next(error)
  }
};

exports.updateOrderStatus = async (req, res) => {
  const newStatus = req.body.status;
  try {
    await prisma.order.update({
      where: { id: req.params.id },
      data: { status: newStatus }
    });
    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
    });
  }
  catch (error) {
    console.log(error);
    next(error)
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    await prisma.order.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
