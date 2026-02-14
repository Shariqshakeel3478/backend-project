// error handling ke liye utility bana rahe hain.
// Node js hame aik Error class deta hai 
// us error class se kuch properties utha ke ham apni class bana rahe hain

class ApiError extends Error{

    constructor(
        statusCode,
        message = "Something Went Wrong", // ye abhi default hai baad me override ho jaega
        errors=[],
        stack=""
    ){
 super(message) // jisko override karna hota hai uske liye super() use hota hai
 this.statusCode = statusCode,
 this.data = null,
 this.message = message,
 this.success = false,
 this.errors = errors

 if(stack){
    this.stack = stack
 }
 else{
    Error.captureStackTrace(this,this.constructor) // captureStackTrace me is object ka reference pass kardia taake error pakarne me asani hp
    // captureStackTrace ko parhna hai 
 }
 
    }

}

export {ApiError}