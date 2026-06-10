import mongoose from "mongoose"
import "dotenv/config";

const URL = process.env.MONGO_CLOUD;

const connectDB = async() => {
    try{
        if(!URL){
            throw new Error("URL is not defined");
        }
        await mongoose.connect(URL);
        console.log("Connected to database");
    }
    catch(err){
        console.log("Not able to connect DB : " + err);
    }
}

export default connectDB;