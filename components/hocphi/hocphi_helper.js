//Func lấy lại mảng học sinh chọn render sau khi xử lý search shortname
export const layArrHocSinhRender = (keySearch, arrHocSinh) => {
  if (!keySearch || keySearch === "") {
    return arrHocSinh;
  }
  let arrResult = [];
  arrResult = arrHocSinh.filter((hocsinh) =>
    hocsinh.shortName.toLowerCase().includes(keySearch.toLowerCase())
  );
  return arrResult;
};

//Lấy thông tin học phí cá nhân và nhóm của hs để tính phí
export const layHocPhiCaNhanNhomCuaHocSinh = (arrHocSinh, hocSinhChonId) => {
  let result = { hpCaNhan: 0, hpNhom: 0 };
  const hsMatched = arrHocSinh.find((item) => item.id === hocSinhChonId);
  if (hsMatched) {
    result.hpCaNhan = hsMatched.hocPhiCaNhan;
    result.hpNhom = hsMatched.hocPhiNhom;
  }
  return result;
};

//Tra id học sinh để lấy thông tin cơ bản
export const layThongTinHocSinhTuId = (arrHocSinh, hocSinhId) => {
  let result = { shortName: "" };
  const hsMatched = arrHocSinh.find((item) => item.id === hocSinhId);
  if (hsMatched) {
    result.shortName = hsMatched.shortName;
  }
  return result;
};

//Convert ngày về dạng view 11/11/1111
export const chuyenNgayView = (date) => {
  return new Date(date).toLocaleString("en-GB", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
};
