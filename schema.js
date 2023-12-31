const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.campgroundSchema = Joi.object({
  campground: Joi.object({
    trrsrtNm: Joi.string().required().escapeHTML(),
    trrsrtSe: Joi.string().required().escapeHTML(),
    institutionNm: Joi.string().escapeHTML(),
    referenceDate: Joi.string().escapeHTML(),
    addr: Joi.string().required().escapeHTML(),
    city: Joi.string().escapeHTML(),
    trrsrtIntrcn: Joi.string().required().escapeHTML(),
    geocoord: Joi.string().allow(""), // null 값 허용
    homepageURL: Joi.string().allow(""), // null 값 허용
    imageURL: Joi.string().allow(""),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required().escapeHTML(),
  }).required(),
});
