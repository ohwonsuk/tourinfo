const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

// https://res.cloudinary.com/dc2gmdv7u/image/upload/w_100/v1695516931/PeterCamp/cml5ugsulnmceo26gz8m.jpg

// one-many 하나의 캠핑장에 여러개 리뷰 추가 가능 반영
// ref 로 Review 모델의 ObjectId를 참조

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const opts = { toJSON: { virtuals: true } };

const TourinfoSchema = new Schema(
  {
    trrsrtNm: String, // 관광지명
    trrsrtSe: {
      type: String,
      enum: ["관광지", "관광단지", "축제행사", "음식점", "숙박"],
    }, // 관광지구분
    images: [ImageSchema], // 사용자 등록 이미지
    imageURL: String, // 외부 이미지 사용 (23/12/4)
    homepageURL: String, // 업소 소개 웹페이지 (23/12/4)
    geocoord: String,
    geometry: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ["Point"], // 'location.type' must be 'Point'
        // required: true,
      },
      coordinates: {
        type: [Number],
        // required: true,
      },
    },
    city: String, // 시도
    addr: String, // 소재지주소
    ar: Number, // 면적
    cnvnncFclty: String, // 공공편익시설정보
    stayngInfo: String, // 숙박시설정보
    mvmAmsmtFclty: String, // 운동및오락시설정보
    recrtClturFclty: String, // 휴양및문화시설정보
    hospitalityFclty: String, // 접객시설정보
    sportFclty: String, // 지원시설정보
    appnDate: Date, // 지정일자
    aceptncCo: Number, // 수용인원
    prkplceCo: Number, // 주차가능수
    trrsrtIntrcn: String, // 관광지소개
    phoneNumber: String, // 관리기관전화번호
    institutionNm: String, // 관리기관명
    referenceDate: String, // 데이터기준일자
    instt_code: String, // 관리기관코드
    itemSource: String, // 정보원천 (23/12/4)
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);

TourinfoSchema.virtual("properties.popUpMarkup").get(function () {
  return `<strong><a href="/campgrounds/${
    this._id
  }">${this.trrsrtNm}</a><strong>
  <p>${this.trrsrtIntrcn.substring(0, 20)}...</p>`;
});

// 캠핑장 삭제시 등록된 리뷰도 같이 삭제하기 위한 미들웨어 사용
// 삭제한 데이터를 문서 형태로 전달함
TourinfoSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Tourinfo", TourinfoSchema);
