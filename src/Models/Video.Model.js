import mongoose,{Schema,model} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const VideoSchema=new Schema({
  videoFile:{
    type:String,//from cloudnary url
    required:[true,'video required'],
  },

  thumbnail:{
    type:String,//from cloudnary url
    required:true,
  },

  title:{
    type:String,
    required:true,
  },

  description:{
    type:String,
    required:true
  },

  duration:{
    type:Number,
    required:true,
  },

  views:{
    type:Number,
    default:0,
  },

  isPublished:{
    type:Boolean,
    default:true,
  },

  owner:{
    type:mongoose.Types.ObjectId,
    ref:"UserModel"
  }
},{timestamps});

VideoSchema.plugin(mongooseAggregatePaginate)//here we just aad opugin for letter use


export const VideModel=mongoose.model("VideoModel",VideoSchema);