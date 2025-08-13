import mongoose from "mongoose";
import { jwt} from "jsonwebtoken";
import bcrypt from "bcrypt";
const UserSchema=new mongoose.Schema({
  username:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    index:true,
    trim:true,
  },

  email:{
    type:String,
    required:true,
    trim:true,
    unique:true,
    lowercase:true
  },

  passward:{
    type:String,
    required:[true,"passward is required"],
  },

  fullname:{
    type:String,
    required:true,
    trim:true,
    index:true,
  },

  avtar:{
    type:String,//cloudnary url
    required:true,
  },

  coverimage:{
    type:String,
    //cloudnary url
  },

  watchHistory:[{
    type:mongoose.Types.ObjectId,
    ref:"VideoModel"
  }],

  refreshToken:{
    type:String
  }

},{timestamps:true});//all data field

UserSchema.pre("save",async function (next) {//we use next cuz here we use middleware
//process with data base take time so we use async

  if(!this.isModified("passward")) return next();//if passward is not change then we dont have need to again encrypt our passward

  this.passward=await bcrypt.hash(this.passward,10);
  next();
});//hook for passward encryption

UserSchema.methods.isPasswardCorrect=async function (passward){

return await bcrypt.compare(passward,this.passward);//comparasion logic 

}//custom method for compare passward with encrypt passward

UserSchema.methods.generateAccessToken=function (){
  return jwt.sign(
    {
      _id:this._id,
      email:this.email,
      username:this.username,
      fullname:this.fullname
    },//it is the payload that comes from the database we use in generating token

    process.env.ACCESS_TOKEN_SECRETKEY,//it is secret of the token

    {
      expiresin:process.env.ACCESS_TOKEN_EXPIREY
    },//the expirey always write in the object
  )
}//custom method for generate access token

UserSchema.methods.generateRefreshToken=function (){
  return jwt.sign(
    {
      _id:this._id,

      //in refresh token we have less info as compared to access token cuz it refresh again and again

    },//it is the payload that comes from the database we use in generating token

    process.env.ACCESS_TOKEN_SECRETKEY,//it is secret of the token

    {
      expiresin:process.env.ACCESS_TOKEN_EXPIREY
    },//the expirey always write in the object
  )
}//custom method for generate refresh toke 

export const UserModel= mongoose.model("UserModel",UserSchema);