const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
  userid: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

// UserSchema에 username, password 를 추가해주는 plugin 사용
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
