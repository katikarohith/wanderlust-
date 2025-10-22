const express = require("express");
const router = express.Router();
const asyncwrap = require("../utils/wrapasyc.js");
const { isLoggedIn, isOwner, validatelisting } = require("../middelware.js");
const listingcontroller = require("../controllers/listings.js");
const multer=require("multer");
const { storage}=require("../cloudConfig.js")
const upload=multer({storage});


router.get("/search", listingcontroller.searchListings);

router
  .route("/")
  .get(asyncwrap(listingcontroller.index))
  .post(isLoggedIn,upload.single("listing[image]") ,validatelisting, asyncwrap(listingcontroller.createlisting));
  

router.get("/new", isLoggedIn, listingcontroller.rendernewform);

router
  .route("/:id")
  .get(asyncwrap(listingcontroller.showlisting))
  .put(isLoggedIn, isOwner,upload.single("listing[image]") ,validatelisting, asyncwrap(listingcontroller.updatelisting))
  .delete(isLoggedIn, isOwner, asyncwrap(listingcontroller.deletelisting));

router.get("/:id/edit", isLoggedIn, isOwner, asyncwrap(listingcontroller.rendereditform));



module.exports = router;
