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
    user
      .updateOne({
        username: username,
        email: email,
        password: password1,
      })
      .then(() => {
        user.save();
        req.flash("success", "Successfully updated user!");
        res.redirect("/campgrounds/?page=1");
      });
    // const registerdUser = await User.register(user, password1);
    // req.login(registerdUser, (err) => {
    //   if (err) return next(err);
    //   req.flash("success", "Successfully updated user!");
    //   res.redirect("/campgrounds/?page=1");
    // });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/campgrounds/?page=1");
  }
};
//   const { userid } = req.params;
//   const { username, password1 } = req.body;
//   console.log("id", userid);
//   console.log("updateUser", req.body);
//   const user = await User.findByIdAndUpdate(userid, {
//     username,
//     password1,
//   });
//   await user.save();
//   req.flash("success", "Successfully updated user!");
//   res.redirect(`/campgrounds/page=1`);
// };

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
