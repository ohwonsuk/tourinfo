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
      req.flash("success", `${username}님 환영합니다.`);
      res.redirect("/campgrounds/?page=1");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

module.exports.renderUserEdit = async (req, res) => {
  const { id } = req.params;
  console.log("renderUserEdit", id);
  const user = await User.findOne({ userid: id });
  console.log("edituser:", user);
  // if (!user) {
  //   req.flash("error", "Cannot find the user");
  //   return res.redirect("/login");
  // }
  res.render("users/useredit", { user });
};

module.exports.updateUser = async (req, res) => {
  try {
    const { userid, email, username, password1, password2 } = req.body;
    console.log("req.body", userid, username, email, password1, password2);
    if (password1 != password2) {
      throw new Error("비밀번호가 일치하지 않습니다.");
    }
    const user = await User.findOne({ userid: userid });
    console.log("user:", user);
    await user.updateOne({
      username: username,
      email: email,
    });
    await user.setPassword(password1);
    console.log("updateuser:", user);
    user.save();
    req.flash("success", "성공적으로 정보가 수정되었습니다.");
    const redirectUrl = res.locals.returnTo || "/campgrounds/?page=1";
    console.log("rediretUrl", redirectUrl);
    res.redirect(redirectUrl);
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/campgrounds/?page=1");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
  console.log("req", req.body);
  req.flash("success", `${req.body.userid}님 반갑습니다.`);
  const redirectUrl = res.locals.returnTo || "/campgrounds/?page=1";
  console.log("rediretUrl", redirectUrl);
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "로그아웃 되었습니다.");
    res.redirect("/campgrounds/?page=1");
  });
};
