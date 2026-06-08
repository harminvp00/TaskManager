import "dotenv/config";

import connectDB from "./src/config/db.js"
import express from "express";
const app = express();
import userRoutes from "./src/modules/auth/auth.routes.js";

app.use("/",userRoutes);
connectDB();

app.listen(process.env.PORT,() =>{
    console.log(`Server is running on PORT : ${process.env.PORT}`);
})