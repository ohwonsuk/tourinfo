// passport 메소드 isAuthenticated 이용 로그인시에만 신규 캠핑장 입력 조건 적용

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // console.log(req.path, req.originalUrl);
    req.session.returnTo = req.originalUrl;
    // console.log("returnTo", req.session.returnTo);
    req.flash("error", "you must be signed in first");
    return res.redirect("/login");
  }
  next();
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
    console.log(res.locals.returnTo);
  }
  next();
};
