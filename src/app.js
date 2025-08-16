import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app=express();
app.use(cors({
  origin:process.env.CORS_ORIGIN,
  credential:true,
}))//it provide middleware that allow our application to respond cross origin request


app.use(cookieParser()) // for accessing the client browser cookie and also for set cookie


app.use(express.urlencoded({extended:true, limit:"16kb" })) //for converting the url in the json formate or java script object and limit show the size the oncoming data extended is for taking object inside object


app.use(express.json({limit:"16kb"}))//express.json allow as to except the data in the json formate

app.use(express.static("public"))//for storing the pdf and files and images in our local server and the public inside the the file that we have in our code 

//import route

import router from './Router/user.route.js';

//routes decleration

app.use("/api/v1/users",router);

export {app}