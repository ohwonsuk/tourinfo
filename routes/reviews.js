const express = require("express");
// reviews router 적용시 app.js내 campground/:id 값과 reviews.js 내 /:reviewId
// 매개변수 병합을 위해서 mergeParams 설정해야 함
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require("../schema.js");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const Campground = require("../models/campground");
const Review = require("../models/review");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// 리뷰 데이터 삭제하기
// mongodb의 $pull 이용해 campground id 데이터중 reviews 배열의 reviewId 값을 가져옴
router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
