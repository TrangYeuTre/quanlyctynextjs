import classes from "./Lich.module.css";
import {
  taoInitArr42Ngay,
  layNgayCuoiThangVaThuNgayDauThang,
  layThoiGianThangTiepTheo,
  loadLichRender,
  themDataChonNhieuNgayVaoLich,
  suaDataNgayTrongLich,
  layThongKeDataLich,
} from "./Lich_helper";
import LichItem from "./LichItem";
import { Fragment, useState, useEffect } from "react";
import ActionBar from "../../UI/ActionBar";

const Lich = (props) => {
  //Mong từ props ngày được chọn để lọc lịch theo tháng
  //Chú ý khi truyền xuống thì ngayChon đã là ngày của tháng sau đê tính hp tháng sau, cơ chế ở comp này đang là tính thoe ngày chọn chứ không tự động công thêm 1 tháng
  const {
    ngayChon,
    dataNhieuNgayChon,
    showNgaySua,
    arrDataNgaySua,
    layDataThongKe,
  } = props;
  //Từ ngày chọn format lại date để render ngay tháng này
  const thoiGianThangNay = new Date(ngayChon);
  //Lấy ngày cuối tháng và thứ ngày đầu tháng
  const { ngayCuoiThang, thuNgayDauThang, title } =
    layNgayCuoiThangVaThuNgayDauThang(thoiGianThangNay);
  //Lấy arr 42 ngày ban đầu
  const arrDatesInit = taoInitArr42Ngay();
  //Lấy mảng lịch tháng này để render
  const arrDatesRender = loadLichRender(
    arrDatesInit,
    ngayCuoiThang,
    thuNgayDauThang
  );
  //Từ data của chọn nhiều ngày áp vào đẻ có mảng lịch full
  const arrDatesWithData = themDataChonNhieuNgayVaoLich(
    arrDatesRender,
    dataNhieuNgayChon
  );
  //Load mảng lịch sau khi có data của ngày được sửa
  const arrLichDaSuaNgay = suaDataNgayTrongLich(
    arrDatesWithData,
    arrDataNgaySua
  );

  //Lấy thống kê data lịch
  const thongKeLich = layThongKeDataLich(arrLichDaSuaNgay);

  // Cb lấy id của một cell lịch được chọn
  const getCellIdHandler = (id) => {
    //Lấy data của cell
    const dataDate = arrLichDaSuaNgay.find((item) => +item.idCell === +id);
    //Kích hoạt show ui sủa ngày được chọn và truyền ngược lên data của ngày được chọn
    showNgaySua(dataDate);
  };

  //Cb chốt data thống kê cho comp trên dùng
  const layDataLichHandler = () => {
    layDataThongKe(thongKeLich);
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
              {arrLichDaSuaNgay.map((date) => {
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
              {arrLichDaSuaNgay.map((date) => {
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
              {arrLichDaSuaNgay.map((date) => {
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
              {arrLichDaSuaNgay.map((date) => {
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
              {arrLichDaSuaNgay.map((date) => {
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
              {arrLichDaSuaNgay.map((date) => {
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
          doAction1={layDataLichHandler}
          description="Thao tác xong thì phải bấm 'Chốt Lịch' để cập nhật phần kết quả tạm tính bên dưới"
        />
      </div>
    </Fragment>
  );
};

export default Lich;
