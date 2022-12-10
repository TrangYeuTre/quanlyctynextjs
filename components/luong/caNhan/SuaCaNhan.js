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
  //Lấy mảng ddcn
  const { arrDdcn, giaoVienChonData, layDataLuongCaNhan, dataLuongCaNhan } =
    props;
  //State mảng data cuối cùng để render lương cá nhân
  const [arrDataLuongCaNhan, setArrDataLuongCn] = useState([]);
  //Một heler xử lý chuyển mảng ddcn về dạng thống ke theo học sinh cho giáo viên
  const arrDataInitLuongCaNhan = layDataLuongCaNhanTuArrDdcn(arrDdcn);
  //Đánh hệ số tính cho magnr init khi có data sủa
  const arrDataDanhHeSoInit = danhHeSoLuongCaNhanSua(
    arrDataInitLuongCaNhan,
    dataLuongCaNhan
  );
  const arrDataDanhHeSo = tinhLaiArrLuongCaNhan(
    arrDataDanhHeSoInit,
    giaoVienChonData.luongCaNhan
  );
  //Xử lý đánh hệ số cho arr init bên trên
  //Cb thêm hệ số
  const themHeso45 = (hocSinhId) => {
    let arrHandler = [];
    if (arrDataLuongCaNhan.length === 0) {
      //Lấy mảng init xử lý
      arrHandler = [...arrDataDanhHeSo];
    } else {
      arrHandler = [...arrDataLuongCaNhan];
    }
    //Tìm và đánh hệ số
    const hsMatched = arrHandler.find((item) => item.hocSinhId === hocSinhId);
    if (hsMatched) {
      hsMatched.heSoTinh = 45;
    }
    //Chạy tính toán lại nào
    const arrResult = tinhLaiArrLuongCaNhan(
      arrHandler,
      giaoVienChonData.luongCaNhan
    );
    //Set lại mảng state
    setArrDataLuongCn(arrResult);
    layDataLuongCaNhan(arrResult);
  };
  const themHeso60 = (hocSinhId) => {
    let arrHandler = [];
    if (arrDataLuongCaNhan.length === 0) {
      //Lấy mảng init xử lý
      arrHandler = [...arrDataDanhHeSo];
    } else {
      arrHandler = [...arrDataLuongCaNhan];
    }
    //Tìm và đánh hệ số
    const hsMatched = arrHandler.find((item) => item.hocSinhId === hocSinhId);
    if (hsMatched) {
      hsMatched.heSoTinh = 60;
    }
    //Chạy tính toán lại nào
    const arrResult = tinhLaiArrLuongCaNhan(
      arrHandler,
      giaoVienChonData.luongCaNhan
    );
    //Set lại mảng state
    setArrDataLuongCn(arrResult);
    layDataLuongCaNhan(arrResult);
  };

  //Xử lý lấy mảng cuối render
  let arrRender = arrDataDanhHeSo;
  if (arrDataLuongCaNhan.length > 0) {
    arrRender = arrDataLuongCaNhan;
  }
  //Tính tổng tiền nào
  const tongTienLuongCaNhan = tinhTongTienLuongCaNhan(arrRender);
  //Trả
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
