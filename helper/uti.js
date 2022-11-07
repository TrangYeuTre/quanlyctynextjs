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
    const indexItemMatched = arrClone.findIndex(
      (item) => item.id.toString() === curId.toString()
    );
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
