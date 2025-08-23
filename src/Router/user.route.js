import {Router} from "express"
import { loginUser, logoutUser, registerUser} from "../Controller/user.controller.js";
import { upload } from "../MiddleWare/multer.middleware.js";
import { verifyJWT } from "../MiddleWare/auth.middleware.js";
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
router.post("/login",loginUser)

//secured route the bwlow one
router.post("/logout",verifyJWT,logoutUser)//when we hit on this route then first the middleware execute go to middleware for remaining story


export default router;
