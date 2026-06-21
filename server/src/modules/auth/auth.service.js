import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import send_registration_mail from "../../common/mail/sendOTP.js";
import { findByEmail, createUser, findByIdandUpdate } from "./auth.repo.js";

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

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.roles,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "7d",
    },
  );

  send_registration_mail(user.username, user.email, otp);

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


export const login = async (email, password) =>{

  // check data 
  // find user or verify email 
  // match pass 
  // create token 
  // send Email acknowledgement
  // return user, token
}