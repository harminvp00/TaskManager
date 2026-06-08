
import "dotenv/config";

import connectDB from "./src/config/db.js"
import express from "express";
const app = express();

// establish a connection within the mongodb database 
await connectDB();

// open server to listen requests
app.listen(process.env.PORT,() =>{
    console.log(`Server is running on PORT : ${process.env.PORT}`);
})

// now all api and middleware will defined here 