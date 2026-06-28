
import { Router } from "express";
import { 
    gitCallback,
    gitLoginUser,
} from "./git.auth.controller.js";
const router = Router();

router.get("/login", gitLoginUser);
router.get('/callback', gitCallback)

export default router;
