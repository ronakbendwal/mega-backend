import {v2 as cloudinary } from "cloudinary";
import fs from "fs"

    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    const uploadOnCloudinary=async (localFilePath)=>{
      try{
        //if there's no file in the file path
        if(!localFilePath) return null


        //upload the file on cloudinary
        const response=await cloudinary.uploader.upload(localFilePath,{
          resource_type:"auto"
        })


        //file has been uploaded sucessfully 
        // console.log("file uploaded on cloudinary",response.);

        //after sucessfully uploaded file on the cloudinary we have to unlink it
        fs.unlinkSync(localFilePath);

        return response;
      }catch(error){
        fs.unlinkSync(localFilePath); //it remove the locally save temporary file as the operation got faled
        console.log("ERROR IN FILE UPLOADATION :",error)
      }
    }

    export {uploadOnCloudinary}; 


