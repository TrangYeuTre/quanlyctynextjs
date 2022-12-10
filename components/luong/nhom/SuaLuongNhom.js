import classes from "./LuongNhom.module.css";
import { viewSplitMoney } from "../../../helper/uti";
import { tinhTongLuongNhom } from "../luong_helper";
import { useState, useEffect } from "react";
import NgayBar from "../../UI/NgayBar";

const LuongNhom = (props) => {
  const { dataLuongNhom, layDataLuongNhom } = props;
  //State lấy giá trị của ô ghi chú
  const [ghiChuVal, setGhiChuVal] = useState("");
  //State mảng lương nhóm render
  const [arrLuongNhom, setArrLuongNhom] = useState([]);
  //Cb lấy giá trị ghi chú
  const layGiaTriGhiChuHandler = (e) => {
    setTimeout(() => {
      setGhiChuVal(e.target.value);
    }, 2000);
  };
  //Tính tổng lương nhớm
  const tongLuongNhom = tinhTongLuongNhom(arrLuongNhom);
  //Cb thêm ghi chú cho ngày nhóm
  const themGhiChuNgayNhomHandler = (ngayDiemDanh) => {
    //Tìm trong mảng ngày tương ứng để thêm ghi chú
    const arrDdnClone = [...arrLuongNhom];
    const ngayMatched = arrDdnClone.find(
      (item) => item.ngayDiemDanh === ngayDiemDanh
    );
    if (ngayMatched) {
      ngayMatched.ghiChu = ghiChuVal;
    }
    layDataLuongNhom(arrDdnClone);
    setArrLuongNhom(arrDdnClone);
  };
  //Side effect load data sưa lần đầu
  useEffect(() => {
    setArrLuongNhom(dataLuongNhom);
  }, [dataLuongNhom]);
  return (
    <div className={classes.container}>
      <h4>Tính lương nhóm</h4>
      {/* Bảng data lương nhóm */}
      <table style={{ width: "100%" }}>
        {/* Tiêu đề */}
        <thead>
          <tr>
            <td className={`${classes.cellTitle} ${classes.part2}`}>Ngày</td>
            <td className={`${classes.cellTitle} ${classes.part4}`}>Ghi chú</td>
            <td className={`${classes.cellTitle} ${classes.part2}`}>
              Lớp nhóm
            </td>
            <td className={`${classes.cellTitle} ${classes.part2}`}>
              Thành tiền
            </td>
          </tr>
        </thead>
        {/* Phần thân data */}
        <tbody>
          {arrLuongNhom.length > 0 &&
            arrLuongNhom.map((item) => (
              <tr key={item.ngayDiemDanh}>
                <td className={`${classes.cellData} ${classes.part2}`}>
                  <NgayBar ngay={new Date(item.ngayDiemDanh).getDate()} />
                </td>
                <td
                  className={`${classes.cellData} ${classes.part4}`}
                  style={{ padding: "0" }}
                >
                  <div className={classes.ghichu}>
                    <textarea
                      type="text"
                      className={classes.ghiChuInput}
                      defaultValue={item.ghiChu}
                      onChange={layGiaTriGhiChuHandler}
                    />
                    <div
                      onClick={themGhiChuNgayNhomHandler.bind(
                        0,
                        item.ngayDiemDanh
                      )}
                      className={classes.ghichuBtn}
                    >
                      <p style={{ fontSize: "1rem" }}>Thêm</p>
                    </div>
                  </div>
                </td>
                <td className={`${classes.cellData} ${classes.part2}`}>
                  {item.tenLopNhom}
                </td>
                <td className={`${classes.cellData} ${classes.part2}`}>
                  {viewSplitMoney(item.luongNhom || 0)} đ
                </td>
              </tr>
            ))}
        </tbody>
        {/* Phần tính tiền tổng */}
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
            <td className={`${classes.cellData} ${classes.part2}`}>
              Thành tiền
            </td>
            <td
              style={{ color: "var(--mauMh4--)" }}
              className={`${classes.cellData} ${classes.part2}`}
            >
              {viewSplitMoney(tongLuongNhom)} đ
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default LuongNhom;
