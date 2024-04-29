const express= require("express")
const mongoose= require("mongoose")
const path= require("path")
require("dotenv").config()
const app= express()
const session= require("express-session")
const cookieParser= require("cookie-parser")
const flash= require("connect-flash")

app.use(
    express.urlencoded({
        extended: true,
    })
)
app.use(cookieParser())
app.use(session({
  secret:"SDE#DG",
  saveUninitialized: true,
  resave: true
}))

app.use(express.static(path.join(__dirname, "public")));

app.use(flash())

app.set("view engine","ejs")
app.set("views","view")

const jwtAuth= require("./middleware/authjwt")
app.use(jwtAuth.authJwt)

const router= require("./routes/routes")
app.use(router)

const port= process.env.PORT || 5000
const dbDriver= process.env.MONGO_DB_URL
mongoose
  .connect(dbDriver, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    app.listen(port, () => {
      console.log("db is connected");
      console.log(`server is running @ http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log("db is not connected");
  });