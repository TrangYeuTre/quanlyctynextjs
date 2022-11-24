//Sort lại mảng theo phần tên của shortname
// export const sortArtByLastShortName = (arrIn) => {
//   let arrClone = [...arrIn];
//   //Xử lý lấy phần tên thôi
//   let arrLastName = [];
//   for (let i = 0; i < arrClone.length; i++) {
//     //Xử lý tách phần tên của item
//     const curItem = arrClone[i].shortName.trim();
//     const curItemId = arrClone[i].id;
//     const arrNameSplit = curItem.split(" ");
//     const lastName = arrNameSplit[arrNameSplit.length - 1];
//     arrLastName.push({ name: lastName.toLowerCase(), id: curItemId });
//   }
//   //sort lại mảng phần tên
//   let arrLastNameSorted = arrLastName.sort((a, b) =>
//     a.name < b.name ? -1 : 1
//   );
//   //Dựa vào mảng sort này tìm trong mảng full và đẩy vào mảng kết quả theo thứ tự
//   let arrResult = [];
//   for (let j = 0; j < arrLastNameSorted.length; j++) {
//     const curId = arrLastNameSorted[j].id;
//     //Tìm
//     const indexItemMatched = arrClone.findIndex((item) => item.id === curId);
//     if (indexItemMatched !== -1) {
//       //Tìm thấy thì xử lý đẩy vào mảng kết quả
//       arrResult.push(arrClone[indexItemMatched]);
//       //Đẩy xong thì xóa nó đi ở mảng item để tránh trường hợp tên trung
//       arrClone.splice(indexItemMatched, 1);
//     }
//   } //end for
//   return arrResult;
// };

//Sort lại mảng theo phần tên của shortname, phương pháp dưới hơi dài nhưng tối ưu theo O(n)
export const sortArtByLastShortName = (arrIn) => {
  //Mảng arrIn có dạng [{id,shortName, và các props khác}]
  //Ví dụ : [{id:'hs-1',shortName:'Nghĩa Đía',age:31},{id:'hs-2',shortName:'Trang Lùn',age:30}]
  //Clone lạ mảng chính
  const arrClone = [...arrIn];
  //Biến mảng chính thành một obj để truy xuất O(n)
  let objConverted = {}; //Dạng {hs-1:{id:'hs-1',shortName:'Nghĩa Đía',age:31}}
  for (let i = 0; i < arrIn.length; i++) {
    objConverted[arrIn[i].id] = arrIn[i];
  }
  //map lại mảng chỉ lấy id và shortName để loại các props khác, kết hợp chỉ lấy phần last của shortName
  const arrConvert = arrClone.map((item) => {
    const curShortName = item.shortName;
    const arrSplit = curShortName.split(" ");
    const lastShortName = arrSplit[arrSplit.length - 1].toLowerCase();
    //Trả lại mảng mới
    return {
      id: item.id,
      name: lastShortName,
    };
  });
  //Sort lại mảng convert này theo name
  const arrSortByName = arrConvert.sort((a, b) => (a.name < b.name ? -1 : 1));
  //map lại mảng id đã được săp xếp theo trật tự trên
  const arrIdSorted = arrSortByName.map((item) => item.id);
  //Từ mảng id sort này săp xếp lại mảng clone theo thứ tự đó
  let arrResult = [];
  arrIdSorted.forEach((item) => arrResult.push(objConverted[item]));
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

//Từ time nhập vaò xuất ra ngày đầu và cuối của tháng sau
export const getFirstLastDateOfNextMonth = (timeIn) => {
  //--->Logic : lấy ngày hôm nay , suy ra tháng sau -> xác định lịch của tháng sau để mà load
  const today = new Date(timeIn);
  // const curDate = today.getDate();
  const curMonth = today.getMonth();
  const curYear = today.getFullYear();
  let nextMonth;
  let nextYear;
  let firstDateOfNextMonth, lastDateOfNextMonth;
  //Lấy tháng sau, sẽ có tường hợp tháng cuối năm tháng sau sẽ nhảy thành thagns 1 --> xử lý if
  if (curMonth === 11) {
    // console.log("run");
    //Tháng sau là tháng 1 năm mới
    nextMonth = 1;
    nextYear = curYear + 1;
    let lastDate = new Date(nextYear, nextMonth, 0).getDate();
    firstDateOfNextMonth = `${nextYear}-01-01`;
    lastDateOfNextMonth = `${nextYear}-01-${lastDate}`;
  } else {
    //Tháng sau tăng 1 bình thường
    nextMonth = curMonth + 1;
    nextYear = curYear;
    let lastDate = new Date(nextYear, nextMonth + 1, 0).getDate();
    if (nextMonth.toString().length === 1 && nextMonth !== 9) {
      nextMonth = `0${nextMonth + 1}`;
    } else {
      nextMonth = `${nextMonth + 1}`;
    }
    firstDateOfNextMonth = `${nextYear}-${nextMonth}-01`;
    lastDateOfNextMonth = `${nextYear}-${nextMonth}-${lastDate}`;
  }
  //Build tính năng lấy tên thứ của ngày 1 trong tháng và số ngày trong tháng đê chạy loop active cái lịch
  const firstWeekday = new Date(firstDateOfNextMonth)
    .toLocaleDateString("en-US", { weekday: "short" })
    .toLowerCase();
  const totalDaysOfMonth = new Date(lastDateOfNextMonth).getDate();
  return {
    firstDateOfNextMonth,
    lastDateOfNextMonth,
    firstWeekday,
    totalDaysOfMonth,
  };
};

//Từ time nhập vào lấy ngày đầu và cuối tháng
export const getFirstLastDateOfThisMonth = (timeIn) => {
  const today = new Date(timeIn);
  let curMonth = today.getMonth() + 1;
  const lastDate = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();
  if (curMonth.toString().length === 1) {
    curMonth = `0${curMonth}`;
  }
  //Ok trả về nào
  const firstDateOfThisMonth = `${today.getFullYear()}-${curMonth}-01`;
  const lastDateOfThisMonth = `${today.getFullYear()}-${curMonth}-${lastDate}`;
  return {
    firstDateOfThisMonth,
    lastDateOfThisMonth,
  };
};

//Từ time nhập vaò xuất ra ngày đầu và cuối của tháng sau
export const getFirstLastDateOfPrevMonth = (timeIn) => {
  //--->Logic : lấy ngày hôm nay , suy ra tháng sau -> xác định lịch của tháng sau để mà load
  const today = new Date(timeIn);
  // const curDate = today.getDate();
  const curMonth = today.getMonth();
  const curYear = today.getFullYear();
  let prevMonth;
  let prevYear;
  let firstDateOfPrevMonth, lastDateOfPrevMonth;
  //Lấy tháng trước : trường hợp tháng hiện tại là tháng 1 thì preMOnth phải là 12 và preyear phải lùi lại 1
  // curMonth ở đây là index, do đó ứng với tháng 1 ta phải set nó bằng 0 như dưới
  if (curMonth === 0) {
    //Tháng trước là tháng 12
    prevMonth = 12;
    prevYear = curYear - 1;
    let lastDate = new Date(prevYear, prevMonth, 0).getDate();
    firstDateOfPrevMonth = `${prevYear}-12-01`;
    lastDateOfPrevMonth = `${prevYear}-12-${lastDate}`;
  } else {
    //Tháng trước giảm bình thường
    prevMonth = curMonth - 1;
    prevYear = curYear;
    let lastDate = new Date(prevYear, prevMonth + 1, 0).getDate();
    //Format month từ index thành số đúng hiển thị
    if (prevMonth.toString().length === 1 && prevMonth !== 9) {
      prevMonth = `0${prevMonth + 1}`;
    } else {
      prevMonth = `${prevMonth + 1}`;
    }
    firstDateOfPrevMonth = `${prevYear}-${prevMonth}-01`;
    lastDateOfPrevMonth = `${prevYear}-${prevMonth}-${lastDate}`;
  }
  return {
    firstDateOfPrevMonth,
    lastDateOfPrevMonth,
  };
};
