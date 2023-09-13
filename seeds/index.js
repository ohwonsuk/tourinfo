const mongoose = require("mongoose");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://127.0.0.1:27017/peter-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "64fedca2da777d13091b78e1",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)}, ${sample(places)}`,
      image: "https://source.unsplash.com/collection/483251",
      description:
        "말 시인의 아무 아침이 까닭입니다. 별빛이 까닭이요, 마디씩 책상을 이름과 듯합니다. 별에도 봄이 둘 하나에 있습니다. 멀리 한 이름을 그리고 멀듯이, 라이너 별이 못 하나에 있습니다. 다하지 한 파란 지나고 다 풀이 위에 봅니다. 다 지나가는 이름과, 이름과, 잔디가 남은 까닭입니다. 어머니, 다하지 시인의 별 별이 이름과, 거외다.",
      price,
    });
    await camp.save();
  }
};

seedDb().then(() => {
  mongoose.connection.close();
});
