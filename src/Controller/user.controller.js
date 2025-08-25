import { asyncHandler } from "../Utils/asyncHandler.js";
import  {UserModel}  from "../Models/User.Model.js";
import { ApiError } from "../Utils/apiError.js";
import { uploadOnCloudinary } from "../Utils/cloudnary.js";
import { ApiResponse } from "../Utils/apiResponse.js";
import jwt from "jsonwebtoken"
import { application } from "express";
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
    }//the cookie is by default editable so anyone can modify the cookie for preventing this and want the cookies only modified by the server we use this options

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

  const refreshAccessToken=asyncHandler(async(req,res)=>{
    try{
         //get the refresh token from the cookies
   const incomingRefreshToken= req.cookies.refreshToken || req.body.refreshToken

   //if there's no any user
   if(!incomingRefreshToken){
    throw new ApiError(401,"anauthorize request")
   }

   //now verify the token 
   //here our decoded incomingRefreshToken convert into the decoded one 
   const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRETKEY)

   //here we get the user from the _id which we have in the decodedToken
   const user=await UserModel.findById(decodedToken._id)

   //check the user or not if not then show error
   if(!user){
    throw new ApiError(401,"invalid refesh token ")
   }

   //chdck the incoming refresh token and the stored one is same or not
   if(incomingRefreshToken != user?.refreshToken){
    throw new ApiError(401,"refresh token is expired or used");
   }

   const {accessToken,newRefreshToken}=await GenerateAccessAndRefreshToken(user._id);

   const options={
    httpOnly:true,
    recure:true
   }

   return res.status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refeshToken",newRefreshToken,options)
   .json(
    ApiError(
      200,
      {
        refreshToken:newRefreshToken,
        accessToken,
      },
      "Accessed Token Sucessfully"
    )
   )
    }catch(error){
      throw new ApiError(401,error?.message || "Invalid Refresh Token")
    }
  })

  const changeCurrentPassward=asyncHandler(async(req,res)=>{
    //get old passward from the user
    //also the new passward
    //find the user is loged in or not
    //check the passward is same as the current user password or not
    //if same then update the new passward
    //if not then show error
    //save the user

    const {oldPassward,newPassward}=req.body

    const currentUser=await UserModel.findById(req.user?._id)

    if(!currentUser){
      throw new ApiError(401,"invalid user ")
    }

    const checkPassword=user.isPasswardCorrect(oldPassward)

    if(!checkPassword){
      throw new ApiError(401,"invalid password")
    }

    user.password=newPassward
    await user.save({validateBeforeSave:false});

    return res.status(200)
    .json(new ApiResponse(
      200,
      {},
      "passward changed sucessfully"
    ))
  })

  const getCuttentUser=asyncHandler(async(req,res)=>{
    return res.status(200)
    .json(
       new ApiResponse(
        200,req.user,"Current User Fatch Sucessfully"
       )
    )
  })

  const updateUserInfo=asyncHandler(async(req,res)=>{

    const {fullname,email}=req.body

   const user =await  UserModel.findByIdAndUpdate(
      req.user?._id,
      {
        $set:{
          email:email,//normal assignment  method
          fullname,//short handy method when the assignment and assigned field are same
        }
      }, 
      { new:true }
    ).select("-password")//here we save data base coll for removign the password from response
    //otherwise we have to again call data base and select the avoiding fields

    return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user:user },
        "Information Sucessfully Changed"
      )
    )
  })


    const updateUserAvtar=asyncHandler(async(req,res)=>{
    //here we get the file path from the multer
    const newAvtarLocalPath=req.file?.path

    //check it is present or not
    if(!newAvtarLocalPath){
      throw new ApiError(401, "Avart File Is Missing ")
    }

    //if present then upload this file on the cloudinary
    const avtar=await uploadOnCloudinary(newAvtarLocalPath)

    //if we not get the url after uploading the show error
    if(!avtar.url){
      throw new ApiError(400,"Error While Uploading Avtar")
    }

    //now we update the avtar field in the dataBase
    const user=await UserModel.findByIdAndUpdate(
      req.user?._id,
      {
        $set:{
          avtar:avtar.url
        }
      },{new :true}
    ).select(-"password")

    return res.
    ststus(200)
    .json(
      new ApiResponse(
        200,
        {user},
        "Avtar Sucessfully Updated"
      )
    )

  })

    const updateUserCoverImage=asyncHandler(async(req,res)=>{
    //here we get the file path from the multer
    const newCoverImageLocalPath=req.file?.path
    
    //check it is present or not
    if(!newCoverImageLocalPath){
      throw new ApiError(401, "Cover-Image File Is Missing ")
    }

    //if present then upload this file on the cloudinary
    const coverImage=await uploadOnCloudinary(newCoverImageLocalPath)

    //if we not get the url after uploading the show error
    if(!coverImage.url){
      throw new ApiError(400,"Error While Uploading Cover-Image File")
    }

    //now we update the avtar field in the dataBase
    const user=await UserModel.findByIdAndUpdate(
      req.user?._id,
      {
        $set:{
          coverimage:coverImage.url
        }
      },{new :true}
    ).select(-"password")


    return res.
    ststus(200)
    .json(
      new ApiResponse(
        200,
        {user},
        "Cover-Image Sucessfully Updated"
      )
    )

  })


  const getUserChannelProfile=asyncHandler(async(req,res)=>{
    const {username}=req.params//here we get the username from the fiels that's why we usr .params here

    if(!username?.trim()){//if the value is not true
      throw new ApiError(401," Username Is Missing ")
    }

    // UserModel.find({username})//here we are not use this cuz it is costly process have to optimize it

    //the new one using aggregate
    const channel=await UserModel.aggregate([{
      $match: {
        username:username?.toLowerCase()
      }
    },
    {
      $lookup: {
        from:"subscriptions",
        localField:"_id",//here we use _id cuz we check all the channel having same _id
        foreignField:"channel",
        as:"havingSubscriberData"
      }
    },
    {
    $lookup: {
      from: "subscriptions",
      localField:"_id",
      foreignField:"subscriber",
      as:"channelThatWeSubscribed"

    }
  },
  {
    $addFields: {
      subscriberCount: {
        $size:"$havingSubscriberData"//we use doller cuz the green one is now field
      },
      channelsSubscribedToCount:{
        $size: "$channelThetWeSubscribed"
      },
      isSubscribed: {
        $cond:{
          if:{$in:[req.user?._id,"$havingSubscriberData.subscriber"]},
          then:true,
          else:false,
        }
      }
    }
  },
{
  $project: {
    username:1,//here we convert the flag from 0 to 1
    fullname:1,
    channelsSubscribedToCount:1,
    subscriberCount:1,
    isSubscribed:1,
    avtar:1,
    coverimage:1,
    email:1,
  }//the projection allow as to change the field name and which field we want to include /exclude and many other output and pass related operation we can perform here

}])//the aggregate is a method for aggregation pipeline and it takes an array of object the object is nothing but just a pipeline
if(!channel?.length){
  throw new ApiError(400,"Channel Does Not Exist")
}

return res.status(200)
.json(
  new ApiResponse(
    200,
    channel[0],
    "User Channel Fatched Sucessfully"
  )
)
})
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassward,
  getCuttentUser,
  updateUserInfo,
  updateUserAvtar,
  updateUserCoverImage,
  getUserChannelProfile,

}
