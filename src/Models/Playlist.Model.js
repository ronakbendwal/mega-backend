import mongoose,{Schema,model} from "mongoose";

const PlayListSchema=new Schema({
  videos:[
    {
      type:mongoose.Types.ObjectId,
      ref:"VideoModel"
    }
  ],
  owner:{
    type:mongoose.Types.ObjectId,
    ref:"UserModel"
  },
  name:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  }
},{timestamps:true})

export const PlayListModel=model("PlayListModel",PlayListSchema)