const userModel = require("../model/model");
const blogModel = require("../model/blogmodel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const commentModel = require("../model/comment");

class Controller {
  async signUp(req, res) {
    res.render("signUp", {
      message: req.flash("message"),
    });
  }

  async signIn(req, res) {
    res.render("signIn", {
      message: req.flash("message"),
    });
  }

  async userAuth(req, res, next) {
    try {
      if (req.user) {
        next();
      } else {
        res.redirect("/signIn");
      }
    } catch (error) {
      throw error;
    }
  }

  async dashboard(req, res) {
    // console.log(req.user);
    res.render("dashboard", {
      user: req.user,
      message: req.flash("message"),
    });
  }

  async register(req, res) {
    try {
      // console.log(req.body);
      // console.log(req.file);
      req.body.image = req.file.filename;
      let isEmailExist = await userModel.find({ email: req.body.email });
      if (!isEmailExist.length) {
        if (req.body.password == req.body.repeatPassword) {
          req.body.password = bcrypt.hashSync(
            req.body.password,
            bcrypt.genSaltSync(10)
          );
          // console.log(req.body);
          let saveData = await userModel.create(req.body);
          // console.log(saveData);
          if (saveData) {
            req.flash("message", "Registration sucessfully..");
            res.redirect("/signIn");
          } else {
            console.log("something went wrong");
          }
        }
      } else {
        console.log("user already exists");
        res.redirect("/signUp");
      }
    } catch (error) {
      throw error;
    }
  }

  async logIn(req, res) {
    try {
      let isUserExist = await userModel.findOne({ email: req.body.email });
      console.log(isUserExist);
      if (isUserExist) {
        const hashPassword = isUserExist.password;
        const decryptPassword = bcrypt.compareSync(
          req.body.password,
          hashPassword
        );
        if (decryptPassword) {
          const token = jwt.sign(
            {
              id: isUserExist._id,
              email: isUserExist.email,
              fullName: `${isUserExist.firstname} ${isUserExist.lastname}`,
              image: isUserExist.image,
            },
            "SUV1234DP",
            { expiresIn: "20m" }
          );
          console.log(token);
          console.log("Login Sucessfully");
          res.cookie("userToken", token);
          req.flash("message", "LogIn sucessfully..");
          res.redirect("/dashboard");
        } else {
          console.log("Password Incorrect");
          res.redirect("/signIn");
        }
      } else {
        console.log("Check your email");
        res.redirect("/signIn");
      }
    } catch (error) {
      throw error;
    }
  }

  async logOut(req, res) {
    try {
      console.log(req.cookies);
      res.clearCookie("userToken");
      console.log("Clear Cookie");
      res.redirect("/signIn");
    } catch (error) {
      throw error;
    }
  }

  /* get all user */
  async users(req, res) {
    try {
      const allUsers = await userModel.find({});
      console.log(allUsers);
      res.render("userView", {
        allUsers,
      });
    } catch (error) {
      throw error;
    }
  }

  async blogView(req, res) {
    try {
      let Data = await blogModel.find({ isDeleted: false });
      let comment = await commentModel.find()

      res.render("blogView", {
        message: req.flash("message"),
        user: req.user,
        title: "Admin || BLOG-List",
        Data,
        comment
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   * @method getBlogForm
   * @description get the form
   */

  async getBlogForm(req, res) {
    try {
      res.render("blogForm", {
        message: req.flash("message"),
        user: req.user,
        title: "Admin || BLOG-Form",
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   * @method postBlogForm
   * @description get the details from the form
   */

  async postBlogForm(req, res) {
    try {
      //Removing the spaces
      req.body.title = req.body.title.trim();
      req.body.date = req.body.date.trim();
      req.body.writer = req.body.writer.trim();
      req.body.content = req.body.content.trim();

      //Checking if the fields are blank or not
      if (
        !req.body.title ||
        !req.body.date ||
        !req.body.writer ||
        !req.body.content
      ) {
        req.flash("message", "Field Should Not Be Empty!!");
        res.redirect("/blog-form");
      }
      console.log(req.file, "req.file");
      req.body.image = req.file.filename;

      let Data = await blogModel.create(req.body);
      console.log(Data);

      //Checking to see if Data is Saved
      if (Data && Data._id) {
        req.flash("message", "Data Entered Successful!!");
        res.redirect("/blog-list");
      } else {
        req.flash("message", "Data entry Not Successful!!");
        res.redirect("/blog-form");
      }
    } catch (err) {
      throw err;
    }
  }

  /**
   * @method blogDelete
   * @description Soft Deleting the faq
   */
  async blogDelete(req, res) {
    try {
      let dataUpdate = await blogModel.findByIdAndUpdate(req.params.id, {
        isDeleted: true,
      });
      if (dataUpdate && dataUpdate._id) {
        req.flash("message", "Data Deleted!!");
        res.redirect("/blog-list");
      } else {
        req.flash("message", "Data Not Deleted!");
        res.redirect("/blog-list");
      }
    } catch (err) {
      throw err;
    }
  }

  /**
   * @method blogEdit
   * @description Editing the details of the questions in faq
   */
  async blogEdit(req, res) {
    try {
      let Data = await blogModel.find({ _id: req.params.id });
      console.log(Data);
      res.render("blogEdit", {
        title: "BLOG || Edit",
        message: req.flash("message"),
        user: req.user,
        response: Data[0],
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   * @method blogqUpdate
   * @description
   */
  async blogUpdate(req, res) {
    try {
      req.body.image = req.file.filename;
      let contUpdate = await blogModel.findByIdAndUpdate(req.body.id, req.body);

      if (req.file && req.body.filename) {
        fs.unlinkSync(`./public/uploads/${data[0].image}`);
      }
      console.log(req.body, "req.body");
      console.log(contUpdate, "contUpdate");
      if (contUpdate && contUpdate._id) {
        console.log("Blog Updated");
        req.flash("message", "Data Updated!!");
        res.redirect("/blog-list");
      } else {
        console.log("Something Went Wrong");
        req.flash("message", "Data Not Updated!");
        res.redirect("/blog-list");
      }
    } catch (err) {
      throw err;
    }
  }

  async comment(req, res) {
    try {
      let saveComment = await commentModel.create(req.body);
      if (saveComment) {
        console.log("Comment save",saveComment);
        res.redirect("/blog-list");
      } else {
        console.log("Comment not save");
        res.redirect("/blog-list");
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new Controller();
