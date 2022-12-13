import { convertInputDateFormat } from "../../helper/uti";
import DiemDanhNhom from "../../classes/DiemDanhNhom";
//Xử lý mảng chọn lớp nhóm render
export const layArrLopNhomRender = (arrLopNhom, lopNhomIdChon) => {
  //Đầu tiên là xử lý mảng lớp nhóm render
  let arrLnClone = [...arrLopNhom].map((lopnhom) => {
    return {
      id: lopnhom.id,
      tenLopNhom: lopnhom.tenLopNhom,
      isSelected: false,
    };
  });
  //Không có id chọn thì trả lại mảng nguyên chưa chọn seleected
  if (!lopNhomIdChon) {
    return arrLnClone;
  }
  //Dụa vào id chọn đánh lại isSelected
  const indexLnMatched = arrLnClone.findIndex(
    (item) => item.id === lopNhomIdChon
  );
  if (indexLnMatched !== -1) {
    arrLnClone[indexLnMatched].isSelected = true;
  }
  return arrLnClone;
};

//Lấy mảng giáo viên của lớp nhóm đã được set trước đó trong lớp nhóm
export const layArrGvCuaLopNhom = (arrLopNhom, lopNhomChonId) => {
  //Từ id lớp nhóm chọn -> load ds giáo viên của lớp nhóm đó trước
  let arrGiaoVienCuaLopNhom = [];
  const indexLopNhomChon = arrLopNhom.findIndex(
    (item) => item.id === lopNhomChonId
  );

  if (indexLopNhomChon !== -1) {
    arrGiaoVienCuaLopNhom = arrLopNhom[indexLopNhomChon].giaoVienLopNhom;
  }
  return arrGiaoVienCuaLopNhom;
};

//Đánh lại mảng giáo viên full : từ mảng gv cứa lớp nhóm đánh lại chugns true trong mảng full
export const layArrGvChonMacDinhCuaLopNhom = (
  arrGiaoVien,
  arrGiaoVienCuaLopNhom
) => {
  let arrGvClone = [...arrGiaoVien];
  //Clone lại mảng giáo viên thành obj để tránh On2
  let objGvClone = {};
  arrGvClone.forEach((giaovien) => {
    objGvClone[giaovien.id] = {
      shortName: giaovien.shortName,
      luongNhom: +giaovien.luongNhom,
      isSelected: false,
    };
  });
  //Chạy lặp mảng giáo viên lớp nhom để đánh isSelected true
  if (arrGiaoVienCuaLopNhom.length > 0) {
    arrGiaoVienCuaLopNhom.forEach((item) => {
      objGvClone[item.giaoVienId].isSelected = true;
    });
  }
  //Tạo mảng kết quả
  let arrResult = [];
  //Chya lặp obj đẻ chuyể nó vào mảng kq
  for (const key in objGvClone) {
    arrResult.push({
      id: key,
      shortName: objGvClone[key].shortName,
      luongNhom: +objGvClone[key].luongNhom,
      isSelected: objGvClone[key].isSelected,
    });
  }
  //Trả lại
  return arrResult;
};

//Conver mảng cuối thành obj để submit
export const layObjSubmit = (
  ngayChon,
  arrGiaoVienRender,
  lopNhomChonId,
  tenLopNhomChon
) => {
  if (!ngayChon || !arrGiaoVienRender || arrGiaoVienRender.length === 0) {
    return {};
  }
  const arrGvSelected = arrGiaoVienRender.filter(
    (giaovien) => giaovien.isSelected
  );
  if (arrGvSelected && arrGvSelected.length === 0) {
    return {};
  }

  const instanceDdnMoi = new DiemDanhNhom({
    ngayDiemDanh: convertInputDateFormat(ngayChon),
    lopNhomId: lopNhomChonId,
    tenLopNhom: tenLopNhomChon,
  });

  let objGiaoVien = {};
  arrGvSelected.forEach((giaovien) => {
    objGiaoVien[giaovien.id] = {
      shortName: giaovien.shortName,
      luongNhom: +giaovien.luongNhom,
    };
  });

  return { instanceDdnMoi, objGiaoVien };
};

//Tra tên lớp nhóm từ id và mảng lớp nhóm
export const layTenLopNhom = (arrLopNhom, lopNhomChonId) => {
  let tenLopNhomChon = "";
  if (!lopNhomChonId || !arrLopNhom || arrLopNhom.length === 0) {
    return tenLopNhomChon;
  }
  const lopNhomMatched = arrLopNhom.find((item) => item.id === lopNhomChonId);
  if (lopNhomMatched) {
    tenLopNhomChon = lopNhomMatched.tenLopNhom;
  }
  return tenLopNhomChon;
};

//Lọc lại mảng kết quả điểm danh nhóm theo id lớp nhóm chọn và tháng chọn
export const layMangDdnRender = (arrDdnFitler, lopNhomChonId, ngayChon) => {
  let arrKqDdnRender = [];
  if (!arrDdnFitler || arrDdnFitler.length === 0) {
    return arrKqDdnRender;
  }
  //Lọc
  arrKqDdnRender = arrDdnFitler.filter(
    (item) =>
      item.lopNhomId === lopNhomChonId &&
      new Date(item.ngayDiemDanh).getMonth() === new Date(ngayChon).getMonth()
  );
  console.log(arrKqDdnRender);
  //Sort lại theo ngày
  if (arrKqDdnRender.length > 0) {
    arrKqDdnRender = arrKqDdnRender.sort((a, b) =>
      new Date(a.ngayDiemDanh) < new Date(b.ngayDiemDanh) ? -1 : 1
    );
  }
  return arrKqDdnRender;
};
