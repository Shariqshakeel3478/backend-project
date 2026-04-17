import dotenv from 'dotenv'
dotenv.config({
    path:'./env'
})
import connectDB from "./db/index.js";
import { app } from "./app.js";


const port = process.env.PORT || 8000

connectDB()
.then(()=>{

    app.listen(process.env.PORT , ()=>{
        console.log(`server is running on port ${port}`)
    })
})
.catch((err)=>{
    console.log("DB connection failed",err)
})
