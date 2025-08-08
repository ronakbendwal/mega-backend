import mongoose from "mongoose";
import { DB_Name } from "../constants.js";

const url="mongodb+srv://ronakbendwal:meengineerhu@youtube.47i4jlx.mongodb.net/"

const ConnectDB= async()=>{
  try{
    const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URL}/${DB_Name}`);

    console.log(`Mongo-DB Connected !! DB Host ${connectionInstance.connection.host}`)

  }catch(error){
    console.log("mongoDB Connection Error :",error);

    process.exit(1)
  }

}

export default ConnectDB;