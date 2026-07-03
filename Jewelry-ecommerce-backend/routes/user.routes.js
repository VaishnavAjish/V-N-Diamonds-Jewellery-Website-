const express = require('express');
const router = express.Router();
const userController= require('../controller/user.controller');


// add a user
router.post("/signup", userController.signup);
// login
router.post("/login", userController.login);
// forget-password
router.patch('/forget-password', userController.forgetPassword);
// confirm-forget-password
router.patch('/confirm-forget-password', userController.confirmForgetPassword);
// change password
router.patch('/change-password', userController.changePassword);
// confirmEmail
router.get('/confirmEmail/:token', userController.confirmEmail);
// get all users
router.get('/all', userController.getAllUsers);
// updateUser
router.put('/update-user/:id', userController.updateUser);
// sync cart
router.patch('/sync-cart/:id', userController.syncCart);
// sync wishlist
router.patch('/sync-wishlist/:id', userController.syncWishlist);
// register or login with google
router.post("/register/:token", userController.signUpWithProvider);
// delete user
router.delete("/delete-user/:id", userController.deleteUser);

module.exports = router;