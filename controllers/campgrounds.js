const Tourinfo = require("../models/campground");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");
const { getYmd10 } = require("../utils/dateFormatter");
const { pagingFunc } = require("../utils/pagingFunc");

module.exports.index = async (req, res) => {
  const page = Number(req.query.page);
  console.log("page:", page);
  const totalList = await Tourinfo.countDocuments({});
  console.log(totalList);
  let {
    startPage,
    endPage,
    hideList,
    maxList,
    maxPage,
    totalPage,
    currentPage,
  } = pagingFunc(page, totalList);
  console.log("startPgae:", startPage, "tatalPage:", totalPage);
  const campgrounds = await Tourinfo.find({}).skip(hideList).limit(maxList);

  res.render("campgrounds/index", {
    campgrounds,
    startPage,
    endPage,
    hideList,
    maxList,
    maxPage,
    totalPage,
    currentPage,
  });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res) => {
  console.log("createCampground", req.body);
  if (!req.body.campground)
    throw new ExpressError("Invalid Campground Data", 400);
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.rdnmadr,
      limit: 1,
      language: ["kr"],
    })
    .send();
  const campground = new Tourinfo(req.body.campground);
  campground.geometry = geoData.body.features[0].geometry;
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.author = req.user._id;
  console.log(campground);
  await campground.save();
  req.flash("success", "Successfully made a new campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
  const campground = await Tourinfo.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  console.log(campground);
  if (!campground) {
    req.flash("error", "Cannot find that campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground, getYmd10 }); // 날짜 포맷 변경위해 함수 같이 넘김
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Tourinfo.findById(id);
  if (!campground) {
    req.flash("error", "Cannot find that campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const campground = await Tourinfo.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  // 기존 이미지 파일에 추가하기 위해 전개연산자와 push 이용
  campground.images.push(...imgs);
  await campground.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
    console.log(campground);
  }
  req.flash("success", "Successfully updated campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Tourinfo.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground!");
  res.redirect("/campgrounds");
};

module.exports.searchCampground = async (req, res) => {
  const site = req.query.site;
  console.log(site);
  const campgrounds = await Tourinfo.find({ trrsrtNm: { $in: site } });
  console.log(campgrounds.length);
  if (campgrounds.length > 0) {
    res.render("campgrounds/find", {
      campgrounds,
    });
  } else {
    res.redirect("/campgrounds/?page=1");
  }
};
