if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}



const express = require("express");
const ejsMate = require("ejs-mate");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ExpressError = require("./utils/expresserror.js");
const listingRoutes = require("./routes/listings");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/user");
const PORT = process.env.PORT || 3000;
// const mongurl = "mongodb://127.0.0.1:27017/wonderlust";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
const cookieParser=require("cookie-parser");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const Localstrategy=require("passport-local");
const User=require("./models/user.js");


const dbUrl = process.env.MONGO_URL;
;

main()
  .then(() => console.log("connected"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}
app.listen(port, () => {
  console.log("server is listening");
});

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());

app.use((req,res,next)=>{

  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
    res.locals.curUser=req.user;
  next();
});




app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/",userRoutes);


app.use((req, res, next) => {
  next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "some thing went wrong" } = err;
  res.status(status).render("listings/error.ejs", { message });
});

/*app.get("/demouser", async (req, res) => {
  let fakeUser = new User({
    email: "student@gmail.com",
    username: "delta-student",
  });
  let registeredUser = await User.register(fakeUser, "helloworld");
  res.send(registeredUser);
});*/
