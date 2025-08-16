import dotenv from 'dotenv'
import ConnectDB from "./DB/indexOfDB.js";
import { app } from './app.js';

dotenv.config({path:'./env'}); 

ConnectDB()//execute databse connection
.then(()=>
{
   app.on("error",(error)=>{
      console.log("ERROR IN APP LISTENING :",error);
      throw error
    })//if there's any error in the app listening

  app.listen(process.env.PORT || 3000,()=>{
    console.log(`Server Is Running At Port : ${process.env.PORT}`)
  })//listen app on the port 
})
.catch((err)=>{
console.log('MONGODB CONNECTION FAILDED !!!',err)
})//if there's any error in the mongo connection













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