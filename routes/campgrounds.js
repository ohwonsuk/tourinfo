const express = require("express");
const router = express.Router();
const {
  isLoggedIn,
  isAuthor,
  validateCampground,
} = require("../middleware.js");
const campgrounds = require("../controllers/campgrounds.js");
const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");

router.get("/", catchAsync(campgrounds.index));

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(campgrounds.createCampground)
);

// review 불러올 때 여러개 이므로 review 작성자를 같이 불러오기 위해 객체로 작성
router.get("/:id", catchAsync(campgrounds.showCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(campgrounds.updateCampground)
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.deleteCampground)
);

module.exports = router;
