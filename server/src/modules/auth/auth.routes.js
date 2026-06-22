import { Router } from "express";
import { changePassword, forgetPassword, loginUser, registerUser, resetPassword, verifyUser } from "./auth.controller.js";

const router = Router();

router.post("/newUser", registerUser);
router.patch("/verify-user", verifyUser);
router.post('/login', loginUser);
router.post('/forgetPassword', forgetPassword);
router.patch('/resetPassword', resetPassword);
router.patch('/changePassword', changePassword)

export default router;
