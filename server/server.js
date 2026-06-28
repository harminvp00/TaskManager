import "dotenv/config";
import dns from "dns";
import connectDB from "./src/config/db.js"
import express from "express";
const app = express();
import userRoutes from "./src/modules/auth/auth.routes.js"
import globalHandler from "./src/middlewares/golbalErrorHandler.js";
import createHttpError from "http-errors";
import cors from 'cors';
import { auth_api_limit } from './src/middlewares/rate.limit.js';

// API payload validations 
app.use(express.json({ limit: '500kb' }));
app.use(express.urlencoded({extended: true, limit: '100kb'}));

// cors - only this origin can request to the server
app.use(cors({
    origin: ["http://localhost:5173/"],
    credentials: true,    
}));

dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
])

connectDB();

app.use('/accounts', auth_api_limit);
app.use("/accounts", userRoutes);

app.use(globalHandler);

// open server to listen requests
app.listen(process.env.PORT,() =>{
    console.log(`Server is running on PORT : ${process.env.PORT}`);
})

// now all api and middleware will defined here 