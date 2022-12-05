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

//Xử lý từ mảng ddcn tháng trước lấy về , chuyển thành thông tin cần đê tính
export const xuLyLayThongTinDdcnThangTruoc = (
  arrIn,
  hocSinhId,
  hocPhiCaNhan
) => {
  if (!arrIn || arrIn.length === 0 || !hocSinhId || !hocPhiCaNhan) {
    return {};
  }
  //Chạy lặp
  //Tạo một mảng chứa
  let arrHandler = [];
  //Xử lý đầu tiên là tìm theo id của học sinh
  arrIn.forEach((item) => {
    if (item[hocSinhId]) {
      arrHandler.push({
        ...item[hocSinhId],
        hocSinhId: hocSinhId,
        ngayDiemDanh: item.ngayDiemDanh,
      });
    }
  });
  //Cuối cùng là filter lại 3 mảng riêng biệt
  let arrNghiKhongBu = [];
  let arrNghiCoBu = [];
  let arrTangCuong = [];
  if (arrHandler.length > 0) {
    arrNghiKhongBu = arrHandler.filter((item) => item.type === "nghi");
    arrNghiCoBu = arrHandler.filter((item) => item.type === "nghi dayBu");
    arrTangCuong = arrHandler.filter((item) => item.type === "dayTangCuong");
  }
  //Tính toán ngày
  let tongNgayNghiKhongBu = arrNghiKhongBu.length;
  // let tongNgayNghiCoBu = arrNghiCoBu.length;
  let tongNgayTangCuong = arrTangCuong.length;

  //Tính tiền
  const tienNghiKhongBu = tongNgayNghiKhongBu * hocPhiCaNhan;
  // const tienNghiCoBu = tongNgayNghiCoBu * hocPhiCaNhan;
  const tienTangCuong = tongNgayTangCuong * hocPhiCaNhan;
  //Trả thôi
  return {
    arrNghiKhongBu,
    arrNghiCoBu,
    arrTangCuong,
    // tongNgayNghiCoBu,
    tongNgayNghiKhongBu,
    tongNgayTangCuong,
    tienNghiKhongBu,
    tienTangCuong,
  };
};
