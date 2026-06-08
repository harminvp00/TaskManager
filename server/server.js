
import "dotenv/config";

import connectDB from "./src/config/db.js"
import express from "express";
const app = express();
import userRoutes from "./src/modules/auth/auth.routes.js"

connectDB();
app.use(express.json());
app.use("/accounts", userRoutes);

// open server to listen requests
app.listen(process.env.PORT,() =>{
    console.log(`Server is running on PORT : ${process.env.PORT}`);
})

// now all api and middleware will defined here 