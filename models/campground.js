const mongoose = require("mongoose");
const Review = require("./review");
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
      ref: "Review",
    },
  ],
});

// 캠핑장 삭제시 등록된 리뷰도 같이 삭제하기 위한 미들웨어 사용
CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
