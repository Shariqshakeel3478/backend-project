import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken'



const generateAccessAndRefreshToken =async (userId)=>{

   const user = await User.findById(userId)  // user dhoonda
  const accessToken =  user.generateAccessToken() // user ka access token nikala
  const refreshToken =  user.generateRefreshToken() // user ka refresh token nikala
 
  user.refreshToken = refreshToken //db me save kardia refresh token
await user.save({validateBeforeSave:false})

return {accessToken,refreshToken}
}

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
console.log("Request body on register user",req.body)

// validation check - empty data

if(
[fullName,email,username,password].some((field)=>field.trim()==="") // some() har field pe kaam karta hai
){
   throw new ApiError(400,"All fields are required")
}


// check if user exist

const existedUser =await User.findOne({ // findone => sabse pehla 
   $or:[{username},{email}] // username ya email match ho jae to 
})

if(existedUser){
   throw new ApiError(409,"User with this email or username Already Exist")
}

const avatarFilePath = req.files?.avatar[0]?.path;
// const coverImageFilePath = req.files?.coverImage[0]?.path;


let coverImageFilePath;

if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
   coverImageFilePath = req.files.coverImage[0].path
}


if(!avatarFilePath){
throw new ApiError(400,"Avatar is required")
}


const avatar = await uploadOnCloudinary(avatarFilePath)


const coverImage = await uploadOnCloudinary(coverImageFilePath)

if(!avatar){
   throw new ApiError(400,"Avatar not uploaded to cloudinary")
}

// upload user details on mongodb
 const user = await User.create({
   fullName,
   avatar:avatar.url,
   coverImage:coverImage?.url || "",
   email,
   password,
   username:username.toLowerCase()
 })

const createdUser =await User.findById(user._id).select(
   "-password -refreshToken"
)

if(!createdUser){
   throw new ApiError(500,"Something went wrong while craeting user")
}

return res.status(201).json(
   new ApiResponse(200,createdUser,"User Registered Successfully")
)

})

const loginUser = asyncHandler(async(req,res)=>{

   // user se username, email aur password
   // email aur password me se koi bhi aik galat hai to error dege
   // agar email ya username match kar jae to token user login ho jaega aur token generate kardege
   // tokens ko frontend pe bhejege cookies se


   const {username,email,password} = req.body
   console.log("Request Body on login user",req.body)
   if(!username && !email){
      throw new ApiError(400,"username or email is required")
   }

   if (!password) {
   throw new ApiError(400, "Password is required");
}

  const user =  await User.findOne({
      $or:[{username},{email}]
   })

   if(!user){
      throw new ApiError(404,"User not exist")
   }

  const isPasswordValid = await user.isPasswordCorrect(password)

   if(!isPasswordValid){
      throw new ApiError(401,"Password Incorrect")
   }

  

   const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)

   const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
   console.log(loggedInUser)

   const options = {  // cookies ke sath ye bhi bhejna zaroori hai
      httpOnly:true,
      secure:true
   }

   return res.status(200).cookie("accessToken",accessToken,options).
   cookie("refreshToken",refreshToken,options).json(
      new ApiResponse(200,{
         user:loggedInUser,accessToken,refreshToken
      },"User Loggedin Successfully")
   )

})

const logoutUser = asyncHandler(async(req,res)=>{
await User.findByIdAndUpdate(req.user._id,{
   $set:{
      refreshToken:undefined
   }
})

if(!req.user){
   throw new ApiError(400,"Unauthorized",error?.message)
}

const options = {  // cookies ke sath ye bhi bhejna zaroori hai
      httpOnly:true,
      secure:true
   }


return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(
   new ApiResponse(200,"user logged out")
)
})


const refreshAccessToken = asyncHandler(async(req,res)=>{


   const incomingRefreshToken = req.cookies.refreshToken;

   if(!incomingRefreshToken){
      throw new ApiError(400,"Unauthorized")
   }

  try {
   const decodedToken =await jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)

  const user = await User.findById(decodedToken._id)

  if(!user){
   throw new ApiError(400,"Invalid Refresh Token")
  }

  if(incomingRefreshToken !== user.refreshToken){
   throw new ApiError(400,"Refresh Token expired or used")
  }

  const {newAccessToken,newRefreshToken} =await generateAccessAndRefreshToken(user._id)

  const options ={
   httpOnly:"true",
   secure:"true"
  }
  res.status(200).cookies("Access Token",newAccessToken,options).cookies("Refresh Token",newRefreshToken,options).json(
   new ApiResponse(200,{
      newAccessToken,newRefreshToken
   })
  )
  } catch (error) {
   throw new ApiError(400,"Invalid Refresh Token")
  }


})

export {registerUser,loginUser,logoutUser,refreshAccessToken}