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
