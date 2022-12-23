import classes from "./SuaNgay.module.css";
import ActionBar from "../../UI/ActionBar";
import { useState, useEffect, useRef } from "react";

const SuaNgayTrongLich = (props) => {
  //VARIABLES
  const { huySua, dataNgayChon, getDataNgaySua } = props;
  const [arrLopHoc, setArrLopHoc] = useState([]);
  const hsCaNhanRef = useRef();
  const hsNhomRef = useRef();
  const hsTangCuongRef = useRef();

  //CALLBACKS
  const huySuaHandler = () => {
    huySua();
  };

  //FUNCTIONS
  const suaMotCellLichHandler = () => {
    capNhatHeSoChoCacLopHocDuocChon({
      hsCaNhanRef: hsCaNhanRef,
      hsNhomRef: hsNhomRef,
      hsTangCuongRef: hsTangCuongRef,
      arrLopHoc: arrLopHoc,
    });
    const arrCacLopHocDuocChon = capNhatCacLopHocDuocChon(arrLopHoc);
    const dataCellUpdate = tongHopLaiDataCuaCellLichSua(arrCacLopHocDuocChon);
    getDataNgaySua(dataCellUpdate);
  };
  const capNhatHeSoChoCacLopHocDuocChon = (data) => {
    const { hsCaNhanRef, hsNhomRef, hsTangCuongRef, arrLopHoc } = data;
    if (hsCaNhanRef.current) {
      arrLopHoc[0].heso = +hsCaNhanRef.current.value;
    }
    if (hsNhomRef.current) {
      arrLopHoc[1].heso = +hsNhomRef.current.value;
    }
    if (hsTangCuongRef.current) {
      arrLopHoc[2].heso = +hsTangCuongRef.current.value;
    }
  };
  const capNhatCacLopHocDuocChon = (arrLopHoc) => {
    if (!arrLopHoc || arrLopHoc.length === 0) {
      return;
    }
    const arrCacLopHocChon = arrLopHoc.filter((item) => item.isSelected);
    return arrCacLopHocChon;
  };
  const tongHopLaiDataCuaCellLichSua = (arrCacLopHocDuocChon) => {
    //GHi chú: kq có dạng {idCell,canhan:2,nhom:1,donghanh:3}
    let objData = {};
    arrCacLopHocDuocChon.forEach((item) => (objData[item.id] = item.heso));
    objData = {
      ...objData,
      idCell: dataNgayChon.idCell,
    };
    return objData;
  };

  const chonLopHocHandler = (lopHocId) => {
    const preArrLopHoc = [...arrLopHoc];
    if (!preArrLopHoc || preArrLopHoc.length === 0) {
      return;
    }
    const lopHocMatched = timLopHocTheoId(preArrLopHoc, lopHocId);
    switchChonLopHoc(lopHocMatched);
    setArrLopHoc(preArrLopHoc);
  };
  const timLopHocTheoId = (arrLopHoc, lopHocId) => {
    if (!arrLopHoc || arrLopHoc.length === 0) {
      return;
    }
    const lopHocMatched = arrLopHoc.find((item) => item.id === lopHocId);
    if (!lopHocMatched) {
      return;
    }
    return lopHocMatched;
  };
  const switchChonLopHoc = (lopHoc) => {
    if (!lopHoc) {
      return;
    }
    lopHoc.isSelected = !lopHoc.isSelected;
  };

  //SIDE EFFECT
  useEffect(() => {
    let ARR_CHON_LOP = [
      { id: "canhan", name: "Cá nhân", heso: 1, isSelected: false },
      { id: "nhom", name: "Nhóm", heso: 1, isSelected: false },
      { id: "donghanh", name: "Đồng hành", heso: 1, isSelected: false },
    ];
    const arrLopHocDefault = loadDataMacDinhCuaNgayDuocChonVaoUiSua(
      ARR_CHON_LOP,
      dataNgayChon
    );
    setArrLopHoc(arrLopHocDefault);
  }, [dataNgayChon]);
  const loadDataMacDinhCuaNgayDuocChonVaoUiSua = (
    ARR_CHON_LOP,
    dataNgayChon
  ) => {
    if (!dataNgayChon || dataNgayChon.loaiLop.length === 0) {
      return ARR_CHON_LOP;
    }
    const arrDataDefault = dataNgayChon.loaiLop;
    arrDataDefault.forEach((item) => {
      const itemMatched = ARR_CHON_LOP.find((i) => i.id === item.loaiLop);
      if (itemMatched) {
        itemMatched.isSelected = true;
        itemMatched.heso = item.heso;
      }
    });
    return ARR_CHON_LOP;
  };

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
          doAction2={suaMotCellLichHandler}
          description="Muốn xóa thì bỏ chọn hết các lớp nhé."
        />
      </div>
    </div>
  );
};

export default SuaNgayTrongLich;
