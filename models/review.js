const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 캠핑장 리뷰 모델 등록, 연결된 캠핑장을 ref로 반영하지 않음

const reviewSchema = new Schema({
  body: String,
  rating: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Review", reviewSchema);
