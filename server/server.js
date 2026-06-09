
import "dotenv/config";
import createHttpError from "http-errors";
import connectDB from "./src/config/db.js"
import express from "express";
const app = express();
import userRoutes from "./src/modules/auth/auth.routes.js"

connectDB();
app.use(express.json());
app.use("/accounts", userRoutes);

app.get("/",(req,res) => {
    const newerr = createHttpError(500,"Internal server eeeor");
    return next(newerr);
})

app.use((err,req,res,next) =>{
    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        message : err.message
    })
});

// open server to listen requests
app.listen(process.env.PORT,() =>{
    console.log(`Server is running on PORT : ${process.env.PORT}`);
})

// now all api and middleware will defined here 