const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campground");

mongoose
    .connect("mongodb://localhost:27017/yelpCamp")
    .then(() => {
        console.log("MONGO CONNECTION OPEN!");
    })
    .catch((ERR) => {
        console.log("MONGO CONNECTION ERROR!", ERR);
    });

const app = express();
const db = mongoose.connection;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/makecampground", async (req, res) => {
    const camp = new Campground({
        title: "Big boba park",
        description: "u are StYpId",
    });
    await camp.save();
    res.send(camp);
});

app.listen(3000, () => {
    console.log("Serving on port 3000");
});
