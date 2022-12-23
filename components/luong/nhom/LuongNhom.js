import classes from "./LuongNhom.module.css";
import { viewSplitMoney } from "../../../helper/uti";
import { tinhTongLuongNhom } from "../luong_helper";
import { useState, useEffect } from "react";
import NgayBar from "../../UI/NgayBar";

const LuongNhom = (props) => {
  //VARIABLES
  const { arrDdn, layDataLuongNhom } = props;
  const [arrDdnRender, setArrDdnRender] = useState(arrDdn);
  const [ghiChuVal, setGhiChuVal] = useState();
  const tongLuongNhom = tinhTongLuongNhom(arrDdn);

  //CALLBACKS
  //Delay .5s mới thêm phần ghi chú gõ vào
  let delay;
  const layGhiChuHandler = (e) => {
    clearTimeout(delay);
    delay = setTimeout(() => {
      setGhiChuVal(e.target.value);
    }, 500);
  };

  const themGhiChuNgayNhomHandler = (ngayDiemDanh) => {
    const arrDdnClone = [...arrDdnRender];
    const ngayMatched = timNgayDiemDanhNhom(arrDdnClone, ngayDiemDanh);
    updateGhiChuChoNgayDiemDanhNhom(ngayMatched, ghiChuVal);
    updateMangDdnRenderVaTruyenDataLenCompTren(arrDdnClone);
  };
  const timNgayDiemDanhNhom = (arrDdn, ngayDiemDanh) => {
    const ngayMatched = arrDdn.find(
      (item) => item.ngayDiemDanh === ngayDiemDanh
    );
    if (!ngayMatched) {
      return;
    }
    return ngayMatched;
  };
  const updateGhiChuChoNgayDiemDanhNhom = (ngayMatched, ghiChuVal) => {
    if (!ngayMatched) {
      return;
    }
    ngayMatched.ghiChu = ghiChuVal;
  };
  const updateMangDdnRenderVaTruyenDataLenCompTren = (arrHandler) => {
    layDataLuongNhom(arrHandler);
    setArrDdnRender(arrHandler);
  };

  //SIDE EFFECT
  useEffect(() => {
    setArrDdnRender(arrDdn);
  }, [arrDdn]);

  return (
    <div className={classes.container}>
      <h4>Tính lương nhóm</h4>
      <p className="ghichu">
        Nhập xong ghi chú sau 3s nó tự mất hoặc load lại ghi chú cũ, nhấn nút
        thêm để xác nhận là được nhé - do đó cố gắng nhập nhanh
      </p>
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
          {arrDdnRender.length > 0 &&
            arrDdnRender.map((item) => (
              <tr key={Math.random()}>
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
                      onChange={layGhiChuHandler}
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
