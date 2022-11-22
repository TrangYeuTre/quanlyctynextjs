import classes from "./PickDateBar.module.css";
import { useState, Fragment } from "react";
import { layTenThuTuNgay, convertInputDateFormat } from "../../helper/uti";

const PickDateBar = (props) => {
  //Dợi props hàm truyền ngày được chọn lên thôi
  const { getNgayDuocChon } = props;
  //State ngày được chọn để điểm danh
  const [ngayDiemDanh, setNgayDiemDanh] = useState(new Date());
  //State ui cho nút chốt
  const [isChot, setChot] = useState(false);
  //Cb đổi ngày điểm danh
  const thayDoiNgayDiemDanhHandler = (e) => {
    setNgayDiemDanh(new Date(e.target.value));
  };
  //Cb chốt hay không
  const setChotHandler = () => {
    setChot(!isChot);
    getNgayDuocChon(ngayDiemDanh);
  };
  return (
    <div className={classes.container}>
      <div className={classes.chonNgay}>
        <label>Thứ</label>
        <div className={classes.thuLabel}>{layTenThuTuNgay(ngayDiemDanh)}</div>
        <label>Ngày</label>
        <input
          type="date"
          value={convertInputDateFormat(ngayDiemDanh)}
          onChange={thayDoiNgayDiemDanhHandler}
        />
      </div>
      <button
        className={`${isChot ? classes.btnDaChot : classes.btnChuaChot}`}
        onClick={setChotHandler}
      >
        {isChot ? "Đã chốt" : "Chốt"}
      </button>
    </div>
  );
};

export default PickDateBar;
