module.exports.getYmd10 = (d) => {
  //yyyy-mm-dd 포맷 날짜 생성
  var d = new Date();
  return (
    d.getFullYear() +
    "-" +
    (d.getMonth() + 1 > 9
      ? (d.getMonth() + 1).toString()
      : "0" + (d.getMonth() + 1)) +
    "-" +
    (d.getDate() > 9 ? d.getDate().toString() : "0" + d.getDate().toString()) +
    " " +
    (d.getHours() > 9
      ? d.getHours().toString()
      : "0" + d.getHours().toString()) +
    "시"
  );
};
