const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing");

const PORT = 8080
const MONGO_URL = "mongodb://localhost:27017/yoyo";

const app = express();

main()
    .then(()=>{
        console.log("DB connection Successful!");
    }).catch((e)=>{
        console.log(e)
    });

async function main() {
    await mongoose.connect(MONGO_URL);
};

app.get("/", (req, res)=>{
    res.send("Root Node, Landing Page");
});

app.get("/listings", async (req, res)=>{
    await Listing.find({}).then((res)=>{
        console.log(res);
    });
});















































































app.listen(PORT, ()=>{
    console.log(`Server online on Port: ${PORT}`);
});