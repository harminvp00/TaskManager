import { Router } from "express";
import User from "./auth.model.js";
const router = Router({mergeParams: true});

router.get("/",async(req,res)=>{
    const newUser = new User({
        username : "Ashish",
        email : "ashish23@gmail.com",
        password : "secret",
    })
    let result = await newUser.save();
    console.log(result);
    res.send("ok");
})

export default router;