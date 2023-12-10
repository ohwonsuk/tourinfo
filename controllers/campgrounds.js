const Tourinfo = require("../models/campground");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const openWeatherToken = process.env.OPENWEATHER_API;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");
const { getYmd10 } = require("../utils/dateFormatter");
const { pagingFunc } = require("../utils/pagingFunc");

const categories = ["관광지", "관광단지", "축제행사", "음식점", "숙박"];

const cities = [
  "서울특별시",
  "부산광역시",
  "인천광역시",
  "대구광역시",
  "대전광역시",
  "광주광역시",
  "울산광역시",
  "경기도",
  "제주특별자치도",
  "경상북도",
  "경상남도",
  "충청북도",
  "충청남도",
  "전라북도",
  "전라남도",
  "강원특별자치도",
];

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
  console.log(
    "startPgae:",
    startPage,
    "tatalPage:",
    totalPage,
    "currentPage:",
    currentPage
  );
  const campgrounds = await Tourinfo.find({}).skip(hideList).limit(maxList);
  const campgroundsAll = await Tourinfo.find({});

  res.render("campgrounds/index", {
    campgrounds,
    campgroundsAll,
    cities,
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
  // console.log("renderNewForm", req.user);
  res.render("campgrounds/new", { cities, categories });
};

module.exports.createCampground = async (req, res) => {
  console.log("createCampground", req.body);
  if (!req.body.campground)
    throw new ExpressError("Invalid Campground Data", 400);
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.addr,
      limit: 1,
      language: ["kr"],
    })
    .send();
  // console.log("geoData", geoData.body.features[0].geometry);

  // 지도에서 입력받은 좌표값을 소숫점 6자리 숫자 배열로 전환
  // console.log("geocoord", req.body.campground.geocoord);
  const geoCoord = req.body.campground.geocoord
    .split(",")
    .map((i) => Number(i).toFixed(6));
  const newGeoCoord = geoCoord.map((i) => Number(i));
  console.log("geoCoord", newGeoCoord);
  // console.log("geoCoordtype", typeof newGeoCoord[0]);
  const mapGeoData = {
    type: "Point",
    coordinates: newGeoCoord,
  };
  console.log("mapGeoData", mapGeoData);
  const campground = new Tourinfo(req.body.campground);

  // 지도로 입력한 좌표를 우선적용
  if (newGeoCoord.length > 0) {
    campground.geometry = mapGeoData;
  } else {
    campground.geometry = geoData.body.features[0].geometry;
  }
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.author = req.user._id;
  console.log("createCampground", campground);
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
  console.log("showCampground", campground);
  const lat = campground.geometry.coordinates[1];
  const lon = campground.geometry.coordinates[0];

  // show page에 표출할 이미지 목록을 리스트로 저장하기
  // imageURL 과 사용자 등록한 image 전체를 합침
  const imageList = [];
  if (campground.imageURL) {
    imageList.push(campground.imageURL);
    campground.images.forEach((img, i) => {
      imageList.push(img.url);
    });
  } else {
    campground.images.forEach((img, i) => {
      imageList.push(img.url);
    });
  }
  console.log("imageList", imageList);

  // openweather api 통해서 관광지위치의 현재 날씨정보 불러오기, units ℃ 표시
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherToken}&lang=kr&units=metric`
  );
  const data = await response.json();
  const currTemp = Math.round(data.main.temp * 10) / 10;
  const weatherType = data.weather[0].description;
  const currTime = getYmd10(data.dt);
  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  console.log("weather:", data);
  console.log("temp:", currTemp);
  console.log("날씨:", weatherType);
  console.log("기준시간:", getYmd10(data.dt));
  console.log("아이콘", iconUrl);

  if (!campground) {
    req.flash("error", "Cannot find that campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", {
    campground,
    imageList,
    weatherType,
    currTemp,
    currTime,
    iconUrl,
    getYmd10,
  }); // 날짜 포맷 변경위해 함수 같이 넘김
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  console.log("renderEditForm", req.params);
  const campground = await Tourinfo.findById(id);
  if (!campground) {
    req.flash("error", "Cannot find that campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground, cities, categories });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  console.log("id", req.params);
  console.log("updateCampground", req.body);
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
    console.log("updateCampground-save:", campground);
  }
  req.flash("success", "Successfully updated campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Tourinfo.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground!");
  res.redirect("/campgrounds/?page=1");
};

module.exports.searchCampground = async (req, res) => {
  const site = req.query.site;
  console.log("검색명칭", site);
  const campgrounds = await Tourinfo.find({ trrsrtNm: { $regex: site } });
  console.log(campgrounds);
  if (campgrounds.length > 0) {
    res.render("campgrounds/find", {
      campgrounds,
      cities,
    });
  } else {
    res.redirect("/campgrounds/?page=1");
  }
};

module.exports.cityFindCampground = async (req, res) => {
  const city = req.query.city;
  console.log("지역선택", city);
  const campgrounds = await Tourinfo.find({ city: { $in: city } });
  console.log(campgrounds.length);
  if (campgrounds.length > 0) {
    res.render("campgrounds/find", {
      campgrounds,
      cities,
    });
  } else {
    res.redirect("/campgrounds/?page=1");
  }
};
