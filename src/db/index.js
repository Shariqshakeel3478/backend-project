import mongoose from "mongoose";
//db name imported from constants file
import { DB_NAME } from "../constants.js";


// database setup 
const connectDB = async()=>{
    try {
       const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       console.log(`MongoDB Connected ${connectionInstance.connection.host}`)  // isko bhi console.log karke parhna hai
    } catch (error) {
        console.log("Mongodb connection error",error);
        process.exit(1) // isko parhna hai
    } 
}



export default connectDB