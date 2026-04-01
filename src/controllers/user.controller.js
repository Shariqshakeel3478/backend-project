import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async(req,res)=>{
   // user se data lenge
   //validation => data empty or correct email format
   // check if user already exist through username or email
   // check for image,avatar
   //upload them to cloudinary,avatar
   //create user object , mongodb me object me data save hota hai
   //remove password and refresh token from response
   //check for user creation
   // if user created,return response


   // getting user data
const {fullName,email,username,password} = req.body

// validation check - empty data

if(
[fullName,email,username,password].some((field)=>field.trim()==="") // some() har field pe kaam karta hai
){
   throw new ApiError(400,"All fields are required")
}


// check if user exist

const existedUser = User.findOne({ // findone => sabse pehla 
   $or:[{username},{email}] // username ya email match ho jae to 
})

if(existedUser){
   throw new ApiError(409,"User with this email or username Already Exist")
}

const avatarFilePath = req.files?.avatar[0]?.path;
const coverImageFilePath = req.files?.coverImage[0]?.path;

if(!avatarFilePath){
throw new ApiError(400,"Avatar is required")
}

const avatar = await uploadOnCloudinary(avatarFilePath)
const coverImage = await uploadOnCloudinary(coverImageFilePath)

if(!avatar){
   throw new ApiError(400,"Avatar no uploaded")
}

// upload user details on mongodb
 const user = await username.create({
   fullName,
   avatar:avatar.url,
   coverImage:coverImage?.url || "",
   email,
   password,
   username:username.toLowerCase()
 })

const createdUser = User.findById(user._id).select(
   "-password -refreshToken"
)

if(!createdUser){
   throw new ApiError(500,"Something went wrong while craeting user")
}

return res.status(201).json(
   new ApiResponse(200,createdUser,"User Registered Successfully")
)

})


export {registerUser}