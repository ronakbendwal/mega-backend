import dotenv from 'dotenv'
import ConnectDB from "./DB/indexOfDB.js";


dotenv.config({path:'./env'}); 

ConnectDB(); //execute databse connection














// const app=express();
//first approach od connecting database

/*
;(async()=>{
  try{
    await mongoose.connect(`${process.env.MONGODB-URL}/${DB_Name}`);

    app.on("error",(error)=>{
      console.log("error :",error);
      throw error
    })

    app.listen(process.env.PORT,()=>{
      console.log(`app listening on port ${process.env.PORT}`);
    })

  }catch(error){
    console.error("ERROR IS :",error);
    throw error
  }
})()
  */