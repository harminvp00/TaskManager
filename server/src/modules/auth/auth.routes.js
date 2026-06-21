import { Router } from "express";
import { registerUser, verifyUser, loginUser, logoutUser } from "./auth.controller.js";


const router = Router();
/**
 * /login
 * /forget-password
 * /change-password
 * /reset-password
 * /logout
 * 
 * secure with middlewares
 * - auth middleware -> check token
 * - role middleware -> check role
 */

router.post("/newUser", registerUser);
router.post("/verify-user", verifyUser);
router.post("/login", loginUser)
router.post("/logout", logoutUser)



export default router;
