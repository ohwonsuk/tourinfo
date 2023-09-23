if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

console.log(process.env.SECRET);
console.log(process.env.API_KEY);

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const { campgroundSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const passort = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const userRoutes = require("./routes/users.js");
const campgroundRoutes = require("./routes/campgrounds.js");
const reviewRoutes = require("./routes/reviews.js");

mongoose.connect("mongodb://127.0.0.1:27017/peter-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sesseionConfig = {
  secret: "thisshouldbeabetterseceret!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sesseionConfig));
app.use(flash());

app.use(passort.initialize());
app.use(passort.session());
passort.use(new LocalStrategy(User.authenticate()));

passort.serializeUser(User.serializeUser());
passort.deserializeUser(User.deserializeUser());

// req.locals 요청-응답 사이클에서 데이터를 애플리케이션에 전달할 수 있는 오브젝트로
// 이 오브젝트로 저장된 변수는 템플릿 및 다른 미들웨어 함수가 접근할 수 있음.
// req.user에는 passort에서 지원 : 사용자 id, username, email 객체정보 전달됨.
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) message = "Oh no, Something went wrong!";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
