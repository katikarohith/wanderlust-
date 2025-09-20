const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listings.js");
const Review = require("../models/reviews.js");
const asyncwrap = require("../utils/wrapasyc.js");
const ExpressError = require("../utils/expresserror.js");
const { reviewSchema } = require("../schema.js");

const validatereview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errmsg);
  } else {
    next();
  }
};

router.post("/", validatereview, asyncwrap(async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  res.redirect(`/listings/${listing._id}`);
}));

router.delete("/:reviewId", asyncwrap(async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
}));

module.exports = router;
