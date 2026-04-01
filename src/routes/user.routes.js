import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload} from '../middlewares/multer.middleware.js'
const router = Router()


router.route('/register').post(upload.fields([ // multiple files ke liye field ka use hua
    {
name:'avatar',    // file ka naam
maxCount:1 // kitni files
    },
    {
name:'coverImage',
maxCount:1
    }
]),registerUser)



export default router