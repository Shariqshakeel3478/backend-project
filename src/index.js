import connectDB from "./db/index.js";
import dotenv from 'dotenv'
import { app } from "./app.js";
dotenv.config({
    path:'./env'
})
connectDB()
.then(()=>{

    app.listen(process.env.PORT , ()=>{
        console.log(`server is running on port ${process.env.PORTs}`)
    })
})
.catch((err)=>{
    console.log("DB connection failed",err)
})
