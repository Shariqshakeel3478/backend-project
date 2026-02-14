import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:'16kb'})) // express json ko accept kare aur hamne aane wale data ki limit set kardi hai
app.use(express.urlencoded({extended:true,limit:'16kb'})) // html form se jo data aata hai wo url form me hota hai usko samjhne ke liye ye hai aur agar data me arrays aur objects ka use hua ho to usko samjhne ke liye extended lagaya hai
app.use(express.static("public")) //"public" folder ke andar jo files hain, unko direct browser me access karne do.
app.use(cookieParser()) // cookies ko read karne ke liye
export {app}