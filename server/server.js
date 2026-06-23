import "dotenv/config";
import dns from "dns";
import connectDB from "./src/config/db.js"
import express from "express";
const app = express();
import userRoutes from "./src/modules/auth/auth.routes.js"
import globalHandler from "./src/middlewares/golbalErrorHandler.js";
import createHttpError from "http-errors";

dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
])

connectDB();
app.use(express.json());
app.use("/accounts", userRoutes);

app.use(globalHandler);

// open server to listen requests
app.listen(process.env.PORT,() =>{
    console.log(`Server is running on PORT : ${process.env.PORT}`);
})

// now all api and middleware will defined here 