const mongoose = require("mongoose");
const path = require("path");
const initdata = require("./data.js");
const listing = require("../models/listings.js");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
}

const dbUrl = process.env.MONGO_URL;

if (!dbUrl) {
  console.error("Error: MONGO_URL not defined in .env");
  process.exit(1);
}

async function main() {
  try {
    await mongoose.connect(dbUrl);
    console.log(" Connected to DB");
    await initDB();
  } catch (err) {
    console.error("❌ DB connection error:", err);
  }
}

const initDB = async () => {
  await listing.deleteMany({});
  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: "68f880f5f30f45fbc804442e",
  }));
  await listing.insertMany(initdata.data);
  console.log(" Data is saved");
};

main();
