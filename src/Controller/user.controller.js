import { asyncHandler } from "../Utils/asyncHandler.js";

 const registerUser =asyncHandler((req,res)=>{
  res.status(200).json({
    data:"hello from server"
  })
})


export {registerUser}
