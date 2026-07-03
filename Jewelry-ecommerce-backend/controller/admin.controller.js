const bcrypt = require("bcryptjs");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);
const jwt = require('jsonwebtoken');
const { tokenForVerify } = require("../config/auth");
const prisma = require('../prisma/client');
const { generateToken } = require("../utils/token");
const { sendEmail } = require("../config/email");
const { secret } = require("../config/secret");

// register
const registerAdmin = async (req, res,next) => {
  try {
    const isAdded = await prisma.admin.findUnique({ where: { email: req.body.email } });
    if (isAdded) {
      return res.status(403).send({
        message: "This Email already Added!",
      });
    } else {
      const staff = await prisma.admin.create({
        data: {
          name: req.body.name,
          email: req.body.email,
          role: req.body.role,
          password: bcrypt.hashSync(req.body.password),
        }
      });
      const token = generateToken(staff);
      res.status(200).send({
        token,
        _id: staff.id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        joiningData: Date.now(),
      });
    }
  } catch (err) {
    next(err)
  }
};
// login admin
const loginAdmin = async (req, res,next) => {
  try {
    const admin = await prisma.admin.findUnique({ where: { email: req.body.email } });
    if (admin && bcrypt.compareSync(req.body.password, admin.password)) {
      const token = generateToken(admin);
      res.send({
        token,
        _id: admin.id,
        name: admin.name,
        phone: admin.phone,
        email: admin.email,
        image: admin.image,
        role: admin.role,
      });
    } else {
      res.status(401).send({
        message: "Invalid Email or password!",
      });
    }
  } catch (err) {
    next(err)
  }
};
// forget password
const forgetPassword = async (req, res,next) => {
  try {
    const { email } = req.body;
    const admin = await prisma.admin.findUnique({ where: { email: email } });
    if (!admin) {
      return res.status(404).send({
        message: "Admin Not found with this email!",
      });
    } else {
      const token = tokenForVerify(admin);
      const body = {
        from: secret.email_user,
        to: `${email}`,
        subject: "Password Reset",
        html: `<h2>Hello ${email}</h2>
        <p>A request has been received to change the password for your <strong>Shofy</strong> account </p>

        <p>This link will expire in <strong> 10 minute</strong>.</p>

        <p style="margin-bottom:20px;">Click this link for reset your password</p>

        <a href=${secret.admin_url}/forget-password/${token} style="background:#0989FF;color:white;border:1px solid #0989FF; padding: 10px 15px; border-radius: 4px; text-decoration:none;">Reset Password</a>

        <p style="margin-top: 35px;">If you did not initiate this request, please contact us immediately at support@shofy.com</p>

        <p style="margin-bottom:0px;">Thank you</p>
        <strong>Shofy Team</strong>
        `,
      };
      const date = new Date();
      date.setDate(date.getDate() + 1);
      
      await prisma.admin.update({
        where: { id: admin.id },
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
const confirmAdminForgetPass = async (req, res,next) => {
  try {
    const { token, password } = req.body;
    // Find first where token matches
    const admin = await prisma.admin.findFirst({ where: { confirmationToken: token } });

    if (!admin) {
      return res.status(403).json({
        status: "fail",
        message: "Invalid token",
      });
    }

    const expired = new Date() > new Date(admin.confirmationTokenExpires);

    if (expired) {
      return res.status(401).json({
        status: "fail",
        message: "Token expired",
      });
    } else {
      const newPassword = bcrypt.hashSync(password);
      await prisma.admin.update({
        where: { id: admin.id },
        data: {
          password: newPassword,
          confirmationToken: null,
          confirmationTokenExpires: null
        }
      });

      res.status(200).json({
        message: "Password reset successfully",
      });
    }
  } catch (error) {
    next(error)
  }
};

// change password
const changePassword = async (req,res,next) => {
  try {
    const {email,oldPass,newPass} = req.body || {};
    const admin = await prisma.admin.findUnique({ where: { email: email } });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    if(!bcrypt.compareSync(oldPass, admin.password)){
      return res.status(401).json({ message: "Incorrect current password" });
    }
    else {
      const hashedPassword = bcrypt.hashSync(newPass);
      await prisma.admin.update({
        where: { email: email },
        data: { password: hashedPassword }
      });
      res.status(200).json({ message: "Password changed successfully" });
    }
  } catch (error) {
    next(error)
  }
}
// reset Password
const resetPassword = async (req, res) => {
  const token = req.body.token;
  const { email } = jwt.decode(token);
  const staff = await prisma.admin.findUnique({ where: { email: email } });

  if (token) {
    jwt.verify(token,secret.jwt_secret_for_verify, async (err, decoded) => {
      if (err) {
        return res.status(500).send({
          message: "Token expired, please try again!",
        });
      } else {
        await prisma.admin.update({
          where: { id: staff.id },
          data: { password: bcrypt.hashSync(req.body.newPassword) }
        });
        res.send({
          message: "Your password change successful, you can login now!",
        });
      }
    });
  }
};
// add staff
const addStaff = async (req, res,next) => {
  try {
    const isAdded = await prisma.admin.findUnique({ where: { email: req.body.email } });
    if (isAdded) {
      return res.status(500).send({
        message: "This Email already Added!",
      });
    } else {
      await prisma.admin.create({
        data: {
          name:req.body.name,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password),
          phone: req.body.phone,
          joiningData: req.body.joiningDate ? new Date(req.body.joiningDate) : undefined,
          role: req.body.role,
          image: req.body.image,
        }
      });
      res.status(200).send({
        message: "Staff Added Successfully!",
      });
    }
  } catch (err) {
    next(err)
  }
};
// get all staff
const getAllStaff = async (req, res,next) => {
  try {
    const admins = await prisma.admin.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({
      status:true,
      message:'Staff get successfully',
      data:admins
    });
  } catch (err) {
    next(err)
  }
};
// getStaffById
const getStaffById = async (req, res,next) => {
  try {
    const admin = await prisma.admin.findUnique({ where: { id: req.params.id } });
    res.send(admin);
  } catch (err) {
    next(err)
  }
};
// updateStaff
const updateStaff = async (req, res) => {
  try {
    const admin = await prisma.admin.findUnique({ where: { id: req.params.id } });
    if (admin) {
      const password = req.body.password !== undefined
        ? bcrypt.hashSync(req.body.password)
        : admin.password;
        
      const updatedAdmin = await prisma.admin.update({
        where: { id: req.params.id },
        data: {
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          role: req.body.role,
          joiningData: req.body.joiningDate ? new Date(req.body.joiningDate) : admin.joiningData,
          image: req.body.image,
          password: password,
        }
      });
      const token = generateToken(updatedAdmin);
      res.send({
        token,
        _id: updatedAdmin.id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        role: updatedAdmin.role,
        image: updatedAdmin.image,
        phone: updatedAdmin.phone,
      });
    } else {
      res.status(404).send({
        message: "This Staff not found!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
// deleteStaff
const deleteStaff = async (req, res,next) => {
  try {
    await prisma.admin.delete({ where: { id: req.params.id } });
    res.status(200).json({
      message:'Admin Deleted Successfully',
    });
  } catch (err) {
    next(err)
  }
};

const updatedStatus = async (req, res) => {
  try {
    const newStatus = req.body.status;

    await prisma.admin.update({
      where: { id: req.params.id },
      data: { status: newStatus }
    });
    res.send({
      message: `Store ${newStatus} Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  forgetPassword,
  resetPassword,
  addStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  updatedStatus,
  changePassword,
  confirmAdminForgetPass,
};
