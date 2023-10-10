const Tourinfo = require("../models/campground");

export const pagingController = async (req, res) => {
  const { page } = req.query; // (1)
  try {
    const totalPost = await Tourinfo.countDocuments({}); // (2)
    if (!totalPost) {
      // (3)
      throw Error();
    }
    let { startPage, endPage, hidePost, maxPost, totalPage, currentPage } =
      pagingFunc(page, totalPost); // (4)
    const board = await Tourinfo.find({}) // (5)
      .sort({ createAt: -1 })
      .skip(hidePost)
      .limit(maxPost);
    res.render("home", {
      // (6)
      board,
      currentPage,
      startPage,
      endPage,
      maxPost,
      totalPage,
    });
  } catch (error) {
    res.render("home", { board: [] }); // (7)
  }
};
