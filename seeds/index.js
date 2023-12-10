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

const seedDb = async () => {
  await Tourinfo.deleteMany({});
  for (let i = 0; i < 962; i++) {
    const tour = new Tourinfo({
      // your user id
      author: "656dd9f88177595b554387f3",
      trrsrtNm: sights[i].관광지명,
      trrsrtSe: sights[i].관광지구분,
      trrsrtIntrcn: sights[i].관광지소개,
      // 삼항연산으로 도로명주소 없는 경우만 지번주소 사용
      addr: sights[i].소재지도로명주소
        ? sights[i].소재지도로명주소
        : sights[i].소재지지번주소,
      city: sights[i].소재지도로명주소
        ? sights[i].소재지도로명주소.split(" ")[0]
        : sights[i].소재지지번주소.split(" ")[0],
      institutionNm: sights[i].관리기관명,
      referenceDate: sights[i].데이터기준일자,
      geometry: {
        type: "Point",
        coordinates: [sights[i].경도, sights[i].위도],
      },
      images: [
        {
          url: "https://res.cloudinary.com/dc2gmdv7u/image/upload/v1702194458/PeterCamp/tourinfologo_f9mf2a.png",
          filename: "tourinfologo_f9mf2a",
        },
      ],
      itemSource: "전국관광지정보표준데이터",
    });
    await tour.save();
  }
};

seedDb().then(() => {
  mongoose.connection.close();
});
