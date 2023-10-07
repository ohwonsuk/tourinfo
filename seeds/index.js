const mongoose = require("mongoose");
const sights = require("./sights");
const { descriptors, places } = require("./seedHelpers");
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

const seedDb = async () => {
  await Tourinfo.deleteMany({});
  for (let i = 0; i < 962; i++) {
    const tour = new Tourinfo({
      // your user id
      author: "65210e36192a52f9b19f5e5b",
      trrsrtNm: sights[i].관광지명,
      trrsrtSe: sights[i].관광지구분,
      trrsrtIntrcn: sights[i].관광지소개,
      // 삼항연산으로 도로명주소 없는 경우만 지번주소 사용
      addr: sights[i].소재지도로명주소
        ? sights[i].소재지도로명주소
        : sights[i].소재지지번주소,
      institutionNm: sights[i].관리기관명,
      referenceDate: sights[i].데이터기준일자,
      geometry: {
        type: "Point",
        coordinates: [sights[i].경도, sights[i].위도],
      },
      images: [
        {
          url: "https://res.cloudinary.com/dc2gmdv7u/image/upload/v1695654534/PeterCamp/sqnmilr50vyebvthvxmm.jpg",
          filename: "PeterCamp/sqnmilr50vyebvthvxmm",
        },
        {
          url: "https://res.cloudinary.com/dc2gmdv7u/image/upload/v1695654536/PeterCamp/qvvjigxibrgthrgsdwo0.jpg",
          filename: "PeterCamp/qvvjigxibrgthrgsdwo0",
        },
      ],
    });
    await tour.save();
  }
};

seedDb().then(() => {
  mongoose.connection.close();
});
