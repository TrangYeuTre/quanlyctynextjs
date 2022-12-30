import classes from "./CaNhan.module.css";
import {
  layDataLuongCaNhanTuArrDdcn,
  layStyleNgayHocLuongCaNhan,
  tinhLaiArrLuongCaNhan,
  tinhTongTienLuongCaNhan,
  danhHeSoLuongCaNhanSua,
} from "../luong_helper";
import { viewSplitMoney } from "../../../helper/uti";
import { useEffect, useState } from "react";

//CB view lại 2 chữ số thập phân
const view2SoThapPhan = (num) => {
  return num.toFixed(2);
};
const lamTron = (num) => {
  return Math.round(num / 1000) * 1000;
};

const SuaLuongCaNhan = (props) => {
  //VARIABLES
  const { arrDdcn, giaoVienChonData, layDataLuongCaNhan, dataLuongCaNhan } =
    props;
  const [arrDataLuongCaNhan, setArrDataLuongCn] = useState([]);
  const arrDataInitLuongCaNhan = layDataLuongCaNhanTuArrDdcn(arrDdcn);
  const arrDataDanhHeSoInit = danhHeSoLuongCaNhanSua(
    arrDataInitLuongCaNhan,
    dataLuongCaNhan
  );
  const arrDataDanhHeSo = tinhLaiArrLuongCaNhan(
    arrDataDanhHeSoInit,
    giaoVienChonData.luongCaNhan
  );

  //CALLBACKS
  const themHeso45 = (hocSinhId) => {
    const arrHandler = chotArrLuongCaNhanCanDungChoThemHeSo(
      arrDataDanhHeSo,
      arrDataLuongCaNhan
    );
    timHocSinhVaDanhHeSoTinh(arrHandler, hocSinhId, 45);
    const arrLuongCaNhanTinhLai = tinhLaiArrLuongCaNhanCapNhat(
      arrHandler,
      giaoVienChonData
    );
    updateArrLuongCnRenderVaTruyenDataLenCompTren(arrLuongCaNhanTinhLai);
  };
  const themHeso60 = (hocSinhId) => {
    const arrHandler = chotArrLuongCaNhanCanDungChoThemHeSo(
      arrDataDanhHeSo,
      arrDataLuongCaNhan
    );
    timHocSinhVaDanhHeSoTinh(arrHandler, hocSinhId, 60);
    const arrLuongCaNhanTinhLai = tinhLaiArrLuongCaNhanCapNhat(
      arrHandler,
      giaoVienChonData
    );
    updateArrLuongCnRenderVaTruyenDataLenCompTren(arrLuongCaNhanTinhLai);
  };
  const chotArrLuongCaNhanCanDungChoThemHeSo = (
    arrDataDanhHeSo,
    arrDataLuongCaNhan
  ) => {
    let arrHandler = [];
    if (arrDataLuongCaNhan.length === 0) {
      //Lấy mảng init xử lý
      arrHandler = [...arrDataDanhHeSo];
    } else {
      arrHandler = [...arrDataLuongCaNhan];
    }
    return arrHandler;
  };
  const timHocSinhVaDanhHeSoTinh = (arrHandler, hocSinhId, heSoTinh) => {
    const hsMatched = arrHandler.find((item) => item.hocSinhId === hocSinhId);
    if (!hsMatched) {
      return;
    }
    hsMatched.heSoTinh = +heSoTinh;
  };
  const tinhLaiArrLuongCaNhanCapNhat = (arrHandler, giaoVienChonData) => {
    const arrResult = tinhLaiArrLuongCaNhan(
      arrHandler,
      giaoVienChonData.luongCaNhan
    );
    return arrResult;
  };
  const updateArrLuongCnRenderVaTruyenDataLenCompTren = (arrResult) => {
    setArrDataLuongCn(arrResult);
    layDataLuongCaNhan(arrResult);
  };

  //CALLBACKS
  //Xử lý lấy mảng cuối render, dùng lại cb
  const arrRender = chotArrLuongCaNhanCanDungChoThemHeSo(
    arrDataDanhHeSo,
    arrDataLuongCaNhan
  );
  //Tính tổng tiền nào
  const tongTienLuongCaNhan = tinhTongTienLuongCaNhan(arrRender);

  //SIDE EFFECT

  return (
    <div className={classes.container}>
      <h4>Tính lương cá nhân</h4>
      {/* Ghi chú màu */}
      <ul className={classes.ghiChuMau}>
        <div className={classes.nodeItem}>
          <p>Dạy chính</p>
          <div className={classes.dayChinh}></div>
        </div>
        <div className={classes.nodeItem}>
          <p>Dạy thế</p>
          <div className={classes.dayThe}></div>
        </div>
        <div className={classes.nodeItem}>
          <p>Dạy tăng cường</p>
          <div className={classes.dayTangCuong}></div>
        </div>
        <div className={classes.nodeItem}>
          <p>Nghỉ - Đã bù</p>
          <div className={classes.dayBu}></div>
        </div>
        <div className={classes.nodeItem}>
          <p>Nghỉ - Chưa bù</p>
          <div className={classes.nghi}></div>
        </div>
      </ul>
      {/* Bảng tính */}
      <table>
        {/* Dòng title */}
        <thead>
          <tr>
            <td className={`${classes.cellTitle} ${classes.part2}`}>
              Học sinh
            </td>
            <td className={`${classes.cellTitle} ${classes.part4}`}>
              Ngày học
            </td>
            <td className={`${classes.cellTitle} ${classes.part1}`}>Hs</td>
            <td className={`${classes.cellTitle} ${classes.part1}`}>
              Tổng giờ
            </td>
            <td className={`${classes.cellTitle} ${classes.part2}`}>
              Thành tiền
            </td>
          </tr>
        </thead>
        {/* Dòng data */}
        <tbody>
          {arrRender.length > 0 &&
            arrRender.map((hocsinh) => (
              <tr key={hocsinh.hocSinhId}>
                <td className={`${classes.cellData} ${classes.part2}`}>
                  {hocsinh.shortName}
                </td>
                <td className={`${classes.cellData} ${classes.part4} `}>
                  <div className={classes.cellNgayHoc}>
                    {hocsinh.arrNgayHoc.length > 0 &&
                      hocsinh.arrNgayHoc.map((ngayhoc) => {
                        //Xử lý lấy styel cho ngày học tương ứng
                        const finalStyle = layStyleNgayHocLuongCaNhan(
                          ngayhoc,
                          classes
                        );
                        return (
                          <div
                            key={ngayhoc.ngayHoc}
                            className={classes.motNgay}
                          >
                            <p
                              className={finalStyle}
                              style={{
                                padding: "5px 1rem",
                                borderRight: "2px solid var(--mauNen--)",
                              }}
                            >
                              {new Date(ngayhoc.ngayHoc).getDate()}
                            </p>
                            <p
                              style={{
                                fontWeight: "300",
                                fontSize: "1rem",
                                backgroundColor: "gray",
                                color: "var(--mauNen--)",
                                opacity: ".5",
                                padding: "5px",
                              }}
                            >
                              {isNaN(ngayhoc.soPhutHocMotTiet)
                                ? 0
                                : `${ngayhoc.soPhutHocMotTiet}'`}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                </td>
                <td className={`${classes.cellData} ${classes.part1}`}>
                  <div className={classes.cellHeso}>
                    <div
                      onClick={themHeso45.bind(0, hocsinh.hocSinhId)}
                      className={
                        hocsinh.heSoTinh === 45 ? classes.hesoChon : null
                      }
                    >
                      45
                    </div>
                    <div
                      onClick={themHeso60.bind(0, hocsinh.hocSinhId)}
                      className={
                        hocsinh.heSoTinh === 60 ? classes.hesoChon : null
                      }
                    >
                      60
                    </div>
                  </div>
                </td>
                <td className={`${classes.cellData} ${classes.part1}`}>{`${
                  hocsinh.tongPhut
                }'/${hocsinh.heSoTinh} = ${view2SoThapPhan(
                  hocsinh.gioTinh
                )}h`}</td>
                <td className={`${classes.cellData} ${classes.part2}`}>
                  {viewSplitMoney(lamTron(hocsinh.thanhTien))} đ
                </td>
              </tr>
            ))}
        </tbody>
        {/* Dòng tổng tiền */}
        <tfoot>
          <tr>
            <td
              style={{ visibility: "hidden" }}
              className={`${classes.cellData} ${classes.part2}`}
            >
              .
            </td>
            <td
              style={{ visibility: "hidden" }}
              className={`${classes.cellData} ${classes.part4}`}
            >
              .
            </td>
            <td
              style={{ visibility: "hidden" }}
              className={`${classes.cellData} ${classes.part1}`}
            >
              .
            </td>
            <td className={`${classes.cellData} ${classes.part1}`}>
              Thành tiền
            </td>
            <td
              style={{ color: "var(--mauMh4--)" }}
              className={`${classes.cellData} ${classes.part2}`}
            >
              {viewSplitMoney(lamTron(tongTienLuongCaNhan))} đ
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default SuaLuongCaNhan;
