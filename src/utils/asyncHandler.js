
// jis bhi function me async/await ka use hoga uske liye hamne aik utility banadi

// promise method
const asyncHandler = (requestHandler)=>{

    (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
    }
}

export {asyncHandler}


// try/catch method

// const asyncHandler = (fn)=> async(req,res,next)=>{
//     try{

// await fn(req,res,next)

//     }catch(err){

//         res.status(err.code || 500).json({
//             success:false,
//             message:err.message
//         })
//     }
// }
