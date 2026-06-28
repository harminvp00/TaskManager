import { Router } from "express";
import {
  changePassword,
  forgetPassword,
  loginUser,
  registerUser,
  resetPassword,
  verifyUser,
  verifyEmail,
  logoutUser
} from "./auth.controller.js";
import authenticateToken from "../../middlewares/authenticateToken.js";
const router = Router();

/**
 * @route POST /accounts/newUser
 * @desc Register a new user
 * @access public
 */
router.post("/newUser", registerUser);

/**
 * @route PATCH /accounts/verify-user
 * @desc Verify a user with OTP
 * @access public
 */
router.patch("/verify-user", verifyUser);

/**
 * @route POST /accounts/verifyEmail
 * @desc Send a verification email with otp to the user
 * @access public
 */
router.post("/verify-email", verifyEmail);


router.post("/login", loginUser);
router.post("/forgetPassword", forgetPassword);
router.patch("/resetPassword", resetPassword);
router.patch("/changePassword", authenticateToken, changePassword);
router.post("/logout", logoutUser)

export default router;
