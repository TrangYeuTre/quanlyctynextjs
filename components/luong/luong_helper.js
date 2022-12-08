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

//Chuyển màng ddcn của giáo viên thành mảng tính lương cá nhân
export const layDataLuongCaNhanTuArrDdcn = (arrDdcn) => {
  let handler1 = [];

  if (!arrDdcn || arrDdcn.length === 0) {
    return handler1;
  }
  //Chạy lặp mảng đầu vào
  arrDdcn.forEach((item) => {
    //Chạy lặp obj item để đẩy prop hocSinhId chuỗi và data phụ vào mảng chưa
    for (const key in item) {
      if (key.length === 24) {
        handler1.push({
          hocSinhId: key,
          shortName: item[key].shortName,
          type: item[key].type,
          soPhutHocMotTiet: +item[key].soPhutHocMotTiet,
          ngayHoc: item.ngayDiemDanh,
        });
      }
    } // end for
  }); //end forEach
  //Từ mảng handler 1 lọc ra mảng chỉ có học sinh id để lấy ds học sinh render
  let listHocSinhId = [];
  if (handler1.length > 0) {
    //Đầu tiên là filter lại mang chỉ chứa id
    const arrHsId = handler1.map((item) => item.hocSinhId);
    //Xóa id trùng
    listHocSinhId = [...new Set(arrHsId)];
  }

  //Xử lý thống kê theo từng học sinh
  let result = [];
  if (listHocSinhId.length > 0) {
    listHocSinhId.forEach((hocSinhId) => {
      //Filter lại data theo id này
      const arrDataFilter = handler1.filter(
        (item) => item.hocSinhId === hocSinhId
      );
      //Tìm shortName tương ứng
      const shortNameFound =
        handler1.find((item) => item.hocSinhId === hocSinhId).shortName || "";
      //Tạo obj data
      let dataHsNay = {
        hocSinhId: hocSinhId,
        shortName: shortNameFound,
        arrNgayHoc: [],
        heSoTinh: 0,
        tongPhut: 0,
        gioTinh: 0,
        thanhTien: 0,
      };
      //Lặp push data ngày học
      arrDataFilter.forEach((item) => {
        dataHsNay.arrNgayHoc.push({
          ngayHoc: item.ngayHoc,
          soPhutHocMotTiet: +item.soPhutHocMotTiet,
          type: item.type,
        });
      });
      //Push obj data học sinh anyf vào mảng kq
      result.push(dataHsNay);
    });
  }
  return result;
};

//Chạy tính lại mảng data Luong Cá nhân khi có thay đổi
export const tinhLaiArrLuongCaNhan = (arrLuongCaNhanIn, luongCaNhan) => {
  const luongCn = +luongCaNhan || 0;

  //Chạy lăp để tính tổng số phút học của học sinh
  if (arrLuongCaNhanIn.length > 0) {
    arrLuongCaNhanIn.forEach((item) => {
      const curArrNgayHoc = item.arrNgayHoc;
      const arrSoPhut = curArrNgayHoc.map((item) => {
        if (!isNaN(item.soPhutHocMotTiet)) {
          return +item.soPhutHocMotTiet;
        } else {
          return 0;
        }
      });
      if (arrSoPhut.length > 0) {
        const tongPhutTinh = arrSoPhut.reduce((cv, tong) => cv + tong);
        item.tongPhut = tongPhutTinh;
      }
    });
  }
  //Chạy lăp để tính số giờ và thành tiền
  if (arrLuongCaNhanIn.length > 0) {
    arrLuongCaNhanIn.forEach((item) => {
      item.gioTinh = (+item.tongPhut / +item.heSoTinh).toFixed(2);
      item.thanhTien = item.gioTinh * luongCn;
    });
  }
  //Trả
  return arrLuongCaNhanIn;
};

//Láy style ngày học thuộc loại nào tương ứng
export const layStyleNgayHocLuongCaNhan = (ngayhoc, classes) => {
  if (ngayhoc.type === "dayChinh") {
    return classes.hocChinh;
  }
  if (ngayhoc.type === "dayThe") {
    return classes.hocThe;
  }
  if (ngayhoc.type === "dayTangCuong") {
    return classes.hocTangCuong;
  }
  if (ngayhoc.type === "nghi dayBu") {
    return classes.hocBu;
  }
  if (ngayhoc.type === "nghi") {
    return classes.hocNghi;
  }
};
