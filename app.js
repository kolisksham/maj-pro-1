const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const { listingSchema } = require("./schema");

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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res)=>{
    res.send("Root Node, Landing Page");
});

const validateListing = (req, res, next) =>{
    let { error } = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

app.get("/listings", wrapAsync(async (req, res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}));

app.get("/listings/new", wrapAsync(async (req, res)=>{
    res.render("listings/new")
})); 

app.get("/listings/:id", wrapAsync(async (req, res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show", { listing });
}));

app.post("/listings", validateListing, wrapAsync(async ( req, res, next)=>{
    const newListing = new Listing (req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

app.get("/listings/:id/edit", wrapAsync(async( req, res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
}));

app.put("/listings/:id", validateListing, wrapAsync(async( req, res)=>{
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${ id }`);
}));

app.delete("/listings/:id", wrapAsync(async( req, res)=>{
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

app.use((req, res, next)=>{
    next(new ExpressError(404, "Page not found."));
});

app.use((err, req, res, next)=>{
    let { statusCode=500, message="Something went wrong." } = err;
    res.status(statusCode).render("error", {err})
});














































































app.listen(PORT, ()=>{
    console.log(`Server online on Port: ${PORT}`);
});