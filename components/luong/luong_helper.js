//Từ id giaos viên và ârrGiaoVien đầu vào tra ra thông tin cơ bản của giáo viên được chọn
export const layDataGiaoVienDuocChon = (arrGiaoVien, giaoVienChonId) => {
  //Tạo những thông tin cần lấy
  let shortName = "";
  let luongCaNhan = 0;
  let luongNhom = 0;
  //Xử lý tìm
  const giaoVienMatched = arrGiaoVien.find(
    (giaovien) => giaovien.id === giaoVienChonId
  );
  if (giaoVienMatched) {
    shortName = giaoVienMatched.shortName;
    luongCaNhan = +giaoVienMatched.luongCaNhan;
    luongNhom = +giaoVienMatched.luongNhom;
  }
  return {
    shortName,
    luongCaNhan,
    luongNhom,
  };
};

//Convert ngày về dạng view 11/11/1111
export const chuyenNgayView = (date) => {
  return new Date(date).toLocaleString("en-GB", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
};
