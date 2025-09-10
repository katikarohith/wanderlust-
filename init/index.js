const mongoose = require("mongoose");
const initdata= require("./data.js");//comming a object
const listing=require("../models/listings.js");
const { insertMany } = require("../models/listings.js");
const MONGOURL ="mongodb://127.0.0.1:27017/wonderlust";
main()
.then(() => { console.log("connected to DB"); })
.catch((err)=>{

console.log(err); });
async function main() {
await mongoose.connect(MONGOURL); } 
const initDB = async () => {
    await listing.deleteMany({});
    await listing.insertMany(initdata.data);
    console.log("data is saved");

};
initDB();