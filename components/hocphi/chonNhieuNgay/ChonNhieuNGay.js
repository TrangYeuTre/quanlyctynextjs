import classes from "./ChonNhieuNgay.module.css";
import { useState, useEffect } from "react";

const ChonNhieuNgay = (props) => {
  //VARIABLES
  const { layData } = props;
  const [arrThuChon, setArrThuChon] = useState([]);
  const [loaiLop, setLop] = useState("none");
  const [heso, setHeso] = useState(1);

  //CALLBACKS
  const resetThuChon = () => {
    setArrThuChon([
      { name: "Hai", value: "Mon", isSelected: false },
      { name: "Ba", value: "Tue", isSelected: false },
      { name: "Tư", value: "Wed", isSelected: false },
      { name: "Năm", value: "Thu", isSelected: false },
      { name: "Sáu", value: "Fri", isSelected: false },
      { name: "Bảy", value: "Sat", isSelected: false },
      { name: "CN", value: "Sun", isSelected: false },
    ]);
  };
  const chonThuHandler = (name) => {
    const arrThuChonClone = [...arrThuChon];
    const thuMatched = timThuTheoName(arrThuChonClone, name);
    switchSelectedThuChon(thuMatched);
    setArrThuChon(arrThuChonClone);
  };
  const timThuTheoName = (arrThuChon, name) => {
    if (!arrThuChon || !name || arrThuChon.length === 0) {
      return;
    }
    const thuMatched = arrThuChon.find((item) => item.name === name);
    if (!thuMatched) {
      return;
    }
    return thuMatched;
  };
  const switchSelectedThuChon = (thuChon) => {
    if (!thuChon) {
      return;
    }
    thuChon.isSelected = !thuChon.isSelected;
  };

  const layLoaiLopHandler = (e) => {
    setLop(e.target.value);
  };
  const layHesoHandler = (e) => {
    setHeso(e.target.value);
  };

  //FUNCTIONS
  const themNhieuNgayChonHandler = () => {
    const arrThuDuocChon = locArrThuDuocChon(arrThuChon);
    if (!isDaChonLoaiLop(loaiLop)) {
      return;
    }
    if (layData) {
      layData({
        type: "them",
        arrThuChon: arrThuDuocChon,
        loaiLop: loaiLop,
        heso: +heso,
      });
    }
    resetThuChon();
  };
  const locArrThuDuocChon = (arrThuChon) => {
    if (arrThuChon.length === 0) {
      return;
    }
    const arrFilter = arrThuChon.filter((item) => item.isSelected);
    return arrFilter;
  };
  const isDaChonLoaiLop = (loaiLop) => {
    return loaiLop !== "none";
  };

  const xoaNhieuNgayChonHandler = () => {
    const arrThuDuocChon = locArrThuDuocChon(arrThuChon);
    if (layData) {
      layData({ type: "xoa", arrThuChon: arrThuDuocChon });
    }
    resetThuChon();
  };

  const resetChonNgayHandler = () => {
    if (layData) {
      layData({ type: "reset" });
    }
    resetThuChon();
  };

  //SIDE EFFECT
  useEffect(() => {
    resetThuChon();
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.controls}>
        {arrThuChon.map((item) => (
          <div
            className={item.isSelected ? classes.itemThuChon : classes.itemThu}
            key={item.name}
            onClick={chonThuHandler.bind(0, item.name)}
          >
            {item.name}
          </div>
        ))}
      </div>
      <div className={classes.controls}>
        <label>Chọn loại lớp:</label>
        <select onChange={layLoaiLopHandler} defaultValue="none">
          <option value="none">None</option>
          <option value="canhan">Cá nhân</option>
          <option value="nhom">Nhóm</option>
          <option value="donghanh">Đồng hành</option>
        </select>
        <label>Hệ số</label>
        <input
          type="number"
          min="1"
          step="1"
          value={heso}
          onChange={layHesoHandler}
          style={{ width: "4.5rem" }}
        />
      </div>
      <div className={classes.controls} style={{ fontSize: "1rem" }}>
        <p style={{ color: "darkred" }}>Cá nhân</p>
        <div className={classes.canhan}></div>
        <p style={{ color: "blue" }}>Nhóm</p>
        <div className={classes.nhom}></div>
        <p style={{ color: "hotpink" }}>Đồng hành</p>
        <div className={classes.donghanh}></div>
      </div>
      <div className={classes.controls}>
        <button
          className={classes.btn}
          type="button"
          onClick={themNhieuNgayChonHandler}
        >
          Thêm nhiều
        </button>
        <button
          className={classes.btn}
          type="button"
          onClick={xoaNhieuNgayChonHandler}
        >
          Xóa nhiều
        </button>
        <button
          className={classes.btn}
          type="button"
          onClick={resetChonNgayHandler}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default ChonNhieuNgay;
