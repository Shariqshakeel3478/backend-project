import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken"; // token ke liye
import bcrypt from 'bcrypt' // password hash ke liye

const userSchema =new Schema({

    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true // searching me kaam aata hai 
    }, 
     email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
        
    },
     fullname:{
        type:String,
        required:true,
        trim:true,
        index:true
      
    },
     avatar:{
        type:String, //cloudinary
      required:true
    },
    coverImage:{
        type:String // cloudinary,

    },
    watchHistory:[ // watch hostory aik array hoga
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String,
        required:[true,"Password is required"]// custom msg bhi pass kar sakte hain
    },
    refreshToken:{
        type:String

    }

},
{timestamps:true})


userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
       
    this.password =await bcrypt.hash(this.password,10);
    next()
    
})  // arrow function use nahi karna. isme next pass kia hai kiu ke ye aik middleware hai
// pre() aik hook hai jo chalta hai pehle . hame data "save" karne se pehle encryption karni hai is liye pre ka use kia hai 

userSchema.methods.isPasswordCorrect = async function(password){
 return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
  return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullName:this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY}

)
}
userSchema.methods.generateRefreshToken = function(){
 return jwt.sign({
        _id:this._id,
       
    },
    process.env.REFRESH_TOKEN_SECRET,{expiresIn:process.env.REFRESH_TOKEN_EXPIRY}

)

}


export const User = mongoose.model("User",userSchema)