const Listing = require("../models/listings.js");
const ExpressError = require("../utils/expresserror.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const alllistings = await Listing.find({});
  res.render("listings/index.ejs", { alllistings });
};

module.exports.rendernewform = (req, res) => {
  res.render("listings/new.ejs");
};
module.exports.createlisting = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  const newlisting = new Listing(req.body.listing);
  newlisting.owner = req.user._id;

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    newlisting.image = { url, filename };
  }

  if (typeof req.file == "undefined") {
    let url = "https://tse1.mm.bing.net/th/id/OIP.6sfqZn6F45Jml20iAnIZXgHaHa?pid=Api&P=0&h=180";
    let filename = "NOimageuploaded";
    newlisting.image = { url, filename };
  }

  newlisting.owner = req.user._id;
  newlisting.geometry = response.body.features[0].geometry;

  // Added line to include category
  newlisting.category = req.body.listing.category;

  savedListing = await newlisting.save();
  console.log(savedListing);
  req.flash("success", "New listing created!");
  res.redirect("/listings");
};


module.exports.showlisting = async (req, res, next) => {
  let { id } = req.params;
  const listening = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listening) {
    req.flash("error", "Listing you requested does not exit");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listening });
};

module.exports.rendereditform = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested does not exit");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
originalImageUrl=originalImageUrl.replace("/upload", "/upload/w_250");
res.render("listings/edit.ejs", { listing ,originalImageUrl});
 
};

module.exports.updatelisting = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
}
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.deletelisting = async (req, res) => {
  let { id } = req.params;
  let deletedlist = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};


module.exports.searchListings = async (req, res) => {
  const { query } = req.query;
  const searchQuery = query
    ? {
        $or: [
          { title: new RegExp(query, "i") },
          { location: new RegExp(query, "i") },
          { country: new RegExp(query, "i") },
          { description: new RegExp(query, "i") },
          { category: new RegExp(query, "i") },
        ],
      }
    : {};

  const listings = await Listing.find(searchQuery);
  res.json(listings);
};
