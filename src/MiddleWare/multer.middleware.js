import multer from "multer";

const storage = multer.diskStorage({
  
  destination: function (req, file, cb) {//in parameter we got req that we sent the file for stroing the file in the cloudinary and call back (cb)

  cb(null, "./public/temp")//here we give file path where we store file temporary
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

export const upload = multer({ storage: storage })

