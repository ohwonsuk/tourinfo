const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");

router.get("/register", (req, res) => {
  res.render("users/register");
});

// try, catch 사용해서 mongoose 유효성 오류나올 경우 오류내용표시 및 화면이동
router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registerdUser = await User.register(user, password);
      console.log(registerdUser);
      req.flash("success", "Welcome to Peter Camp");
      res.redirect("/campgrounds");
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("register");
    }
  })
);

module.exports = router;
