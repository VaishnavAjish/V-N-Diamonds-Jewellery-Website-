const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const prisma = require('../prisma/client');
const { sendEmail } = require("../config/email");
const { generateToken, tokenForVerify } = require("../utils/token");
const { secret } = require("../config/secret");

// Helper for generating confirmation token
const generateConfirmationToken = () => {
  const token = crypto.randomBytes(32).toString("hex");
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return { token, expires: date };
};

// register user
// sign up
exports.signup = async (req, res,next) => {
  try {
    const user = await prisma.user.findUnique({ where: { email: req.body.email } });
    if (user) {
      res.send({ status: "failed", message: "Email already exists" });
    } else {
      const { token, expires } = generateConfirmationToken();
      const hashedPassword = req.body.password ? bcrypt.hashSync(req.body.password) : undefined;
      
      const saved_user = await prisma.user.create({
        data: {
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
          confirmationToken: token,
          confirmationTokenExpires: expires,
          status: 'inactive'
        }
      });

      const mailData = {
        from: secret.email_user,
        to: `${req.body.email}`,
        subject: "Email Activation",
        html: `<h2>Hello ${req.body.name}</h2>
        <p>Verify your email address to complete the signup and login into your <strong>shofy</strong> account.</p>
  
          <p>This link will expire in <strong> 10 minute</strong>.</p>
  
          <p style="margin-bottom:20px;">Click this link for active your account</p>
  
          <a href="${secret.client_url}/email-verify/${token}" style="background:#0989FF;color:white;border:1px solid #0989FF; padding: 10px 15px; border-radius: 4px; text-decoration:none;">Verify Account</a>
  
          <p style="margin-top: 35px;">If you did not initiate this request, please contact us immediately at support@shofy.com</p>
  
          <p style="margin-bottom:0px;">Thank you</p>
          <strong>shofy Team</strong>
           `,
      };
      const message = "Please check your email to verify!";
      sendEmail(mailData, res, message);
    }
  } catch (error) {
    next(error)
  }
};

/**
 * 1. Check if Email and password are given
 * 2. Load user with email
 * 3. if not user send res
 * 4. compare password
 * 5. if password not correct send res
 * 6. check if user is active
 * 7. if not active send res
 * 8. generate token
 * 9. send user and token
 */
module.exports.login = async (req, res,next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        status: "fail",
        error: "Please provide your credentials",
      });
    }

    let user = await prisma.admin.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.findUnique({ where: { email } });
    }

    if (!user) {
      return res.status(401).json({
        status: "fail",
        error: "No user found. Please create an account",
      });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password || "");

    if (!isPasswordValid) {
      return res.status(403).json({
        status: "fail",
        error: "Password is not correct",
      });
    }

    if (user.status?.toLowerCase() !== "active") {
      return res.status(401).json({
        status: "fail",
        error: "Your account is not active yet.",
      });
    }

    const token = generateToken(user);

    const { password: pwd, ...others } = user;

    res.status(200).json({
      status: "success",
      message: "Successfully logged in",
      data: {
        user: others,
        token,
      },
    });
  } catch (error) {
    next(error)
  }
};

// confirmEmail
exports.confirmEmail = async (req, res,next) => {
  try {
    const { token } = req.params;
    const user = await prisma.user.findFirst({ where: { confirmationToken: token } });

    if (!user) {
      return res.status(403).json({
        status: "fail",
        error: "Invalid token",
      });
    }

    const expired = new Date() > new Date(user.confirmationTokenExpires);

    if (expired) {
      return res.status(401).json({
        status: "fail",
        error: "Token expired",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        status: "active",
        confirmationToken: null,
        confirmationTokenExpires: null
      }
    });

    const accessToken = generateToken(updatedUser);

    const { password: pwd, ...others } = updatedUser;

    res.status(200).json({
      status: "success",
      message: "Successfully activated your account.",
      data: {
        user: others,
        token: accessToken,
      },
    });
  } catch (error) {
    next(error)
  }
};

// forgetPassword
exports.forgetPassword = async (req, res,next) => {
  try {
    const { verifyEmail } = req.body;
    const user = await prisma.user.findUnique({ where: { email: verifyEmail } });
    if (!user) {
      return res.status(404).send({
        message: "User Not found with this email!",
      });
    } else {
      const token = tokenForVerify(user);
      const body = {
        from: secret.email_user,
        to: `${verifyEmail}`,
        subject: "Password Reset",
        html: `<h2>Hello ${verifyEmail}</h2>
        <p>A request has been received to change the password for your <strong>Shofy</strong> account </p>

        <p>This link will expire in <strong> 10 minute</strong>.</p>

        <p style="margin-bottom:20px;">Click this link for reset your password</p>

        <a href=${secret.client_url}/forget-password/${token} style="background:#0989FF;color:white;border:1px solid #0989FF; padding: 10px 15px; border-radius: 4px; text-decoration:none;">Reset Password</a>

        <p style="margin-top: 35px;">If you did not initiate this request, please contact us immediately at support@shofy.com</p>

        <p style="margin-bottom:0px;">Thank you</p>
        <strong>Shofy Team</strong>
        `,
      };
      const date = new Date();
      date.setDate(date.getDate() + 1);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          confirmationToken: token,
          confirmationTokenExpires: date
        }
      });
      const message = "Please check your email to reset password!";
      sendEmail(body, res, message);
    }
  } catch (error) {
    next(error)
  }
};

// confirm-forget-password
exports.confirmForgetPassword = async (req, res,next) => {
  try {
    const { token, password } = req.body;
    const user = await prisma.user.findFirst({ where: { confirmationToken: token } });

    if (!user) {
      return res.status(403).json({
        status: "fail",
        error: "Invalid token",
      });
    }

    const expired = new Date() > new Date(user.confirmationTokenExpires);

    if (expired) {
      return res.status(401).json({
        status: "fail",
        error: "Token expired",
      });
    } else {
      const newPassword = bcrypt.hashSync(password);
      
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: newPassword,
          confirmationToken: null,
          confirmationTokenExpires: null
        }
      });

      res.status(200).json({
        status: "success",
        message: "Password reset successfully",
      });
    }
  } catch (error) {
    next(error)
  }
};

// change password
exports.changePassword = async (req, res,next) => {
  try {
    const {email,password,googleSignIn,newPassword} = req.body || {};
    const user = await prisma.user.findUnique({ where: { email: email } });
    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if(googleSignIn){
      const hashedPassword = bcrypt.hashSync(newPassword);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      });
      return res.status(200).json({ message: "Password changed successfully" });
    }
    if(!bcrypt.compareSync(password, user?.password || "")){
      return res.status(401).json({ message: "Incorrect current password" });
    }
    else {
      const hashedPassword = bcrypt.hashSync(newPassword);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      });
      res.status(200).json({ message: "Password changed successfully" });
    }
  } catch (error) {
    next(error)
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, status: true, createdAt: true }
    });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// update a profile
exports.syncCart = async (req, res, next) => {
  try {
    await prisma.user.updateMany({ where: { id: req.params.id }, data: { cart: req.body.cart || [] } });
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

exports.syncWishlist = async (req, res, next) => {
  try {
    await prisma.user.updateMany({ where: { id: req.params.id }, data: { wishlist: req.body.wishlist || [] } });
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res,next) => {
  try {
    const userId = req.params.id
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          address: req.body.address,
          bio: req.body.bio
        }
      });
      
      const token = generateToken(updatedUser);
      res.status(200).json({
        status: "success",
        message: "Successfully updated profile",
        data: {
          user: updatedUser,
          token,
        },
      });
    }
  } catch (error) {
    next(error)
  }
};

// signUpWithProvider
exports.signUpWithProvider = async (req, res,next) => {
  try {
    const decodedUser = jwt.decode(req.params.token);
    const isAdded = await prisma.user.findUnique({ where: { email: decodedUser.email } });
    if (isAdded) {
      const token = generateToken(isAdded);
      res.status(200).send({
        status: "success",
        data: {
          token,
          user: {
            _id: isAdded.id,
            name: isAdded.name,
            email: isAdded.email,
            address: isAdded.address,
            phone: isAdded.phone,
            imageURL: isAdded.imageURL,
            googleSignIn:true,
          },
        },
      });
    } else {
      const signUpUser = await prisma.user.create({
        data: {
          name: decodedUser.name,
          email: decodedUser.email,
          imageURL: decodedUser.picture,
          status: 'active'
        }
      });
      const token = generateToken(signUpUser);
      res.status(200).send({
        status: "success",
        data: {
          token,
          user: {
            _id: signUpUser.id,
            name: signUpUser.name,
            email: signUpUser.email,
            imageURL: signUpUser.imageURL,
            googleSignIn:true,
          }
        },
      });
    }
  } catch (error) {
    next(error)
  }
};

// delete user
exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await prisma.user.delete({
      where: { id: userId }
    });
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};
