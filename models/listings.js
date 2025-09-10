
const mongoose = require("mongoose");

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

});

const Listing =mongoose.model("Listing", listingSchema);

module.exports = Listing;

