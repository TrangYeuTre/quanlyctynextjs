//Func tạo 42 ngày ban đầu
export const taoInitArr42Ngay = () => {
  //Dummy 42 ô data
  let arrNgay = [];
  for (let i = 0; i < 42; i++) {
    //Xử lý label thứ dựa trên i
    let labelName = "";
    if (i % 7 === 0) {
      labelName = "Mon";
    }
    if (i % 7 === 1) {
      labelName = "Tue";
    }
    if (i % 7 === 2) {
      labelName = "Wed";
    }
    if (i % 7 === 3) {
      labelName = "Thu";
    }
    if (i % 7 === 4) {
      labelName = "Fri";
    }
    if (i % 7 === 5) {
      labelName = "Sat";
    }
    if (i % 7 === 6) {
      labelName = "Sun";
    }
    //Đẩy kq
    arrNgay.push({
      idCell: i,
      label: labelName,
      ngay: "",
      loaiLop: [],
      isActive: false,
    });
  }
  return arrNgay;
};

//Xử lý công thêm một tháng cho ngày đã chọn
export const layThoiGianThangTiepTheo = (ngayChon) => {
  const cur = new Date(ngayChon);
  let curMonth = new Date(cur).getMonth();
  let curYear = new Date(cur).getFullYear();
  let nextMonth, nextYear;
  if (curMonth === 11) {
    nextMonth = 0;
    nextYear = curYear + 1;
  } else {
    nextMonth = curMonth + 1;
    nextYear = curYear;
  }
  const nextTime = new Date(nextYear, nextMonth, 1);
  return nextTime;
};

//Xử lý lấy ngày đầu, ngày cuối và thứ của ngày đầu
export const layNgayCuoiThangVaThuNgayDauThang = (ngayChon) => {
  const now = new Date(ngayChon);
  const nextTime = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const ngayCuoiThang = nextTime.getDate();
  const thuNgayDauThang = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  ).toLocaleString("en-GB", { weekday: "short" });
  //Thêm lấy tên của tháng và năm của tháng sau đã xử lý để render title cho lịch
  const nextMonthTitle = new Date(nextTime).getMonth() + 1;
  const nextYearTitle = new Date(nextTime).getFullYear();
  const title = `${nextMonthTitle}/${nextYearTitle}`;
  return {
    ngayCuoiThang: ngayCuoiThang,
    thuNgayDauThang: thuNgayDauThang,
    title,
  };
};

//Xư lý load lịch theo đúng tháng đầu vào
export const loadLichRender = (
  arrDatesInit,
  ngayCuoiThang,
  thuNgayDauThang
) => {
  if (
    !arrDatesInit ||
    arrDatesInit.length === 0 ||
    !ngayCuoiThang ||
    !thuNgayDauThang
  ) {
    return arrDatesInit;
  }
  //Dựa vào thuNgayDauThang để đánh ngày 1 vào dòng đầu tiên trong mảng lịch init
  let indexFirsDate = null;
  for (let i = 0; i < 7; i++) {
    indexFirsDate = arrDatesInit.findIndex(
      (item) => item.label === thuNgayDauThang
    );
  }
  let ngayDau = 1;
  if (indexFirsDate !== -1) {
    //Xác định ngày cuối tháng
    const lastIndex = +ngayCuoiThang + indexFirsDate;
    //Chạy đánh toàn mảng
    for (let i = indexFirsDate; i < lastIndex; i++) {
      arrDatesInit[i].isActive = true;
      arrDatesInit[i].ngay = ngayDau;
      ngayDau++;
    }
  }
  //Trả
  return arrDatesInit;
};

//Xử lý data từ chọn nhiều ngày apply vào lịch
export const themDataChonNhieuNgayVaoLich = (
  arrDatesRender,
  dataNhieuNgayChon
) => {
  //Clone lại mảng lịch để xử lý và trả kq
  let arrDatesClone = [...arrDatesRender];

  //Từ dataNhieuNgayChon lọc ra các key tương ứng các thứ có value là mảng rỗng
  const arrThuRong = []; // ['Mon','Fri']
  for (const key in dataNhieuNgayChon) {
    if (dataNhieuNgayChon[key].length === 0) {
      arrThuRong.push(key);
    }
  }
  //Chạy lặp reset value cho từng phần tử co thứ trùng với mảng arrThuRong
  arrDatesClone.forEach((item) => {
    const indexMatched = arrThuRong.findIndex(
      (i) => i.toLowerCase() === item.label.toLowerCase()
    );
    if (indexMatched !== -1) {
      item.loaiLop = [];
      // item.heso = 1;
    }
  });
  //Xử lý phần còn lại là các key có value là mảng có data
  for (const key in dataNhieuNgayChon) {
    if (dataNhieuNgayChon[key].length > 0) {
      const thuTarget = key;
      const arrLoaiLop = dataNhieuNgayChon[key];
      //Chạy lap và xử lý thôi
      arrDatesClone.forEach((item) => {
        if (item.label.toLowerCase() === thuTarget.toLowerCase()) {
          item.loaiLop = arrLoaiLop;
        }
      });
    }
  }
  //Trả
  return arrDatesClone;
};

//Xư lý với mảng cuối đã áp data, khi có data của ngày được sửa -> tim và sửa lại ngày đó
export const suaDataNgayTrongLich = (arrDatesWithData, arrDataNgaySua) => {
  const arrClone = [...arrDatesWithData];
  if (!arrDataNgaySua || arrDataNgaySua.length === 0) {
    return arrClone;
  }
  // console.log(arrClone);
  //Chạy loop
  arrDataNgaySua.forEach((objData) => {
    //Trường hợp ở sửa không chọn lớp nào thì clear mảng loaiLop tương ứng
    if (Object.keys(objData).length === 1 && objData.idCell) {
      //Tìm và clear mảng lopHocCuar arrClone
      const itemMatched = arrClone.find(
        (item) => item.idCell === objData.idCell
      );
      if (itemMatched) {
        itemMatched.loaiLop = [];
      }
    } // end if
    //Trường hợp update lại lớp học
    if (Object.keys(objData).length > 1) {
      //Tìm cell tương ứng
      const itemMatched = arrClone.find(
        (item) => item.idCell === objData.idCell
      );
      //Chuyển hóa objData thành mảng loiaj lớp update
      const arrLoaiLopUpdate = [];
      for (const key in objData) {
        if (key.toString() !== "idCell") {
          arrLoaiLopUpdate.push({
            loaiLop: key.toString(),
            heso: objData[key],
          });
        }
      } // end for
      //Update lại thôi
      if (itemMatched) {
        itemMatched.loaiLop = arrLoaiLopUpdate;
      }
    } //end if update lớp học
  });
  //Trả lại mảng clone sau khi xử lý
  return arrClone;
};

//Cb cho hàm bên dưới
const tinhTongNgay = (arrFinal, condition) => {
  let result = 0;
  //Lấy mảng filter có loại lớp cá nhân
  const arrFilterCaNhan = arrFinal.filter(
    (item) =>
      item.isActive &&
      item.loaiLop.length > 0 &&
      item.loaiLop.find((i) => i.loaiLop === condition)
  );
  //Xử lý chỉ lấy obj có loaiLop là cá nhân
  const arrHsCaNhanOnly = [];
  arrFilterCaNhan.forEach((item) => {
    const curArrLoaiLop = item.loaiLop;
    curArrLoaiLop.forEach((i) => {
      if (i.loaiLop === condition) {
        arrHsCaNhanOnly.push(i.heso);
      }
    });
  });
  //Tính tổng
  if (arrHsCaNhanOnly.length > 0) {
    result = arrHsCaNhanOnly.reduce((cv, tong) => cv + tong);
  }
  return result;
};
//Lấy thống kê các lớp học trong lịch
export const layThongKeDataLich = (arrFinal) => {
  const result = { canhan: 0, nhom: 0, donghanh: 0 };
  //TÍnh
  result.canhan = tinhTongNgay(arrFinal, "canhan");
  result.nhom = tinhTongNgay(arrFinal, "nhom");
  result.donghanh = tinhTongNgay(arrFinal, "donghanh");
  //trả
  return result;
};
