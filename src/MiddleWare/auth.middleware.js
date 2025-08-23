import { ApiError } from "../Utils/apiError.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import { UserModel } from "../Models/User.Model.js";
import  jwt from "jsonwebtoken";
export const verifyJWT=asyncHandler(async(req,res,next)=>{
  try{
      const token=req.cookies?.accessToken ||req.header
  ("Authorization")?.replace("Bearer ","");//here we get the token from the req.cookie we use it cuz we congigure cookie-parser in app.js now if we have access token then we get it 
  //but in mobile app we dont have so we use header which generally named as a autherization which is the key and the value is like Bearer <token> so we replace the barer space and only take token here simpleeee

  //if there's no token then we throw error
  if(!token){
    throw new ApiError(401,"unAuthorize request")
  }

  //if we have token then we check using jwt and in response we get the decoded field value of token
  const decodedToken= jwt.verify(
    token, 
    process.env.ACCESS_TOKEN_SECRETKEY
  )

  //in decodec token we get all the value's so that we can use it further
  const user =await UserModel.findById(decodedToken?._id).select("-password -refreshToken")

  //if there's no user then we throw error
  if(!user){
    //todo:discuss about frontend here
    throw new ApiError(401,"invalid access token")
  }
  req.user=user;
  next();
  }catch(error){
    throw new ApiError(401,error?.message || "invalid access token")
  }
})
//remaining: after comes on the middleware the middleware get the data from cookies or autherization and then check token is there or not after checkig it decode all the field from the token and then find the user in the data base with the help of _id and then if we don't have user then show error else simply put the req.user =user and go to next();
//now go on the controller