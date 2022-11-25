import classes from "./PickDateBar.module.css";
import { useState, Fragment } from "react";
import {
  layTenThuTuNgay,
  convertInputDateFormat,
  getFirstLastDateOfPrevMonth,
  getFirstLastDateOfNextMonth,
} from "../../helper/uti";

const PickDateBar = (props) => {
  //Dợi props hàm truyền ngày được chọn lên thôi
  const { getNgayDuocChon, hint, title, limitPreNThisMonth } = props;
  //State ngày được chọn để điểm danh
  const [ngayDiemDanh, setNgayDiemDanh] = useState(new Date());
  //Lấy ngày đầu của tháng trước và ngày cuối của tháng sau để litmit input chọn ngày -> dùng để lọc thống kê ddcn của giáo viên
  const { firstDateOfPrevMonth } = getFirstLastDateOfPrevMonth(new Date());
  const { lastDateOfNextMonth } = getFirstLastDateOfNextMonth(new Date());
  //State ui cho nút chốt
  const [isChot, setChot] = useState(true);
  //Cb đổi ngày điểm danh
  const thayDoiNgayDiemDanhHandler = (e) => {
    setNgayDiemDanh(new Date(e.target.value));
    setChot(false);
  };
  //Cb chốt hay không
  const setChotHandler = () => {
    setChot(!isChot);
    getNgayDuocChon(ngayDiemDanh);
  };
  return (
    <div className={classes.container}>
      <h4 className="h3GachChan">{title ? title : "Chọn ngày"}</h4>
      <p className="ghichu">
        {hint
          ? hint
          : "Mặc định là ngày hôm nay, muốn thay đổi thì chọn lại nhé."}
      </p>
      <div className={classes.chonNgay}>
        <label>Thứ</label>
        <div className={classes.thuLabel}>{layTenThuTuNgay(ngayDiemDanh)}</div>
        <label>Ngày</label>
        <input
          type="date"
          value={convertInputDateFormat(ngayDiemDanh)}
          onChange={thayDoiNgayDiemDanhHandler}
          min={limitPreNThisMonth ? firstDateOfPrevMonth : null}
          max={limitPreNThisMonth ? lastDateOfNextMonth : null}
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
