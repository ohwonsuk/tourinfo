const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const users = require("../controllers/users");
const { storeReturnTo, isLoggedIn } = require("../middleware");

router
  .route("/register")
  .get(users.renderRegister)
  .post(catchAsync(users.register));

router
  .route("/:userid")
  .get(isLoggedIn, catchAsync(users.renderUserEdit))
  .put(catchAsync(users.updateUser));
// .delete(isLoggedIn, isAuthor, catchAsync(users.deleteCampground));

// router.get("/:userid/edit", isLoggedIn, catchAsync(user.renderUserEdit));

router
  .route("/login")
  .get(users.renderLogin)
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login
  );

router.get("/logout", users.logout);

module.exports = router;
