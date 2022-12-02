import classes from "./ChonNhieuNgay.module.css";
import { useState, useEffect } from "react";

const ChonNhieuNgay = (props) => {
  //Đợi hàm lấy data từ trên thôi
  const { layData } = props;
  //State lấy mảng thứ đuọc chọn
  const [arrThuChon, setArrThuChon] = useState([]);
  //State lấy loại lớp chọn
  const [loaiLop, setLop] = useState("none");
  //State lấy hệ số tính
  const [heso, setHeso] = useState(1);

  //Cb reset mảng thứ chọn
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

  //Cb đánh lại mảng thứ
  const chonThuHandler = (name) => {
    //clone lại mảng thu chọn
    const arrClone = [...arrThuChon];
    const thuMatched = arrClone.find((item) => item.name === name);
    thuMatched.isSelected = !thuMatched.isSelected;
    //Lưu lại mảng sau khi chọn
    setArrThuChon(arrClone);
  };
  //Cb lấy loại lớp chọn
  const layLoaiLopHandler = (e) => {
    setLop(e.target.value);
  };
  //Cb lấy hệ số
  const layHesoHandler = (e) => {
    setHeso(e.target.value);
  };
  //Cb actions
  const themNhieuHandler = () => {
    const arrFlter = arrThuChon.filter((item) => item.isSelected);
    if (loaiLop !== "none") {
      if (layData) {
        layData({
          type: "them",
          arrThuChon: arrFlter,
          loaiLop: loaiLop,
          heso: +heso,
        });
      }
      console.log("thêm nhiều");
      resetThuChon();
    }
  };
  const xoaNhieuHandler = () => {
    const arrFlter = arrThuChon.filter((item) => item.isSelected);
    if (layData) {
      layData({ type: "xoa", arrThuChon: arrFlter });
    }
    console.log("xóa nhiều");
    resetThuChon();
  };
  const resetHandler = () => {
    if (layData) {
      layData({ type: "reset" });
    }
    resetThuChon();
    console.log("reset luôn");
  };
  //Side effect set mảng redner ngày
  useEffect(() => {
    //Mẫu mảng thứ
    let ARR_THU = [
      { name: "Hai", value: "Mon", isSelected: false },
      { name: "Ba", value: "Tue", isSelected: false },
      { name: "Tư", value: "Wed", isSelected: false },
      { name: "Năm", value: "Thu", isSelected: false },
      { name: "Sáu", value: "Fri", isSelected: false },
      { name: "Bảy", value: "Sat", isSelected: false },
      { name: "CN", value: "Sun", isSelected: false },
    ];
    setArrThuChon(ARR_THU);
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
          onClick={themNhieuHandler}
        >
          Thêm nhiều
        </button>
        <button className={classes.btn} type="button" onClick={xoaNhieuHandler}>
          Xóa nhiều
        </button>
        <button className={classes.btn} type="button" onClick={resetHandler}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default ChonNhieuNgay;
