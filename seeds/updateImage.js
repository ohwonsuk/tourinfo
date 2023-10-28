const mongoose = require("mongoose");
const sights = require("./sights");
const gallery = require("./gallery");
const Tourinfo = require("../models/campground");

mongoose.connect("mongodb://127.0.0.1:27017/tourinfo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

// const sample = (array) => array[Math.floor(Math.random() * array.length)];

const updateDb = async () => {
  // await Tourinfo.deleteMany({});
  for (let i = 0; i < 5304; i++) {
    const query = { trrsrtNm: gallery[i].galTitle };
    console.log("query", query);
    const tourfind = await Tourinfo.findOne(query);
    console.log("tourfind", tourfind);

    if (tourfind) {
      // const tour = await Tourinfo.findById({ id: tourfind._id });
      console.log("galleryimageurl:", gallery[i].galWebImageUrl);
      tourfind.images[0].url = gallery[i].galWebImageUrl;
      console.log("tourimage", tourfind.images[0].url);
      await tourfind.save();
    }
  }
};

updateDb().then(() => {
  mongoose.connection.close();
});
