"use strict";

// hashing, random string and encryption library
import bcrypt from "bcryptjs";
import crypto from "crypto";

// repository method (odm)
import {
  findByEmail,
  createUser,
  updateUserById,
  findUserByToken,
} from "./auth.repo.js";

// utils
import { getToken } from "../../utils/tokens/token.js";

// utils -> mails 
import verificationMail from "../../utils/mail/email.verification.js";
import loginAlert from "../../utils/mail/email.loginAlert.js";
import informPasswordReset from "../../utils/mail/inform.passwordReset.js";
import accountVerifiedMail from "../../utils/mail/email.verificationAlert.js";
import resetPasswordMail from "../../utils/mail/email.resetPass.js"; 


export const register = async (username, email, password) => {
  const existingUser = await findByEmail(email);

  if (existingUser) {
    if (!existingUser.verify) {
      throw new Error("verify email first!");
    }
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
    throw new Error("user not found");
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

  await updateUserById(user._id, {
    verify: true,
    otp: null,
    otpExpiresAt: null,
  });

  await accountVerifiedMail(
    user.username,
    user.email,
    new Date().toLocaleString(),
  );

  return {
    success: true,
    message: "User verified successfully",
  };
};

export const verifyEamil = async (email) => {
  const user = await findByEmail(email);

  if (!user) {
    throw new Error("user not found");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await updateUserById(user._id, {
    otp,
    otpExpiresAt,
  });

  await verificationMail(user.username, user.email, otp);

  return {
    success: true,
    message: "verification code is send to the register email",
  };
};

export const login = async (email, password) => {
  // find user or verify email
  const user = await findByEmail(email);
  if (!user) {
    throw new Error("Incorrect Credentials");
  }

  if (!user.verify) {
    throw new Error("verify email first!");
  }

  // match pass
  const passwordHash = await bcrypt.compare(password, user.passwordHash);

  if (!passwordHash) {
    throw new Error("Wrong Credential");
  }

  const token = getToken(user._id, user.email, user.role);
  await loginAlert(user.username, user.email, new Date().toLocaleString());

  return {
    success: true,
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      verify: user.verify,
    },
  };
};

export const forget = async (email) => {
  const user = await findByEmail(email);
  if (!user) {
    throw new Error("no user exist");
  }

  // generate 32 bytes (256 bits) and convert it to hex string
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = getResetToken(token);

  await updateUserById(user._id, {
    resetToken: tokenHash,
    resetTokenExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  await resetPasswordMail(user?.username, user?.email, token);

  return {
    success: true,
    message: "Token sent to mail",
  };
};

export const reset = async (token, newPassword) => {
  const tokenHash = getResetToken(token);

  const user = await findUserByToken(tokenHash);

  if (!user) {
    throw new Error("Invalid Token ");
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await updateUserById(user._id, {
    passwordHash: passwordHash,
    resetToken: null,
    resetTokenExpiresAt: null,
    resetTokenUsed: true,
  });

  await informPasswordReset(
    user.username,
    user.email,
    new Date().toLocaleString(),
  );

  return {
    success: true,
    message: "reset password successfully!",
  };
};

export const change = async (email, oldPass, newPass) => {
  const user = await findByEmail(email);

  if (!user) {
    throw new Error("No User exists");
  }

  const matchPass = await bcrypt.compare(oldPass, user.passwordHash);

  if (!matchPass) {
    throw new Error("old password is incorrect!");
  }

  const passwordHash = await bcrypt.hash(newPass, 10);
  await updateUserById(user._id, {
    passwordHash,
  });

  return {
    success: true,
    message: "Password is Changed!",
  };
};

export const logout = async () => {
  // insert token in blacklist
};
