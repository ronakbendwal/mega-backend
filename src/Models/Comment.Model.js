import mongoose,{ model, Schema } from "mongoose"

import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const CommentSchema=new Schema({

  owner:{
    type:mongoose.Types.ObjectId,
    ref:"UserModel",
  },

  comment:{
    type:String,
    required:true,
  },

  video:{
    type:mongoose.Types.ObjectId,
    ref:"VideModel"
  }
},{timestamps})

CommentSchema.plugin(mongooseAggregatePaginate)

export const CommentModel=model("CommentModel",CommentSchema)