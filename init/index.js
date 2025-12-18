const mongoose = require("mongoose");
const initData = require("./data.js");
const MONGO_URL = "mongodb://localhost:27017/yoyo";
const Listing = require("../models/listing.js");

async function main() {
    await mongoose.connect(MONGO_URL);
};

const initDB = async () =>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
};

main()
  .then(() => {
    console.log("DB connection Successful!");
    return initDB();
  })
  .then(() => {
    console.log("Data was Initialized");
    return mongoose.disconnect();
  })
  .catch((e) => {
    console.error(e);
  });

