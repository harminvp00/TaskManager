import { Router } from "express";
import {
    registerUser,
    verifyUser
} from "./auth.controller.js";

const router = Router();

router.post("/newUser", registerUser);
router.post("/verify-user", verifyUser);

export default router;