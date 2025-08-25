import mongoose,{ Schema,model } from "mongoose";

const TweetSchema=new Schema({
  content:{
    type:String,
    required:true,
  },
  
  owner:{
    type:mongoose.Types.ObjectId,
    ref:"UserModel"
  }
},{timestamps})

export const TweetModel=model("TweetModel",TweetSchema)