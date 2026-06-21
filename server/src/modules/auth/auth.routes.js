import { Router } from "express";
import { loginUser, registerUser, verifyUser } from "./auth.controller.js";

const router = Router();

router.post("/newUser", registerUser);
router.post("/verify-user", verifyUser);
router.post('/login', loginUser);

/**
 * /login
 * /logout
 * /forget-password
 * /reset-password
 * /change-password
 */
export default router;
