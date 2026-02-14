import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

 cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.CLOUD_API_KEY, 
        api_secret: process.env.CLOUD_API_SECRET 
    });


   const uploadOnCloudinary = async(localfilepath)=>{
try {
    

    if(!localfilepath) return null
 const response = await cloudinary.uploader.upload(localfilepath,{
        resource_type:"auto" // konsi file hai eg image, video
    })
// file has been uploaded successfully
console.log("file is uploaded on cloudinary",response.url)
return response
}
catch (error) {
 fs.unlinkSync(localfilepath) //remove the locally saved temporary file
 return null   
}
   } 
    

   export {uploadOnCloudinary}