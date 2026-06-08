
import { Router } from "express";
import {
    registerUser,
    verifyUser
} from "./auth.controller.js";

// router.get("/",async(req,res)=>{
//     const newUser = new User({
//         username : "Ashish",
//         email : "ashish23@gmail.com",
//         password : "secret",
//     })
//     let result = await newUser.save();
//     console.log(result);
//     res.send("ok");
// })

const router = Router();

router.post("/newUser", registerUser);
router.post("/verify-user", verifyUser);

export default router;