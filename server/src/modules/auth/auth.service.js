"use strict";

// hashing, random string and encryption library
import bcrypt from "bcryptjs";
import crypto from "crypto";

// repository method (odm)
import {
  findByEmail,
  createUser,
  findByIdandUpdate,
  findUserByToken,
} from "./auth.repo.js";

// utils
import { getToken, decodeToken } from "../../utils/token.js";

// common > mail
import verificationMail from "../../common/mail/email.verification.js";
import loginAlert from "../../common/mail/loginAlert.js";
import resetPasswordMail from "../../common/mail/email.resetPass.js";
import "dotenv/config";
import { getResetToken } from "../../utils/resetToken.js";

export const register = async (username, email, password) => {
  const existingUser = await findByEmail(email);

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const user = await createUser({
    username,
    email,
    passwordHash,
    otp,
    otpExpiresAt,
    verify: false,
  });

  console.log(user);

  const token = getToken(user._id, user.email, user.role);

  verificationMail(user.username, user.email, otp);

  return {
    success: true,
    message: "User registered successfully",
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      verify: user.verify,
    },
  };
};

export const verify = async (email, otp) => {
  const user = await findByEmail(email);

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.otp) {
    throw new Error("OTP not available");
  }

  if (user.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  if (new Date() > user.otpExpiresAt) {
    throw new Error("OTP expired");
  }

  await findByIdandUpdate(user._id, {
    verify: true,
    otp: null,
    otpExpiresAt: null,
  });

  return {
    success: true,
    message: "User verified successfully",
  };
};

export const login = async (email, password) => {
  // check data
  if (!email || !password) {
   throw new Error("field are not valid ")
  }
  // find user or verify email
  const user = await findByEmail(email);
  if (!user) {
    return {
      success: false,
      message: "User Not Found, Register User",
    };
  }

  // match pass
  const passwordHash = await bcrypt.compare(password, user.passwordHash);

  if (!passwordHash) {
    return {
      success: false,
      message: "Password Doesn't match",
    };
  }

  // create token
  const token = getToken(user._id, user.email, user.role);

  // send Email acknowledgement
  loginAlert(user.username, user.email, new Date().toLocaleString());

  // return user, token
  return {
    success: true,
    user: user,
    token,
  };
};

export const forgetPassword = async (email) => {
  // check the mail first
  if (!email) {
    return {
      success: false,
      message: "Email is invalid!",
    };
  }

  const user = await findByEmail(email);
  if (!user) {
    return {
      success: false,
      message: "User Not Found, Register User",
    };
  }

  // generate 32 bytes (256 bits) and convert it to hex string
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = getResetToken(token);
  const resetPassLink = `${process.env.CLIENT_URL}/accounts/resetPassword?token=${token}`;

  await findByIdandUpdate(user._id, {
    resetToken: tokenHash,
    resetTokenExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  console.log("pass");
  resetPasswordMail(user?.username, user?.email, resetPassLink);

  return {
    success: true,
    Message: "Token sent to mail",
  };
};

export const resetPassword = async (token, newPassword) => {

  console.log(token, newPassword);
  
  if (!token) {
    return {
      success: false,
      message: "Invald Token!",
    };
  }

  const tokenHash = getResetToken(token);

  const user = await findUserByToken(tokenHash);

  if (!user) {
    throw new Error("Invalid Token!");
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await findByIdandUpdate(user._id, {
    passwordHash: passwordHash,
    resetToken: null,
    resetTokenExpiresAt: null,
    resetPasswordUsed: true,
  });

  return {
    sucess: true,
    message: "password reset successfully!",
  };
};

export const changePassword = async (token, oldPass, newPass) => {

  if(!token){
    throw new Error("invalid token!");
  }

  if(!oldPass || !newPass){
    throw new Error("Passwords are not valid");
  }

  const { id, email } = decodeToken(token);

  const user = await findByEmail(email);

  if(!user){
    throw new Error("No User exists");
  }

  const matchPass = await bcrypt.compare(oldPass, user.passwordHash);

  if(!matchPass){
    throw new Error("old password is incorrect!");
  }

  const passwordHash = await bcrypt.hash(newPass, 10);
  await findByIdandUpdate(user._id, {
    passwordHash
  })

  return {
    success: true,
    message: "Password is Changed!"
  }
};
