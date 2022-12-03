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
