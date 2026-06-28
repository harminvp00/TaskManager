"use strict";

import sessionModel from "../session/session.model.js";

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
import {
  getAccessToken,
  getRefreshToken,
  decodeAccessToken,
  decodeRefreshToken,
  hashToken,
} from "../../utils/tokens/token.js";

// utils -> mails
import verificationMail from "../../utils/mail/email.verification.js";
import loginAlert from "../../utils/mail/email.loginAlert.js";
import informPasswordReset from "../../utils/mail/inform.passwordReset.js";
import accountVerifiedMail from "../../utils/mail/email.verificationAlert.js";
import resetPasswordMail from "../../utils/mail/email.resetPass.js";

/**
 * it registers a new user by checking if the email is already registered, hashing the password, generating an OTP for email verification, and sending a verification email.
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @returns {object} success message and user data
 */

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
  });

  verificationMail(user.username, user.email, otp);

  return {
    success: true,
    message: "User registered successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      verify: user.verify,
    },
  };
};

/**
 *  it verifies the user by checking the provided OTP against the stored OTP and its expiration time.
 * If the verification is successful, it updates the user's verification status and sends a confirmation email.
 * @param {string} email the email of the user to verify
 * @param {string} otp the otp sent to the user email
 * @returns
 */
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

  const updatedUser = await updateUserById(user._id, {
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
    userId: user._id,
    verify: updatedUser.verify,
    message: "User verified successfully",
  };
};

/**
 * it sends a verification email to the user with a new OTP if the user is not already verified and if an OTP has not been sent recently.
 * a new OTP is generated, stored in the user's record, and sent via email.
 * @param {string} email the email of the user to send the verification email
 * @returns returns an object containing a success message indicating that the verification code has been sent to the registered email.
 */
export const verifyEmail = async (email) => {
  const user = await findByEmail(email);

  if (!user) {
    throw new Error("user not found");
  }

  if (user.verify) {
    throw new Error("user already verified");
  }

  if (user.otp && new Date() < user.otpExpiresAt) {
    throw new Error("OTP already sent, please check your email");
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

/**
 * it handles the login process by verifying the user's credentials, checking if the user is verified, generating a refresh token and access token, creating a session in the database, and sending a login alert email.
 * @param {string} email 
 * @param {string} password 
 * @param {string} userAgent the user agent string from the request headers, which provides information about the user's browser and operating system. 
 * @param {string} ipAddress the IP address of the user making the request, which can be used for security and logging purposes.
 * @returns it returns an object containing the success status, access token, refresh token, and user information (id, username, email, and verification status).
 */
export const login = async (email, password, userAgent, ipAddress) => {
  // find user or verify email
  const user = await findByEmail(email);
  if (!user) {
    throw new Error("Incorrect Credentials");
  }
  
  // match pass
  const passwordHash = await bcrypt.compare(password, user.passwordHash);
  if (!passwordHash) {
    throw new Error("Incorrect Credentials");
  }

  // check if user is verified on base of email verification
  if (!user.verify) {
    throw new Error("verify email first!");
  }

  // generate refresh token and create session in database
  const refreshToken = getRefreshToken(user._id, user.email, user.role);
  const hashedRefreshToken = await hashToken(refreshToken);

  const session = await sessionModel.create({
    userId: user._id,
    hashedRefreshToken,
    userAgent,
    ipAddress,
  });

  // generate access token
  const accessToken = getAccessToken(
    user._id,
    user.email,
    user.role,
    session._id,
  );

  await loginAlert(user.username, user.email, new Date().toLocaleString());

  return {
    success: true,
    accessToken,
    refreshToken,
    id: user._id,
    username: user.username,
    email: user.email,
    verify: user.verify,
  };
};

//remaining
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
