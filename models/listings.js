
const { ref } = require("joi");
const mongoose = require("mongoose");
const Review = require("./reviews.js");

const Schema= mongoose.Schema;

const listingSchema = new Schema({

title: {

type: String,

required: true,
},

description: {
type: String,
},
image: {
    type:String,
    default:"https://media.istockphoto.com/id/1442179368/photo/maldives-island.jpg?s=612x612&w=0&k=20&c=t38FJQ6YhyyZGN91A8tpn3nz9Aqcy_aXolImsOXOZ34=",
set: (v) =>v===""?"https://media.istockphoto.com/id/1442179368/photo/maldives-island.jpg?s=612x612&w=0&k=20&c=t38FJQ6YhyyZGN91A8tpn3nz9Aqcy_aXolImsOXOZ34=":v,
},
price: Number,

location: String,

country: String,
reviews:[
    {
        type: Schema.Types.ObjectId,
        ref: "Review",
    },
],

});
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({
      _id: { $in: listing.reviews }
    });
  }
});


const Listing =mongoose.model("Listing", listingSchema);

module.exports = Listing;

