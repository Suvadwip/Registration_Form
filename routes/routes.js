const router= require("express").Router()
const controller= require("../controller/controller")
const multer= require("multer")
const path= require("path")

const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "./public/uploads");
    },
    filename(req, file, cb) {
      cb(
        null,
        file.fieldname +
          "-" +
          Date.now() +
          "myimg" +
          path.extname(file.originalname)
      );
    },
  });
  const maxSize = 1 * 1024 * 1024; // 1 mb
  
  const upload = multer({
    storage,
    fileFilter(req, file, cb) {
        if(file.mimetype == "image/jpg" ||
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpeg"){
        cb(null,true)
        }else{
          cb(null,false)
          return cb(new Error('only jpg,png,jpeg type are allow'))
        }
    },
    limits: maxSize
  });

router.get("/signUp",controller.signUp)
router.get("/signIn",controller.signIn)
router.post("/register",upload.single('image'),controller.register)
router.post("/logIn",controller.logIn)
router.get("/getAllUser",controller.users)
router.get("/logOut",controller.logOut)
router.get("/dashboard",controller.userAuth,controller.dashboard)

router.get('/blog-list', controller.userAuth, controller.blogView);
router.get('/blog-form', controller.userAuth, controller.getBlogForm);
router.get('/blog-delete/:id', controller.blogDelete);
router.get('/blog-edit/:id', controller.userAuth, controller.blogEdit);

router.post('/blog-update', upload.single('image'), controller.blogUpdate);
router.post('/blog-insert', upload.single('image'), controller.postBlogForm);

router.post("/comment",controller.comment)

module.exports= router