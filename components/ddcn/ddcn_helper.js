import { convertInputDateFormat } from "../../helper/uti";
import DiemDanhCaNhan from "../../classes/DiemDanhCaNhan";

//PHẦN NÀY XỬ LÝ PHỤ CHO ĐIỂM DANH CHÍNH
//Xóa phần tử trừng trong mảng theo hocSinhId phục vụ cho thằng bên dưới
export const xoaItemHocSinhTrungTrongMang = (arr) => {
  let objChua = {};
  //Chuyển arr thành obj
  arr.forEach((item) => {
    objChua[item.id] = item.id;
  });
  //Chạy lặp trong obj và xử lý lại thôi
  let arrResult = [];
  for (let key in objChua) {
    const itemFound = arr.find((i) => i.id === key);
    if (itemFound) {
      arrResult.push(itemFound);
    }
  }
  return arrResult;
};
//Support cho comp Diểm danh cá nhân
export const locMangHsDayChinh = (arrLichDayCaNhan, labelThuNgayDiemDanh) => {
  //Lọc lại mảng này theo théu
  let arrLichDayCaNhanByThu = [];
  if (arrLichDayCaNhan.length > 0) {
    arrLichDayCaNhanByThu = arrLichDayCaNhan.filter((item) =>
      item.arrThu.find((i) => i.thu === labelThuNgayDiemDanh)
    );
  }
  //Lấy mảng học trò theo thứ đã lọc thôi
  let arrHocTroDaChon = [];
  if (arrLichDayCaNhanByThu.length > 0) {
    arrLichDayCaNhanByThu.forEach((item) => {
      arrHocTroDaChon = [...item.arrHocSinh, ...arrHocTroDaChon];
    });
  }
  //Thêm isSelected cho mảng
  let arrHocTroDaChonTrue = arrHocTroDaChon.map((item) => {
    return {
      id: item.hocSinhId,
      shortName: item.shortName,
      soPhutHocMotTiet: item.soPhutHocMotTiet,
      isSelected: true,
    };
  });
  //Nếu có học sinh trùng thì xóa
  let arrHocTroDaChonLocTrung =
    xoaItemHocSinhTrungTrongMang(arrHocTroDaChonTrue);
  //Ok thì push thằng này lên ctx chọn người để dùng
  // console.log(arrHocTroDaChonLocTrung);
  return arrHocTroDaChonLocTrung;
};

//Xử lý lấy mảng học sinh tăng cường = học trò của giáo viên - học sinh học chính trong ngày được chọn theo lịch - cái này dùng ban đầu để chọn thôi
export const layMangHsTangCuongDeChon = (
  arrHocSinhChon,
  dataGiaoVienDuocChon
) => {
  //Xử lý lấy màng học trò cá nhân của giáo viên -> lọc lại mảng học sinh không có trong ngày để dạy tăng cường
  let arrHsTangCuong = [];
  if (arrHocSinhChon.length === 0 && dataGiaoVienDuocChon) {
    return dataGiaoVienDuocChon.hocTroCaNhan;
  }
  if (arrHocSinhChon.length > 0 && dataGiaoVienDuocChon) {
    //Mảng học trò
    const arrHocTroCaNhanClone = [...dataGiaoVienDuocChon.hocTroCaNhan];
    //Tạo một obj chứa
    let objChua = {};
    //Chạy lặp 2 mảng bỏ vào objChua, khi này key trùng sẽ tự động được xóa
    arrHocTroCaNhanClone.forEach(
      (hocsinh) => (objChua[hocsinh.hocSinhId] = hocsinh.hocSinhId)
    );
    //Vòng lặp thứ hai nếu key trùng thì xóa key đó di
    arrHocSinhChon.forEach((hschon) => {
      if (objChua[hschon.id] === hschon.id) {
        delete objChua[hschon.id];
      }
    });
    //Chạy vòng lặp obj chưa đề push obj học sinh tăng cường vào mảng chưa thôi
    for (let key in objChua) {
      const indexHocSinhMatched = arrHocTroCaNhanClone.findIndex(
        (hocsinh) => hocsinh.hocSinhId === key
      );
      if (indexHocSinhMatched !== -1) {
        arrHsTangCuong.push(arrHocTroCaNhanClone[indexHocSinhMatched]);
      }
    }
  }
  //Sau cùng là xử lý arrHsTangCuong thêm isSelected
  let arrHocSinhTangCuong = [];
  if (arrHsTangCuong.length > 0) {
    arrHocSinhTangCuong = arrHsTangCuong.map((hocsinh) => {
      return {
        id: hocsinh.hocSinhId,
        shortName: hocsinh.shortName,
        soPhutHocMotTiet: hocsinh.soPhutHocMotTiet,
        isSelected: false,
      };
    });
  }
  return arrHocSinhTangCuong;
};

//Xử lý lấy mảng học sinh tăng cương sau khi chọn để chính thưucs submit
export const layMangHsTangCuongDeSubmit = (
  arrHocSinhTangCuong,
  arrHocSinhTangCuongCtx
) => {
  let arrHsTangCuongDuocChon = arrHocSinhTangCuong;
  if (arrHocSinhTangCuongCtx && arrHocSinhTangCuongCtx.length > 0) {
    arrHsTangCuongDuocChon = arrHocSinhTangCuongCtx;
  }
  //Filter lại học sinh tăng cường được chọn true
  let arrHsTangCuongFinal = arrHsTangCuongDuocChon.filter(
    (hs) => hs.isSelected
  );
  return arrHsTangCuongFinal;
};

//Xử lý lấy 3 mảng cho dataSubmit : arrHsHocChinh,arrHsNghi,arrHsTangCuong
export const lay3MangHsSubmit = (
  arrHocSinhDayChinh,
  arrHocSinhNghi,
  arrHocSinhTangCuong
) => {
  let arrHsHocChinh = [];
  if (arrHocSinhDayChinh) {
    arrHsHocChinh = arrHocSinhDayChinh.map((hs) => {
      return {
        hocSinhId: hs.id,
        shortName: hs.shortName,
        soPhutHocMotTiet: hs.soPhutHocMotTiet,
      };
    });
  }
  let arrHsNghi = [];
  if (arrHocSinhNghi) {
    arrHsNghi = arrHocSinhNghi.map((hs) => {
      return {
        hocSinhId: hs.id,
        shortName: hs.shortName,
        isBu: false,
      };
    });
  }
  let arrHsTangCuong = [];
  if (arrHocSinhTangCuong) {
    arrHsTangCuong = arrHocSinhTangCuong.map((hs) => {
      return {
        hocSinhId: hs.id,
        shortName: hs.shortName,
        soPhutHocMotTiet: hs.soPhutHocMotTiet,
      };
    });
  }
  //Trả
  return {
    arrHsHocChinh,
    arrHsNghi,
    arrHsTangCuong,
  };
};
//Từ 3 mảng trên convert thành obj chính để submit theo cấu trúc obj , ko dùng array lưu db nữa
export const getObjSubmitDiemDanhChinh = (
  arrHsHocChinh,
  arrHsNghi,
  arrHsTangCuong,
  ngayDiemDanh,
  giaoVienChonId,
  dataGiaoVienDuocChon
) => {
  let objResult = {};
  const ngayDdFormat = convertInputDateFormat(ngayDiemDanh);
  const shortNameFormat = dataGiaoVienDuocChon
    ? dataGiaoVienDuocChon.shortName
    : null;
  //Chuỷne data mảng dạy chính
  if (arrHsHocChinh.length > 0) {
    arrHsHocChinh.forEach((item) => {
      objResult[item.hocSinhId] = {
        shortName: item.shortName,
        soPhutHocMotTiet: item.soPhutHocMotTiet,
        type: "dayChinh",
      };
    });
  } //end if dạy chính
  if (arrHsNghi.length > 0) {
    arrHsNghi.forEach((item) => {
      objResult[item.hocSinhId] = {
        shortName: item.shortName,
        type: "nghi",
        heSoHoanTien: 0.7,
      };
    });
  } // end if nghỉ
  if (arrHsTangCuong.length > 0) {
    arrHsTangCuong.forEach((item) => {
      objResult[item.hocSinhId] = {
        shortName: item.shortName,
        soPhutHocMotTiet: item.soPhutHocMotTiet,
        type: "dayTangCuong",
      };
    });
  } //end if tăng cường
  //Tạo instance mới nào
  const ddcnMoi = new DiemDanhCaNhan({
    ngayDiemDanh: ngayDdFormat,
    giaoVienId: giaoVienChonId,
    shortName: shortNameFormat,
  });
  //Trả
  return { instanceDdcnMoi: ddcnMoi, objHocSinhData: objResult };
};

/////////////

//Xử lý lấy mảng giáo viên dạy thế = mảng giáo viên gốc loại giáo viên được chọn ra - Thay bằng class
export const layArrGiaoVienDayThe = (arrGiaoVien, giaoVienChonId) => {
  const arrGiaoVienClone = [...arrGiaoVien];
  if (giaoVienChonId) {
    const indexGiaoVienDaChon = arrGiaoVienClone.findIndex(
      (giaovien) => giaovien.id === giaoVienChonId
    );
    if (indexGiaoVienDaChon !== -1) {
      arrGiaoVienClone.splice(indexGiaoVienDaChon, 1);
    }
  }
  return arrGiaoVienClone;
};

//Xử lý lấy và chọn mảng học sinh nào được render đẻ chọn
export const layArrHocSinhDayThe = (dataGiaoVienDuocChon, arrHocSinhChon) => {
  let arrHocTroCaNhan = [];
  let arrHocTroDayThe = [];
  if (dataGiaoVienDuocChon) {
    arrHocTroCaNhan = dataGiaoVienDuocChon.hocTroCaNhan.map((hocsinh) => {
      return {
        id: hocsinh.hocSinhId,
        shortName: hocsinh.shortName,
        soPhutHocMotTiet: hocsinh.soPhutHocMotTiet,
        isSelected: false,
      };
    });
  }
  if (arrHocSinhChon && arrHocSinhChon.length > 0) {
    arrHocTroCaNhan = arrHocSinhChon;
    const arrHocTroDayTheFilter = arrHocTroCaNhan.filter(
      (hocsinh) => hocsinh.isSelected
    );
    arrHocTroDayThe = arrHocTroDayTheFilter.map((hocsinh) => {
      return {
        hocSinhId: hocsinh.id,
        shortName: hocsinh.shortName,
        soPhutHocMotTiet: hocsinh.soPhutHocMotTiet,
      };
    });
  }
  return { arrHocTroCaNhan, arrHocTroDayThe };
};

//Lấy shortName giáo viên dạy thế - class datahs có rồi
export const layShortNameGiaoVienDayThe = (arrGiaoVien, giaoVienDayTheId) => {
  let giaoVienDayTheShortName = null;
  if (arrGiaoVien) {
    const gvMatched = arrGiaoVien.find(
      (giaovien) => giaovien.id === giaoVienDayTheId
    );
    if (gvMatched) {
      giaoVienDayTheShortName = gvMatched.shortName;
    }
  }
  return giaoVienDayTheShortName;
};

//Lấy obj giáo viên dạy thế để submit
export const getObjSubmitDayThe = (
  arrHocTroDayThe,
  ngayDiemDanh,
  giaoVienChonId,
  giaoVienDayTheId,
  giaoVienDayTheShortName,
  dataGiaoVienDuocChon
) => {
  let objResult = {};
  const ngayDiemDanhFormat = convertInputDateFormat(ngayDiemDanh);
  if (arrHocTroDayThe.length > 0) {
    arrHocTroDayThe.forEach((item) => {
      objResult[item.hocSinhId] = {
        shortName: item.shortName,
        soPhutHocMotTiet: item.soPhutHocMotTiet,
        type: "dayThe",
        giaoVienDayTheId: giaoVienDayTheId,
        giaoVienDayTheShortName: giaoVienDayTheShortName,
      };
    });
  }
  //Tạo instance mới
  const instaceNgayDayTheMoi = new DiemDanhCaNhan({
    ngayDiemDanh: ngayDiemDanhFormat,
    giaoVienId: giaoVienDayTheId ? giaoVienDayTheId : null,
    shortName: giaoVienDayTheShortName ? giaoVienDayTheShortName : null,
  });
  return {
    instaceNgayDayTheMoi: instaceNgayDayTheMoi,
    objHocSinhData: objResult,
  };
};

//PHẦN NÀY CHO THÔNG KÊ GIÁO VIÊN

//Lọc lại mảng theo giáo viên id và this month
export const getArrDdcnByGvNThisMonth = (
  arrDiemDanhCaNhan,
  giaoVienChonId,
  ngayDiemDanh
) => {
  //Lọc lại mảng điểm danh theo giaoVienId được chọn và ngay được chọn
  let arrDiemDanhCaNhanByGvNDate = [];
  //Đầu tiên là lọc lại theo idGiaoVien
  const arrFilterByGiaoVienId = arrDiemDanhCaNhan.filter(
    (item) => item.giaoVienId === giaoVienChonId
  );
  //LỌc tiếp theo tháng đang được chọn
  const curMonth = new Date(ngayDiemDanh).getMonth();
  const arrFilterByThisMonth = arrFilterByGiaoVienId.filter(
    (item) => new Date(item.ngayDiemDanh).getMonth() === curMonth
  );
  if (arrFilterByThisMonth.length > 0) {
    arrDiemDanhCaNhanByGvNDate = arrFilterByThisMonth;
  }
  //Sort lại mảng theo ngày điểm danh
  arrDiemDanhCaNhanByGvNDate.sort((a, b) =>
    new Date(a.ngayDiemDanh) < new Date(b.ngayDiemDanh) ? -1 : 1
  );
  return arrDiemDanhCaNhanByGvNDate;
};

//HELPER CHO TRANG SỬA NGÀY ĐIỂM DÁNH CỦA HOC SINH
export const getDataSubmitSuaNgayDiemDanh = (
  ngayDiemDanhId,
  hocSinhId,
  typeDd,
  timeHocMotTiet,
  gvDayTheId,
  arrGiaoVien,
  gvDayBuId,
  ngayNghiTruocDo,
  ngayDayBu,
  heSoHoanTien,
  shortName
) => {
  //Tổng hợp data submit tùy theo loại điểm danh
  let dataSubmit = {
    ngayDiemDanhId: ngayDiemDanhId,
    hocSinhId: hocSinhId,
    shortName: shortName,
    type: typeDd,
  };
  if (
    typeDd === "dayChinh" ||
    typeDd === "dayTangCuong" ||
    typeDd === "dayThe" ||
    typeDd === "dayBu"
  ) {
    dataSubmit = {
      ...dataSubmit,
      soPhutHocMotTiet: timeHocMotTiet,
    };
  }
  if (typeDd === "dayThe") {
    //Tra cái shortName
    let gvdtShortName = "";
    const gvMatched = arrGiaoVien.find(
      (giaovien) => giaovien.id === gvDayTheId
    );
    if (gvMatched) {
      gvdtShortName = gvMatched.shortName;
    }
    dataSubmit = {
      ...dataSubmit,
      giaoVienDayTheId: gvDayTheId,
      giaoVienDayTheShortName: gvdtShortName ? gvdtShortName : null,
    };
  }
  if (typeDd === "dayBu") {
    //Tra cái shortname
    let gvdbShortname = "";
    const gvMatched = arrGiaoVien.find((giaovien) => giaovien.id === gvDayBuId);
    if (gvMatched) {
      gvdbShortname = gvMatched.shortName;
    }
    dataSubmit = {
      ...dataSubmit,
      giaoVienDayBuId: gvDayBuId,
      giaoVienDayBuShortName: gvdbShortname ? gvdbShortname : null,
      ngayNghiCanBu: ngayNghiTruocDo,
      ngayDayBu: ngayDayBu,
    };
  }
  if (typeDd === "nghi") {
    dataSubmit = {
      ...dataSubmit,
      heSoHoanTien: heSoHoanTien,
    };
  }
  return dataSubmit;
};

//PHÂN NAY THONG KE HOC SINH
export const getArrDataDdcnThangHocSinhRender = (
  arrDdcn,
  ngayLoc,
  hocSinhChonId
) => {
  //Tạo mảng chưa
  let arrResult = [];
  //Thag lọc
  const locMonth = new Date(ngayLoc).getMonth();
  //Lọc theo tháng
  const arrFilterMonth = arrDdcn.filter(
    (item) => new Date(item.ngayDiemDanh).getMonth() === locMonth
  );
  //Lọc theo id học sinh chọn
  const arrFilterByHocSinh = arrFilterMonth.filter((item) =>
    item.hasOwnProperty(hocSinhChonId)
  );
  console.log(hocSinhChonId);
  console.log(arrFilterMonth);
  //Đẩy kết quả
  arrFilterByHocSinh.forEach((item) => {
    arrResult.push({
      ngayDiemDanh: item.ngayDiemDanh,
      gvShortName: item.shortName,
      type: item[hocSinhChonId].type,
      soPhutHocMotTiet: item[hocSinhChonId].soPhutHocMotTiet || null,
    });
  });
  //sort lại theo ngày
  arrResult.sort((a, b) => (new Date(a) < new Date(b) ? -1 : 1));
  return arrResult;
};
