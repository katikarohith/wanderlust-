const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncwrap = require("../utils/wrapasyc.js");
const { validatereview, isLoggedIn, isReviewAuthor } = require("../middelware.js");
const reviewcontroller = require("../controllers/reviews.js");

router.post("/", isLoggedIn, validatereview, asyncwrap(reviewcontroller.createreview));
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, asyncwrap(reviewcontroller.deletereview));

module.exports = router;
