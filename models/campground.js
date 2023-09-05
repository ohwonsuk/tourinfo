const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// one-many 하나의 캠핑장에 여러개 리뷰 추가 가능 반영
// ref 로 Review 모델의 ObjectId를 참조

const CampgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Reivew",
    },
  ],
});

module.exports = mongoose.model("Campground", CampgroundSchema);
