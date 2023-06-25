const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");
const Review = require("../models/review");

mongoose
    .connect("mongodb://127.0.0.1:27017/yelpCamp")
    .then(() => {
        console.log("MONGO CONNECTION OPEN!");
    })
    .catch((ERR) => {
        console.log("MONGO CONNECTION ERROR!", ERR);
    });

const db = mongoose.connection;

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    await Review.deleteMany({});

    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: "62b99a87acf074caabffa0b0",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: "https://res.cloudinary.com/dgstiyg5b/image/upload/v1685165780/YelpCamp/qgkg37rgop8cdy2xj7ol.jpg",
                    filename: "YelpCamp/qgkg37rgop8cdy2xj7ol",
                },
                {
                    url: "https://res.cloudinary.com/dgstiyg5b/image/upload/v1685165781/YelpCamp/l83r5jvfofkd5ffcav54.jpg",
                    filename: "YelpCamp/l83r5jvfofkd5ffcav54",
                },
            ],
            description:
                "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam provident sequi nihila voluptates similique saepe nostrum deserunt eaque autem dignissimos dolor, velit nesciunt laborum, deleniti sed aspernatur enim. Dolores.",
            price,
        });
        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});
