import { Router } from "express";
import {
  changePassword,
  forgetPassword,
  loginUser,
  registerUser,
  resetPassword,
  verifyUser,
  verifyEamil,
  logoutUser
} from "./auth.controller.js";
import authenticateToken from "../../middlewares/authenticateToken.js";
const router = Router();

router.post("/newUser", registerUser);
router.patch("/verify-user", verifyUser);
router.post("/verifyEmail", verifyEamil);
router.post("/login", loginUser);
router.post("/forgetPassword", forgetPassword);
router.patch("/resetPassword", resetPassword);
router.patch("/changePassword", authenticateToken, changePassword);
router.post("/logout", logoutUser)

export default router;
