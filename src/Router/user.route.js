import {Router} from "express"
import {
  changeCurrentPassward,
   getCurrentUser,
   getUserChannelProfile,
   getWatchHistory,
   loginUser,
   logoutUser,
   refreshAccessToken, 
   registerUser,
   updateUserAvtar,
   updateUserCoverImage,
   updateUserInfo
  } from "../Controller/user.controller.js";
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

//secured route here below cuz we only use it when the user is logged in

router.post("/logout",verifyJWT,logoutUser)//when we hit on this route then first the middleware execute go to middleware for remaining story

router.post("/refresh",refreshAccessToken)

//here we change 
router.post("/change-password",verifyJWT,changeCurrentPassward)

//here we want to update something 
router.route("/update-user-info").patch(verifyJWT,updateUserInfo)

router.route("/update-user-avtar").patch(verifyJWT,upload.single("avtar"),updateUserAvtar)

router.route("/update-user-coverimage").patch(verifyJWT,upload.single("converimage"),updateUserCoverImage)

//here below we get 
router.get("/c/:username",verifyJWT,getUserChannelProfile)

router.get("/watch-history",verifyJWT,getWatchHistory)

router.get("/current-user",verifyJWT,getCurrentUser)


export default router;
