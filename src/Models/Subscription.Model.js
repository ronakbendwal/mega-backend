import mongoose from "mongoose";
import express,{ Schema,model } from "mongoose";

const SubscriptionSchema=new Schema({
  subscriber:{
    type:mongoose.Types.ObjectId,//one who is subscribing is here 
    ref:"UserModel",
  },
  channel:{
    type:mongoose.Types.ObjectId,//one to whome subscriber is subscribing
    ref:"UserModel"
  }
},{timestamps:true})

export const Subscription=model("Subscription",SubscriptionSchema)