//Sort lại mảng theo phần tên của shortname
export const sortArtByLastShortName = (arrIn) => {
  let arrClone = [...arrIn];
  //Xử lý lấy phần tên thôi
  let arrLastName = [];
  for (let i = 0; i < arrClone.length; i++) {
    //Xử lý tách phần tên của item
    const curItem = arrClone[i].shortName.trim();
    const curItemId = arrClone[i].id;
    const arrNameSplit = curItem.split(" ");
    const lastName = arrNameSplit[arrNameSplit.length - 1];
    arrLastName.push({ name: lastName.toLowerCase(), id: curItemId });
  }
  //sort lại mảng phần tên
  let arrLastNameSorted = arrLastName.sort((a, b) =>
    a.name < b.name ? -1 : 1
  );
  //Dựa vào mảng sort này tìm trong mảng full và đẩy vào mảng kết quả theo thứ tự
  let arrResult = [];
  for (let j = 0; j < arrLastNameSorted.length; j++) {
    const curId = arrLastNameSorted[j].id;
    //Tìm
    const indexItemMatched = arrClone.findIndex((item) => item.id === curId);
    if (indexItemMatched !== -1) {
      //Tìm thấy thì xử lý đẩy vào mảng kết quả
      arrResult.push(arrClone[indexItemMatched]);
      //Đẩy xong thì xóa nó đi ở mảng item để tránh trường hợp tên trung
      arrClone.splice(indexItemMatched, 1);
    }
  } //end for
  return arrResult;
};

//Conver ngày về định dạng đúng đẻ có thể truyền vào input value làm value
export const convertInputDateFormat = (dateIn) => {
  const newDate = new Date(dateIn);
  let date = newDate.getDate();
  if (date.toString().length === 1) {
    date = `0${date}`;
  }
  let month = newDate.getMonth() + 1;
  if (month.toString().length === 1) {
    month = `0${month}`;
  }
  const newDateFormat = `${newDate.getFullYear()}-${month}-${date}`;
  return newDateFormat;
};

//Lấy thứ từ ngày
export const layTenThuTuNgay = (dateIn) => {
  const objTen = {
    Mon: "Hai",
    Tue: "Ba",
    Wed: "Tư",
    Thu: "Năm",
    Fri: "Sáu",
    Sat: "Bảy",
    Sun: "Cn",
  };
  const result = new Date(dateIn).toLocaleString("en-GB", { weekday: "short" });
  return objTen[result];
};

//Lấy label thứ từ ngày
export const laylabelThuTuNgay = (dateIn) => {
  const result = new Date(dateIn).toLocaleString("en-GB", { weekday: "short" });
  return result;
};
//Xuất thư label ra tên tiếng việt
export const convertThuLabelRaTen = (label) => {
  const arrMau = [
    { label: "mon", name: "Hai" },
    { label: "tue", name: "Ba" },
    { label: "wed", name: "Tư" },
    { label: "thu", name: "Năm" },
    { label: "fri", name: "Sáu" },
    { label: "sat", name: "Bảy" },
    { label: "sun", name: "Chủ nhật" },
  ];
  const result = arrMau.find((i) => i.label === label).name;
  return result;
};

//View tiền vnđ
export const viewSplitMoney = (num) => {
  if (!num) {
    return 0;
  }
  let result = num.toString();
  // 1.000.000.000
  if (result.length > 3 && result.length < 7) {
    result = `${result.substring(0, result.length - 3)}.${result.substr(
      result.length - 3,
      3
    )}`;
    return result;
  }
  if (result.length > 6 && result.length < 10) {
    result = `${result.substring(0, result.length - 6)}.${result.substr(
      result.length - 6,
      3
    )}.${result.substr(result.length - 3, 3)}`;
    return result;
  }
};

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
      arrHocTroDaChon = [...item.arrHocSinh];
    });
  }
  //Thêm isSelected cho mảng
  let arrHocTroDaChonTrue = arrHocTroDaChon.map((item) => {
    return { id: item.hocSinhId, shortName: item.shortName, isSelected: true };
  });
  //Nếu có học sinh trùng thì xóa
  let arrHocTroDaChonLocTrung =
    xoaItemHocSinhTrungTrongMang(arrHocTroDaChonTrue);
  //Ok thì push thằng này lên ctx chọn người để dùng
  // console.log(arrHocTroDaChonLocTrung);
  return arrHocTroDaChonLocTrung;
};
