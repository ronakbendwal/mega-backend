import mongoose,{Schema,model} from "mongoose";

const LikeSchema=new Schema({
  likedBy:{
    type:mongoose.Types.ObjectId,
    ref:"UserModel"
  },
  video:{
    type:mongoose.Types.ObjectId,
    ref:"VideoModel"
  },
  comment:{
    type:mongoose.Types.ObjectId,
    ref:"CommentModel"
  },
  tweet:{
    type:mongoose.Types.ObjectId,
    ref:"TweetModel"
  }
},{timestamps:true})

export const LikeModel=model("LikeModel",LikeSchema)