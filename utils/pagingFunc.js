module.exports.pagingFunc = (page, totalList) => {
  const maxList = 20; // (1) 표출할 최대 갯수
  const maxPage = 10; // (2) 최대 페이지 갯수
  let currentPage = page ? parseInt(page) : 1; // (3) 쿼리 페이지 수 가져오기
  const hideList = page === 1 ? 0 : (page - 1) * maxList; // (4) DB에서 제외하고 불러올 리스트 갯수
  const totalPage = Math.ceil(totalList / maxList); // (5) 총 페이징해야할 페이지 수

  if (currentPage > totalPage) {
    // (6)
    currentPage = totalPage;
  }

  const startPage = Math.floor((currentPage - 1) / maxPage) * maxPage + 1; // (7)
  let endPage = startPage + maxPage - 1; // (8)

  if (endPage > totalPage) {
    // (9)
    endPage = totalPage;
  }
  console.log("maxPage:", maxPage);
  return {
    startPage,
    endPage,
    hideList,
    maxList,
    maxPage,
    totalPage,
    currentPage,
  }; // (10)
};
