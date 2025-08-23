import { asyncHandler } from "../Utils/asyncHandler.js";
import  {UserModel}  from "../Models/User.Model.js";
import { ApiError } from "../Utils/apiError.js";
import { uploadOnCloudinary } from "../Utils/cloudnary.js";
import { ApiResponse } from "../Utils/apiResponse.js";

//this below method we create for generating the tokens 
const GenerateAccessAndRefreshToken=async (userid) => {//here we use the userid for finding the user details

try{
  const CurrentUserData=await UserModel.findById(userid);//here by user id we find all the user information to generate token

  const accessToken=await CurrentUserData.generateAccessToken();//generate the access token by using the method that we create before with the current user data

  const refreshToken=await CurrentUserData.generateRefreshToken();//generate the refresh token by using the method that we create before with the current user data

  CurrentUserData.refreshToken=refreshToken;//here we add the refresh token in the data base, the currentuser data comes from the mongoose so we can add it directly

  await CurrentUserData.save({validateBeforeSave:false})//here we save the refresh token in the user data in dataBase, the validate before save is for we don't need any type of validation in refresh token save

  return {accessToken,refreshToken}

}catch(error){
  throw new ApiError(500,"something went wrong while generating access and refresh token")
}
}

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

  console.log(req.files);
  const { fullname,password,username,email}=req.body

  //check if there's field empty or not
  // if(email==""){
  //   throw new ApiError(400,"field are empty");
  // }

  if([email,password,username,fullname].some((field)=>
    field?.trim()==""
  )){
    throw new ApiError(400,"all field's are required");
  }

  //user's existence check
  const existedUser=await UserModel.findOne({
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
  // const coverimageLocalPath=req.files?.coverimage[0]?.path;//using req.files we access the fields we access the field of the multer from page and then if we have fiels then we use avtar[0] which give us the 1st property of the file which contains maybe path and then we check is path here of it is then we store the referance in the variable

  // for cover image we are not chect the condition so it generate and make error like undefined so here we use the classic if else condition and comment out the previous
  let coverimageLocalPath;
  if(req.files && 
    Array.isArray(req.files.coverimage) && 
    req.files.coverimage.length>0){
      coverimageLocalPath=req.files.converimage[0].path;
    }

    //if there's no any avtar path then throw error

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
    coverimage:coverImage?.url || "",
    password,
    username:username.toLowerCase(),
  })//whenever we create object in DB then throughout our field .create add one more field on the DB which is _id and we can use it for the letter use

  //here we get the usercreated referance and also we remove the passward and the refresh token field
  //here we use .select and put all the things and the field that we want to remove 
  const createdUserReferance=await UserModel.findById(userObject._id).select(
    "-password -refreshToken"
  )//here we check the user having the id in the DB then we romove the passward and the refresh token field

  if(!createdUserReferance){
    throw new ApiError(500,"something went wrong while registering the user in the Data-Base")
  }//if there's any problem in registring the user in the db then we give the error to the user form server 

  return res.status(201).json(
    new ApiResponse(200,createdUserReferance, "user registered sucessfully")
  )//here in the json we can send the field by our own like in object we can send created user but we have and organized way for this which is we created the response class for this
  })

  const loginUser=asyncHandler(async(req,res)=>{
    //get all the data from the body
    //give access via username or email
    //validate if any field is empty or not 
    //find the user if have and user the go forward else show error
    //passward check if same then go forward else show error
    //generate access and refresh token 
    //send cookies
    //send response user logined

    //get the element from the req body
    const { password, username, email } = req.body

    //if there's no username or no any passward then we simply check and throw an error
    if(!(username || email)){//here we do logical mistake 
      throw new ApiError(400,"user name or passward is required")
    }

    //here we find the user in the data base using any one from both the fiend that we have currently present
    const CurrentUser=await UserModel.findOne({
      $or:[{email},{username}]
    })

    //if we dont have the user then we show the below error
    if(!CurrentUser){
      throw new ApiError(404,"user does not exist")
    }

    //now check the passward is correct or not 
    //this give us the true or false after checking the passward
    const isPasswardsame=await CurrentUser.isPasswardCorrect(password)

  
    //if the isPasswardsame is false then we throw the error below 
    if(!isPasswardsame){
      throw new ApiError(401,"the passward is incorrect")
    }

    //generate tokens using the method we created
    const {accessToken,refreshToken}=await GenerateAccessAndRefreshToken(CurrentUser._id)

    //now we sent cookie and we know we don't need to sent the passward in the cookie response
    //now we directly sent the current user as a cookie but we call the refresh token is created after getting the current user info so we again call the data base and get all the info and now we also get all the credential that we added recently

    const loggedinUser=await UserModel.findById(CurrentUser._id)
    .select("-password -refreshToken")

    //now we sent cookie for sending cookie we have to design some options
    const options={
      httpOnly:true,
      recure:true,
    }//the cookie is btdefault editable so anyone can modify the cookie for preventing this and want the cookies only modified by the server we use this options

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)//here we sent cookie
    .cookie("refreshToken",refreshToken,options)//here also we sent cookie
    .json(
      new ApiResponse(
        200,//the status code 

        {//here we sent data in response
          user:loggedinUser,
          refreshToken,
          accessToken,
        },
        "User Logged In Sucessfull"//it is the message 

      )//it is the json response and we use api response class for make our work easy
    )
  })

  const logoutUser=asyncHandler(async(req,res)=>{
    //clear all the cookie
    //remove the refesh token from the database
    
    //now we can simply get all the user database field here using below 
    
    //if we use usermodel.findById then we have the get the whole user and the delete the token and then again save validation false type work have to do for ignoring all of this we use another method

    await UserModel.findByIdAndUpdate(
      req.user._id,//here we find the user by id
      {
        $set:{
          refreshToken:undefined//here we update the value 
        }
      },
      {
        new:true//here we say in response we want the updated vlaue only
      }
    )//here we remove the refesh token from the data base

    const options={
      httpOnly:true,
      secure:true,
    }
    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
      new ApiResponse(200,{},"User Logout Sucessfully ")
    )
  })


export {
  registerUser,
  loginUser,
  logoutUser,
}
