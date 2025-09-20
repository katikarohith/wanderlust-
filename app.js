const express = require("express");
const ejsMate = require("ejs-mate");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ExpressError = require("./utils/expresserror.js");
const listingRoutes = require("./routes/listings");
const reviewRoutes = require("./routes/reviews");
const port = 8080;
const mongurl = "mongodb://127.0.0.1:27017/wonderlust";
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
main()
  .then(() => console.log("connected"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongurl);
}
app.listen(port, () => {
  console.log("server is listening");
});

app.get("/", (req, res) => {
  res.render("listings/home.ejs");
});

app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);


app.use((req, res, next) => {
  next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "some thing went wrong" } = err;
  res.status(status).render("listings/error.ejs", { message });
});
