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
    return {
      arrNghiKhongBuCoPhep: [],
      arrNghiKhongBuKoPhep: [],
      arrNghiCoBu: [],
      arrTangCuong: [],
      tongNgayNghiCoBu: 0,
      tongNgayTangCuong: 0,
      tienNghiCoBu: 0,
      tienNghiKhongBuCoPhep: 0,
      tienNghiKhongBuKoPhep: 0,
      tienTangCuong: 0,
    };
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
  let arrNghiKhongBuCoPhep = [];
  let arrNghiKhongBuKoPhep = [];
  let arrNghiCoBu = [];
  let arrTangCuong = [];
  if (arrHandler.length > 0) {
    arrNghiKhongBuCoPhep = arrHandler.filter(
      (item) => item.type === "nghi" && +item.heSoHoanTien === 1
    );
    arrNghiKhongBuKoPhep = arrHandler.filter(
      (item) => item.type === "nghi" && +item.heSoHoanTien !== 1
    );

    arrNghiCoBu = arrHandler.filter((item) => item.type === "nghi dayBu");
    arrTangCuong = arrHandler.filter((item) => item.type === "dayTangCuong");
  }
  //Tính toán ngày
  let tongNgayNghiCoBu = arrNghiCoBu.length;
  let tongNgayTangCuong = arrTangCuong.length;
  let tongNgayNghiKhongBuCoPhep = arrNghiKhongBuCoPhep.length;

  //Tính tiền
  const tienNghiCoBu = tongNgayNghiCoBu * hocPhiCaNhan;
  const tienTangCuong = tongNgayTangCuong * hocPhiCaNhan;
  const tienNghiKhongBuCoPhep = tongNgayNghiKhongBuCoPhep * hocPhiCaNhan;
  let tienNghiKhongBuKoPhep = 0;
  if (arrNghiKhongBuKoPhep.length > 0) {
    arrNghiKhongBuKoPhep.forEach(
      (item) => (tienNghiKhongBuKoPhep += item.heSoHoanTien * hocPhiCaNhan)
    );
  }
  //Trả thôi
  return {
    arrNghiKhongBuCoPhep,
    arrNghiKhongBuKoPhep,
    arrNghiCoBu,
    arrTangCuong,
    tongNgayNghiCoBu,
    tongNgayTangCuong,
    tienNghiCoBu,
    tienNghiKhongBuCoPhep,
    tienNghiKhongBuKoPhep,
    tienTangCuong,
  };
};

//Xử lý chuyển tháng chọn dạng 11/2022 về dạng dùng được đugns chuẩn js yyyy-mm-dd
export const chuyenThangViewThanhNgay = (thangView) => {
  if (!thangView) {
    return;
  }
  const arrSplit = thangView.split("/");
  return `${arrSplit[1]}-${arrSplit[0]}-01`;
};
