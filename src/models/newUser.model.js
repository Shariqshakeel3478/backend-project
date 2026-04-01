import mongoose,{Schema} from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const newUser = new Schema({

    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    email:{
        type:String,
        reuqired:true,
        unique:true,
        trim:true,
        lowercase:true

    },
    password:{
        type:password,
        required:[true,"Password is required"]
    }

},{timestamps:true})




newUser.pre("save",async function(next){

    if(!this.isModified('password')) return next()
this.password = await bcrypt.hash(this.password,10);
next()

})

newUser.methods.isPasswordCorrect = async function(password){

  return await bcrypt.compare(this.password,password)

}


newUser.methods.generateAccessToken = async function () {
 return jwt.sign({
        _id:this._id,
        username:this.username,
        email:this.email
    },process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY})
}






export const NewUserSchema = mongoose.model("NewUser",newUser)