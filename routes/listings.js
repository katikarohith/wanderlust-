const express = require("express");
const router = express.Router();
const Listing = require("../models/listings.js");
const asyncwrap = require("../utils/wrapasyc.js");
const ExpressError = require("../utils/expresserror.js");
const { listingSchema } = require("../schema.js");

const validatelisting = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errmsg);
  } else {
    next();
  }
};

/*router.get("/testlist", async (req, res) => {
    let samplelist = new listing({
        title: "janther manther",
        discription: "near new delhi",
        price: 1200,
        location: "delhi",
        country: "india",
    });
    await samplelist.save();
    console.log("sample list added");
    res.send(" successfully runned");
});*/


router.get("/", asyncwrap(async (req, res) => {
  const alllistings = await Listing.find({});
  res.render("listings/index.ejs", { alllistings });
}));

router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

/*router.post("/", asyncwrap(async (req, res, next) => {
    console.log(req.body);
    if (!req.body.listing) {
        console.log("no listing");
        throw new ExpressError(400, "Send valid data for listing");
    }
    if (!req.body.listing.title) {
        console.log("no title");
        throw new ExpressError(400, "enter title");
    }
    if (!req.body.listing.description) {
        console.log("no descrition");
        throw new ExpressError(400, "enter description");
    }
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");
}));*/

router.post("/", validatelisting, asyncwrap(async (req, res, next) => {
  const newlisting = new Listing(req.body.listing);
  await newlisting.save();
  res.redirect("/listings");
}));


router.get("/:id/edit", validatelisting, asyncwrap(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));


router.put("/:id", validatelisting, asyncwrap(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
}));


router.delete("/:id", asyncwrap(async (req, res) => {
  let { id } = req.params;
  let deletedlist = await Listing.findByIdAndDelete(id);
  console.log(deletedlist);
  res.redirect("/listings");
}));

router.get("/:id", asyncwrap(async (req, res, next) => {
  let { id } = req.params;
  const listening = await Listing.findById(id).populate("reviews");
  if (listening) {
    res.render("listings/show.ejs", { listening });
  } else {
    throw new ExpressError(400, "not found listing");
  }
}));

module.exports = router;
