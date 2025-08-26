import { asyncHandler } from "../Utils/asyncHandler.js";
import {UserModel} from "../Models/User.Model.js"
import { ApiError } from "../Utils/apiError";
import { TweetModel } from "../Models/Tweet.Model.js";
import { ApiResponse } from "../Utils/apiResponse";

const createTweet=asyncHandler(async(req,res)=>{
//grab all the content from the user by req.body
//now check the user is tere or not 
//if there then simply add the content 
const {content}=req.body
const user=await UserModel.findById(req.user?._id)

if(!user?.trim()){
  throw new ApiError(400,"User Not Found")
}

const tweetObject=await TweetModel.create(
  {
    content
  }
)

const createdTweetReferance=await TweetModel.findById(tweetObject._id)

if(!createdTweetReferance){
  throw new ApiError(500,"Something Went Wrong From Server Side In Tweet Creation")
}

return res.status(200)
      .json(new ApiResponse(
        200,
        createdTweetReferance,
        "Tweet Created Sucessfully",
      ))
})

const deleteTweet=asyncHandler(async(req,res)=>{
  //get the tweet id from db
  //now delete remove the id from db
  //here our tweet deleted
  try{
    const tweetId=req.params._id;
  const isDeleted=await TweetModel.findByIdAndDelete(tweetId)

  if(!isDeleted){
    throw new ApiError(401,"Tweet Not Found")
  }

  return res.status(200)
  .json(
    new ApiResponse(
      201,
      {},
      "Tweet Deleted Sucessfully"
    )
  )

  }catch(error){
    throw new ApiError(500,error.message || "Server Error While Deleteing Tweet :")
  }

})

const updateTweet=asyncHandler(async(req,res)=>{
  const newTweet=req.body

  if(!newTweet || !newTweet.trim()){
    throw new ApiError(400,"Theres No Tweet For Update")
  }

  const tweet=await TweetModel.findByIdAndUpdate(
    req.params._id,
    {
      $set:{
        content:newTweet,
      }
    },{new:true}
  )

  return res.status(200)
  .json(
    201,
    {tweet},
    "Tweet Update Sucessfully"
  )
  
})

const getUserTweet=asyncHandler(async(req,res)=>{

  const tweet=await TweetModel.findById(req.params?._id)

  if(!tweet){
    throw new ApiError(402,"Tweet Not Found")
  }
  return res.status(200)
  .json(200,
    tweet,
    "Tweet Fatched Sucessfully"
  )
})


export {
  createTweet,
  deleteTweet,
  getUserTweet,
  updateTweet,
}