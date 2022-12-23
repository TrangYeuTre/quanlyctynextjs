import classes from "./Lich.module.css";
import {
  taoInitArr42Ngay,
  layNgayCuoiThangVaThuNgayDauThang,
  loadLichRender,
  themDataChonNhieuNgayVaoLich,
  suaDataNgayTrongLich,
  layThongKeDataLich,
} from "./Lich_helper";
import LichItem from "./LichItem";
import { Fragment } from "react";
import ActionBar from "../../UI/ActionBar";

const Lich = (props) => {
  //VARIABLES
  const {
    ngayChon,
    dataNhieuNgayChon,
    showNgaySua,
    arrDataNgaySua,
    layDataThongKe,
    layLichSubmit,
  } = props;
  const thoiGianThangNay = new Date(ngayChon);
  const { ngayCuoiThang, thuNgayDauThang, title } =
    layNgayCuoiThangVaThuNgayDauThang(thoiGianThangNay);

  //HANDLERS
  const arrInitTable42Cells = taoInitArr42Ngay();
  const arrDatesOfThisMonth = loadLichRender(
    arrInitTable42Cells,
    ngayCuoiThang,
    thuNgayDauThang
  );
  const arrDatesDaThemDataNhieuNgay = themDataChonNhieuNgayVaoLich(
    arrDatesOfThisMonth,
    dataNhieuNgayChon
  );
  const arrDatesCoNgayDuocSuaData = suaDataNgayTrongLich(
    arrDatesDaThemDataNhieuNgay,
    arrDataNgaySua
  );
  const dataLichThongKe = layThongKeDataLich(arrDatesCoNgayDuocSuaData);

  //CALLBACKS
  const getCellIdHandler = (id) => {
    const dataDate = arrDatesCoNgayDuocSuaData.find(
      (item) => +item.idCell === +id
    );
    showNgaySua(dataDate);
  };
  const chotDataLichDeTinhToanHandler = () => {
    layDataThongKe(dataLichThongKe);
    layLichSubmit(arrDatesCoNgayDuocSuaData);
  };

  return (
    <Fragment>
      <h4
        style={{
          paddingBottom: ".5rem",
          borderBottom: "1px solid gray",
        }}
      >
        Lịch tháng: <span style={{ color: "var(--mauMh1--)" }}>{title}</span>
      </h4>
      <div className={classes.overall}>
        <table className={classes.container}>
          {/* Hàng labels thứ */}
          <thead>
            <tr className={classes.labels}>
              <th>Hai</th>
              <th>Ba</th>
              <th>Tư</th>
              <th>Năm</th>
              <th>Sáu</th>
              <th>Bảy</th>
              <th>CN</th>
            </tr>
          </thead>
          {/* Render 42 ô lịch - chia làm 6 hàng data */}
          <tbody>
            <tr className={classes.datas}>
              {arrDatesCoNgayDuocSuaData.map((date) => {
                if (date.idCell >= 0 && date.idCell <= 6) {
                  return (
                    <LichItem
                      key={date.idCell}
                      data={date}
                      getCellId={getCellIdHandler}
                    />
                  );
                }
              })}
            </tr>
            <tr className={classes.datas}>
              {arrDatesCoNgayDuocSuaData.map((date) => {
                if (date.idCell >= 7 && date.idCell <= 13) {
                  return (
                    <LichItem
                      key={date.idCell}
                      data={date}
                      getCellId={getCellIdHandler}
                    />
                  );
                }
              })}
            </tr>
            <tr className={classes.datas}>
              {arrDatesCoNgayDuocSuaData.map((date) => {
                if (date.idCell >= 14 && date.idCell <= 20) {
                  return (
                    <LichItem
                      key={date.idCell}
                      data={date}
                      getCellId={getCellIdHandler}
                    />
                  );
                }
              })}
            </tr>
            <tr className={classes.datas}>
              {arrDatesCoNgayDuocSuaData.map((date) => {
                if (date.idCell >= 21 && date.idCell <= 27) {
                  return (
                    <LichItem
                      key={date.idCell}
                      data={date}
                      getCellId={getCellIdHandler}
                    />
                  );
                }
              })}
            </tr>
            <tr className={classes.datas}>
              {arrDatesCoNgayDuocSuaData.map((date) => {
                if (date.idCell >= 28 && date.idCell <= 34) {
                  return (
                    <LichItem
                      key={date.idCell}
                      data={date}
                      getCellId={getCellIdHandler}
                    />
                  );
                }
              })}
            </tr>
            <tr className={classes.datas}>
              {arrDatesCoNgayDuocSuaData.map((date) => {
                if (date.idCell >= 35 && date.idCell <= 41) {
                  return (
                    <LichItem
                      key={date.idCell}
                      data={date}
                      getCellId={getCellIdHandler}
                    />
                  );
                }
              })}
            </tr>
          </tbody>
        </table>
        <ActionBar
          action1="Chốt Lịch"
          doAction1={chotDataLichDeTinhToanHandler}
          description="Thao tác xong thì phải bấm 'Chốt Lịch' để cập nhật phần kết quả tạm tính bên dưới"
        />
      </div>
    </Fragment>
  );
};

export default Lich;
