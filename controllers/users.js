const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

module.exports.register = async (req, res) => {
  try {
    const { userid, email, username, password1, password2 } = req.body;
    console.log("req.body", username, password1, password2);
    if (password1 != password2) {
      throw new Error("비밀번호가 일치하지 않습니다.");
    }
    const user = new User({ userid, email, username });
    const registerdUser = await User.register(user, password1);
    req.login(registerdUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Tourinfo");
      res.redirect("/campgrounds/?page=1");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome back!");
  const redirectUrl = res.locals.returnTo || "/campgrounds/?page=1";
  console.log("rediretUrl", redirectUrl);
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds/?page=1");
  });
};
