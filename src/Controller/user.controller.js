import { asyncHandler } from "../Utils/asyncHandler.js";
import { UserModel } from "../Models/User.Model.js";
import { ApiError } from "../Utils/apiError.js";
import { uploadOnCloudinary } from "../Utils/cloudnary.js";
import { ApiResponse } from "../Utils/apiResponse.js";
 const registerUser =asyncHandler(async (req,res)=>{
  //get user data from frontend
  //apply validation => check no empty
  //check already present or not : via username or email
  //check for images , check for avtar
  //upload now the images in cloudinary
  //create user object => create entry in DB
  //remove passward and refresh token field from response
  //check for user creation
  //return response if created if not return error

  const { fullname,passward,username,email}=req.body

  //check if there's field empty or not
  // if(email==""){
  //   throw new ApiError(400,"field are empty");
  // }

  if([email,passward,username,fullname].some((field)=>
    field?.trim()==""
  )){
    throw new ApiError(400,"all field's are required");
  }

  //user's existence check
  const existedUser=UserModel.findOne({
    $or:[{email},{username}]
  })//the usermodel directly make contact with the data base 
  //the .findOne used to find the value that we will give in the model or data base
  //we can use any operator using $ sign 
  //we also check more than one value using the array of object
  if(existedUser){
    throw new ApiError(409,"user_name already exist");
  }

  //now we check the file and images are there in the multer or not

  const avtarLocalPath=req.files?.avtar[0]?.path;//using req.files we access the fields we access the field of the multer from page and then if we have fiels then we use avtar[0] which give us the 1st property of the file which contains maybe path and then we check is path here of it is then we store the referance in the variable
  const coverimageLocalPath=req.files?.coverimage[0]?.path;//using req.files we access the fields we access the field of the multer from page and then if we have fiels then we use avtar[0] which give us the 1st property of the file which contains maybe path and then we check is path here of it is then we store the referance in the variable

  if(!avtarLocalPath){
    throw new ApiError(400,"avtar file is required")
  }

  //now if we have file path then upload it on cloudnary

  const avtar=await uploadOnCloudinary(avtarLocalPath);//here we upload on cloudinary

  const coverImage=await uploadOnCloudinary(coverimageLocalPath);//here we upload on cloudinary

  if(!avtar){
    throw new ApiError(400, "avtar file is required");
  }

  //now we create user object in the dataBase
  const userObject=await UserModel.create({
    fullname,
    avtar:avtar.url,
    email,
    coverImage:coverImage?.url || "",
    passward,
    username:username.toLowerCase(),
  })//whenever we create object in DB then throughout our field .create add one more field on the DB which is _id and we can use it for the letter use

  //here we get the usercreated referance and also we remove the passward and the refresh token field
  //here we use .select and put all the things and the field that we want to remove 
  const createdUserReferance=await userObject.findById(userObject._id).select(
    "-passward -refreshToken"
  )//here we check the user having the id in the DB then we romove the passward and the refresh token field

  if(!createdUserReferance){
    throw new ApiError(500,"something went wrong while registering the user in the Data-Base")
  }//if there's any problem in registring the user in the db then we give the error to the user form server 

  return res.status(201).json(
    new ApiResponse(200,createdUserReferance, "user registered sucessfully")
  )//here in the json we can send the field by our own like in object we can send created user but we have and organized way for this which is we created the response class for this
  })


export {registerUser}
