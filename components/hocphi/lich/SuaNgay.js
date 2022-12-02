import classes from "./SuaNgay.module.css";
import ActionBar from "../../UI/ActionBar";
import { useState, useEffect, useRef } from "react";

const SuaNgayTrongLich = (props) => {
  const { huySua, dataNgayChon, getDataNgaySua } = props;
  //State mảng lớp học để chọn
  const [arrLopHoc, setArrLopHoc] = useState([]);
  //Ref cho các hệ số
  const hsCaNhanRef = useRef();
  const hsNhomRef = useRef();
  const hsTangCuongRef = useRef();

  //Callback
  const huySuaHandler = () => {
    huySua();
  };
  const suaHandler = () => {
    //Xử lý đánh lại hệ số
    if (hsCaNhanRef.current) {
      arrLopHoc[0].heso = +hsCaNhanRef.current.value;
    }
    if (hsNhomRef.current) {
      arrLopHoc[1].heso = +hsNhomRef.current.value;
    }
    if (hsTangCuongRef.current) {
      arrLopHoc[2].heso = +hsTangCuongRef.current.value;
    }
    //Filter lại mảng lớp học isSelected true
    const arrFilter = arrLopHoc.filter((item) => item.isSelected);
    //Conver nó thành obj data kiểu {canhan:2,nhom:1}
    let objData = {};
    arrFilter.forEach((item) => (objData[item.id] = item.heso));
    //Add thêm prop idCell
    objData = {
      ...objData,
      idCell: dataNgayChon.idCell,
    };
    //Cuối cùng trả lại comp trên
    getDataNgaySua(objData);
  };
  //Cb chọn lớp học
  const chonLopHocHandler = (id) => {
    //Lấy mảng truóc đó
    const preArrLopHoc = [...arrLopHoc];
    //Đánh isSelect cho magnr này
    if (preArrLopHoc.length > 0) {
      const indexMatched = preArrLopHoc.findIndex((item) => item.id === id);
      if (indexMatched !== -1) {
        preArrLopHoc[indexMatched].isSelected =
          !preArrLopHoc[indexMatched].isSelected;
      }
    }
    //Set lại mảng
    setArrLopHoc(preArrLopHoc);
  };
  //Side effect thiết lập mảng lớp học chọn
  useEffect(() => {
    //Tạo mảng mẫu chọn 3 loại lớp cá nhân, nhóm ,đồng hành
    let ARR_CHON_LOP = [
      { id: "canhan", name: "Cá nhân", heso: 1, isSelected: false },
      { id: "nhom", name: "Nhóm", heso: 1, isSelected: false },
      { id: "donghanh", name: "Đồng hành", heso: 1, isSelected: false },
    ];
    if (dataNgayChon && dataNgayChon.loaiLop.length > 0) {
      console.log("run ?");
      //Trường hợp cần load loại lớp chọn sẵn khi có data truyền xuống
      const arrLoaiLopDefault = dataNgayChon.loaiLop;
      arrLoaiLopDefault.forEach((item) => {
        const itemMatched = ARR_CHON_LOP.find((i) => i.id === item.loaiLop);
        if (itemMatched) {
          itemMatched.isSelected = true;
          itemMatched.heso = item.heso;
        }
      });
    } //end if
    //Set mảng render ban đầu
    setArrLopHoc(ARR_CHON_LOP);
  }, [dataNgayChon]);
  return (
    <div className={classes.container}>
      <div className={classes.controls}>
        <label>Chọn lớp:</label>
        {arrLopHoc.map((item) => (
          <div
            className={
              !item.isSelected ? classes.lopChuaChon : classes.lopDaChon
            }
            key={item.id}
            onClick={chonLopHocHandler.bind(0, item.id)}
          >
            {item.name}
          </div>
        ))}
      </div>
      {arrLopHoc.length > 0 && arrLopHoc[0].isSelected && (
        <div className={classes.controls}>
          <label>Hệ số cá nhân</label>
          <input
            defaultValue={arrLopHoc[0].heso}
            type="number"
            min="1"
            step="1"
            ref={hsCaNhanRef}
          />
        </div>
      )}
      {arrLopHoc.length > 0 && arrLopHoc[1].isSelected && (
        <div className={classes.controls}>
          <label>Hệ số nhóm</label>
          <input
            defaultValue={arrLopHoc[1].heso}
            type="number"
            min="1"
            step="1"
            ref={hsNhomRef}
          />
        </div>
      )}
      {arrLopHoc.length > 0 && arrLopHoc[2].isSelected && (
        <div className={classes.controls}>
          <label>Hệ số đồng hành</label>
          <input
            defaultValue={arrLopHoc[2].heso}
            type="number"
            min="1"
            step="1"
            ref={hsTangCuongRef}
          />
        </div>
      )}

      <div className={classes.controls}>
        <ActionBar
          action1="Té"
          action2="Sửa"
          doAction1={huySuaHandler}
          doAction2={suaHandler}
          description="Muốn xóa thì bỏ chọn hết các lớp nhé."
        />
      </div>
    </div>
  );
};

export default SuaNgayTrongLich;
