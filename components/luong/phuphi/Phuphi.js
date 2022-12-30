import classes from "./Phuphi.module.css";
import { viewSplitMoney } from "../../../helper/uti";
import FormThemPhuPhi from "./FormThemPhuPhi";
import FormSuaPhuPhi from "./FormSuaPhuPhi";
import { useState } from "react";
import NgayBar from "../../UI/NgayBar";
import { tinhTongPhuPhi } from "../luong_helper";

const PhuPhi = (props) => {
  //VARIABLES
  const { layDataPhuPhi } = props;
  const [viewThemPp, setViewThemPp] = useState(true);
  const [dataNgaySua, setDataNgaySua] = useState();
  const [arrPhuPhi, setArrPhuPhi] = useState([]);
  const tongPhuPhi = tinhTongPhuPhi(arrPhuPhi);

  //CB
  const viewFormThemPhuPhi = () => {
    setViewThemPp(true);
  };
  const viewFormSuaPhuPhi = () => {
    setViewThemPp(false);
  };

  const loadDataMacDinhNgaySua = (ngayPhuPhiId) => {
    viewFormSuaPhuPhi();
    const ngayPhuPhiMatched = timNgayPhuPhi(arrPhuPhi, ngayPhuPhiId);
    setDataNgaySua(ngayPhuPhiMatched);
  };
  const timNgayPhuPhi = (arrPhuPhi, ngayPhuPhiId) => {
    if (!arrPhuPhi && arrPhuPhi.length === 0) {
      return;
    }
    const itemMatch = arrPhuPhi.find(
      (item) => +item.ngayPhuPhiId === +ngayPhuPhiId
    );
    if (!itemMatch) {
      return;
    }
    return itemMatch;
  };

  //Thêm mới ngày phụ phí
  const themNgayPhuPhiHandler = (data) => {
    const arrClone = [...arrPhuPhi];
    themMoiDataVaoArrPhuPhi(arrClone, data);
    sapXepLaiArrPhuPhiTheoNgayTangDan(arrClone);
    thietLapArrPhuPhiRenderVaTruyenLenCompTren(arrClone);
  };
  const themMoiDataVaoArrPhuPhi = (arrPhuPhi, data) => {
    const newNgayPhuPhiId = taoNgayPhuPhiId(arrPhuPhi);
    const dataAdd = { ...data, ngayPhuPhiId: newNgayPhuPhiId };
    arrPhuPhi.push(dataAdd);
  };
  const taoNgayPhuPhiId = (arrPhuPhi) => {
    let ngayPhuPhiId;
    if (arrPhuPhi.length === 0) {
      ngayPhuPhiId = 1;
    } else {
      const lastItem = arrPhuPhi[arrPhuPhi.length - 1];
      ngayPhuPhiId = +lastItem.ngayPhuPhiId + 1;
    }
    return ngayPhuPhiId;
  };
  const sapXepLaiArrPhuPhiTheoNgayTangDan = (arrPhuPhi) => {
    arrPhuPhi.sort((a, b) =>
      new Date(a.ngayPhuPhi) < new Date(b.ngayPhuPhi) ? -1 : 1
    );
  };
  const thietLapArrPhuPhiRenderVaTruyenLenCompTren = (arrPhuPhi) => {
    setArrPhuPhi(arrPhuPhi);
    layDataPhuPhi(arrPhuPhi);
  };

  //Sửa ngày phụ phí
  const suaNgayPhuPhiHandler = (data) => {
    const arrClone = [...arrPhuPhi];
    const ngayMatched = timNgayPhuPhi(arrClone, +data.ngayPhuPhiId);
    updateDataNgayPhuPhi(ngayMatched, data);
    thietLapArrPhuPhiRenderVaTruyenLenCompTren(arrClone);
  };
  const updateDataNgayPhuPhi = (ngayMatched, data) => {
    if (!ngayMatched) {
      return;
    }
    ngayMatched.phuPhi = +data.phuPhi;
    ngayMatched.ghiChuPhuPhi = data.ghiChuPhuPhi;
  };

  //Xóa ngày phụ phí
  const xoaNgayPhuPhiHandler = (ngayPhuPhiId) => {
    let arrClone = [...arrPhuPhi];
    if (arrClone.length === 0) {
      setArrPhuPhi([]);
    }
    const indexNgayMatched = timIndexNgayPhuPhi(arrClone, ngayPhuPhiId);
    if (indexNgayMatched !== -1) {
      arrClone.splice(indexNgayMatched, 1);
    }
    thietLapArrPhuPhiRenderVaTruyenLenCompTren(arrClone);
  };
  const timIndexNgayPhuPhi = (arrPhuPhi, ngayPhuPhiId) => {
    if (!arrPhuPhi || !ngayPhuPhiId || arrPhuPhi.length === 0) {
      return;
    }
    const indexNgayMatched = arrPhuPhi.findIndex(
      (item) => +item.ngayPhuPhiId === +ngayPhuPhiId
    );
    return indexNgayMatched;
  };

  return (
    <div className={classes.container}>
      <h4>Tính phụ phí</h4>
      {viewThemPp && <FormThemPhuPhi themNgayPhuPhi={themNgayPhuPhiHandler} />}
      {!viewThemPp && (
        <FormSuaPhuPhi
          huySua={viewFormThemPhuPhi}
          dataNgayPhuPhi={dataNgaySua}
          suaNgayPhuPhi={suaNgayPhuPhiHandler}
        />
      )}

      {/* Bảng data phụ phí */}
      {arrPhuPhi.length > 0 && (
        <table style={{ width: "100%" }}>
          {/* Tiêu đề */}
          <thead>
            <tr>
              <td className={`${classes.cellTitle} ${classes.part2}`}>Ngày</td>
              <td className={`${classes.cellTitle} ${classes.part4}`}>
                Ghi chú
              </td>
              <td className={`${classes.cellTitle} ${classes.part2}`}>
                Thành tiền
              </td>
              <td className={`${classes.cellTitle} ${classes.part2}`}>
                Actions
              </td>
            </tr>
          </thead>
          {/* Phần thân data */}
          <tbody>
            {arrPhuPhi.length > 0 &&
              arrPhuPhi.map((item) => (
                <tr key={Math.random()}>
                  <td className={`${classes.cellData} ${classes.part2}`}>
                    <NgayBar ngay={new Date(item.ngayPhuPhi).getDate()} />
                  </td>
                  <td
                    className={`${classes.cellData} ${classes.part4}`}
                    style={{ padding: "0" }}
                  >
                    <div className={classes.ghichu}>{item.ghiChuPhuPhi}</div>
                  </td>
                  <td className={`${classes.cellData} ${classes.part2}`}>
                    {viewSplitMoney(item.phuPhi || 0)} đ
                  </td>
                  <td className={`${classes.cellData} ${classes.part2}`}>
                    <div className={classes.actions}>
                      <div
                        className={classes.sua}
                        onClick={loadDataMacDinhNgaySua.bind(
                          0,
                          item.ngayPhuPhiId
                        )}
                      >
                        Sửa
                      </div>
                      <div
                        className={classes.xoa}
                        onClick={xoaNgayPhuPhiHandler.bind(
                          0,
                          item.ngayPhuPhiId
                        )}
                      >
                        Xóa
                      </div>
                    </div>
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
                {viewSplitMoney(tongPhuPhi)} đ
              </td>
            </tr>
          </tfoot>
        </table>
      )}
      {arrPhuPhi.length === 0 && <p>Chưa có phụ phí cô Trang ê.</p>}
    </div>
  );
};

export default PhuPhi;
