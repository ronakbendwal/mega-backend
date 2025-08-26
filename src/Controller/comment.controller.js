import { asyncHandler } from "../Utils/asyncHandler";
import { ApiError } from "../Utils/apiError";
import { ApiResponse } from "../Utils/apiResponse";
import { UserModel } from "../Models/User.Model";
import { CommentModel } from "../Models/Comment.Model";


const addComment=asyncHandler(async(req,res)=>{
  //first get the id of the video in which we want to add comment
  //get the content from the body
  //check comment or not if not then show error else go ahed
  const user=await UserModel.findById(req.user?._id)

  if(!user){
    throw new ApiError(404,"User Not Found")
  }

  const videoId=req.params
  
  if(!videoId){
    throw new ApiError(401,"Video Not Found")
  }

  const content=req.body
  if(!content?.trim()){
    throw new ApiError(404,"Content Required")
  }

  const commentObejct=await CommentModel.create(
    {
      owner:user._id,
      video:videoId,
      comment:content,
    }
  )

  const commentReferance=await  CommentModel.findById(commentObejct._id)

  if(!commentReferance){
    throw new ApiError(500,"Server Error While Adding Comment ")
  }

  return res.status(200)
  .json(
    new ApiResponse(
      200,
     commentReferance,
     "Comment Created Sucessfully"
    )
  )
})

const deleteComment=asyncHandler(async(req,res)=>{
//get the comment id by params
//remove the comment id
//comment removed return status
const commentId=req.params

const comment= await CommentModel.findById(commentId)

if(!comment){
  throw new ApiError(401,"Comment Not Found")
}

 await comment.deleteOne()

return res.status(200)
.json(
  new ApiResponse(
    201,
    {},
    "Comment Sucessfully Deleted"
  )
)
})

const updateComment=asyncHandler(async(req,res)=>{
  const commentId=req.params

  const comment=await CommentModel.findById(commentId)

  if(!comment){
    throw new ApiError(401,"Comment Not Found")
  }

  const newComment=req.body
  if(!newComment?.trim()){
    throw new ApiError(401,"Comment Required")
  }

  comment.content=newComment
  await comment.save()

  return res.status(200)
  .json(
    new ApiResponse(
      201,
      comment,
      "Comment Sucessfully Updated"
    )
  )
})

const getVideoComment=asyncHandler(async(req,res)=>{
  const videoId=req.params
  
})

export {
  addComment,
  deleteComment,
  updateComment,
  getVideoComment,
}