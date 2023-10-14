const express = require("express");
const router = express.Router();
const {
  isLoggedIn,
  isAuthor,
  validateCampground,
} = require("../middleware.js");
const campgrounds = require("../controllers/campgrounds.js");
const Tourinfo = require("../models/campground");
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

// route를 이용해 동일 경로의 method를 묶을 수 있음
router
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.createCampground)
  );

router.get("/new", isLoggedIn, catchAsync(campgrounds.renderNewForm));
router.get("/search", catchAsync(campgrounds.searchCampground));

router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

module.exports = router;
