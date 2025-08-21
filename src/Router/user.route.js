import {Router} from "express"
import { registerUser} from "../Controller/user.controller.js";
import { upload } from "../MiddleWare/multer.middleware.js";
const router=Router();

router.post("/register",upload.fields([
  {
    name:"avtar",
    maxCount:1
  },
  {
    maxCount:1,
    name:"coverimage"
  }
]),registerUser);//in between route and the executive function we use middleware

// router.route("/register").post(registerUser);

//both the syntex do the same thing but we use the upper one


export default router;
