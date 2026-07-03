const prisma = require('../prisma/client');

// add a review
exports.addReview = async (req, res,next) => {
  const { userId, productId, rating, comment } = req.body;
  try {
    // Check if the user has already left a review for this product
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: userId,
        productId: productId,
      }
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already left a review for this product." });
    }
    
    // Fetch all orders for this user
    const orders = await prisma.order.findMany({
      where: { userId: userId }
    });

    let checkPurchase = false;
    for (const order of orders) {
      if (order.cart && Array.isArray(order.cart)) {
        for (const item of order.cart) {
          if (item._id === productId || item.id === productId) {
            checkPurchase = true;
            break;
          }
        }
      }
      if (checkPurchase) break;
    }

    if (!checkPurchase) {
      return res
        .status(400)
        .json({ message: "Without purchase you can not give here review!" });
    }

    // Create the new review
    const review = await prisma.review.create({
      data: {
        userId: userId,
        productId: productId,
        rating: Number(rating),
        comment: comment
      }
    });

    return res.status(201).json({ message: "Review added successfully." });
  } catch (error) {
    console.log(error);
    next(error)
  }
};

// delete a review
exports.deleteReviews = async (req, res,next) => {
  try {
    const productId = req.params.id;
    const result = await prisma.review.deleteMany({
      where: { productId: productId }
    });
    
    if (result.count === 0) {
      return res.status(404).json({ error: 'Product reviews not found' });
    }
    res.json({ message: 'All reviews deleted for the product' });
  } catch (error) {
    console.log(error);
    next(error)
  }
};

// get all reviews
exports.getAllReviews = async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: true, product: true }
    });
    res.status(200).json(reviews);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
