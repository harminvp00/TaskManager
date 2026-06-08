import "dotenv/config";

import connectDB from "./src/config/db.js"
import express from "express";
const app = express();

connectDB();

app.listen(process.env.PORT,() =>{
    console.log(`Server is running on PORT : ${process.env.PORT}`);
})