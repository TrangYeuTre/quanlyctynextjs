import classes from "./Phuphi.module.css";
import { viewSplitMoney } from "../../../helper/uti";
import FormThemPhuPhi from "./FormThemPhuPhi";
import FormSuaPhuPhi from "./FormSuaPhuPhi";
import { useState } from "react";
import NgayBar from "../../UI/NgayBar";
import { tinhTongPhuPhi } from "../luong_helper";

const PhuPhi = (props) => {
  const { layDataPhuPhi } = props;
  //State view thêm/ sửa phụ phí
  const [viewThemPp, setViewThemPp] = useState(true);
  //State lấy data của ngày được sửa
  const [dataNgaySua, setDataNgaySua] = useState();
  //State chính lấy mảng data phụ phí
  const [arrPhuPhi, setArrPhuPhi] = useState([]);
  //Cb view thêm hay sửa phụ phí
  const viewFormThemPhuPhi = () => {
    setViewThemPp(true);
  };
  const viewFormSuaPhuPhi = (id) => {
    setViewThemPp(false);
    //TÌm data ngày sửa
    let dataNgaySua = {};
    const itemMatch = arrPhuPhi.find((item) => +item.ngayPhuPhiId === +id);
    if (itemMatch) {
      dataNgaySua = itemMatch;
    }
    setDataNgaySua(dataNgaySua);
  };

  //Cb chính thêm phụ phí ngày mới
  const themNgayPhuPhiHandler = (data) => {
    //Clone lại mảng phụ phí
    const arrClone = [...arrPhuPhi];
    //Xư lý thêm prop ngayPhuPhiId cho data
    if (arrClone.length === 0) {
      const dataUpdate = { ...data, ngayPhuPhiId: 1 };
      //Push nó vào
      arrClone.push(dataUpdate);
    } else {
      //Trường hợp đã tồn tại
      const lastItem = arrClone[arrClone.length - 1];
      const newId = +lastItem.ngayPhuPhiId + 1;
      const dataUpdate = { ...data, ngayPhuPhiId: newId };
      //Push nó vào
      arrClone.push(dataUpdate);
    }
    //Sort lại mảng
    arrClone.sort((a, b) =>
      new Date(a.ngayDiemDanh) < new Date(b.ngayDiemDanh) ? -1 : 1
    );
    //setArrPhuPhi
    setArrPhuPhi(arrClone);
    layDataPhuPhi(arrClone);
  };

  //Cb sửa ngày phụ phí
  const suaNgayPhuPhiHandler = (data) => {
    //clone lại arr phụ hí
    const arrClone = [...arrPhuPhi];
    //Tìm và update lại data
    const ngayMatched = arrClone.find(
      (item) => +item.ngayPhuPhiId === +data.ngayPhuPhiId
    );
    if (ngayMatched) {
      ngayMatched.phuPhi = +data.phuPhi;
      ngayMatched.ghiChuPhuPhi = data.ghiChuPhuPhi;
    }
    setArrPhuPhi(arrClone);
    layDataPhuPhi(arrClone);
  };

  //Cb xóa phụ phí ngày mới
  const xoaNgayPhuPhiHandler = (id) => {
    //Clone
    let arrClone = [...arrPhuPhi];
    if (arrClone.length === 0) {
      setArrPhuPhi([]);
    }
    //Tìm id và xóa
    const indexNgayMatched = arrClone.findIndex(
      (item) => +item.ngayPhuPhiId === +id
    );
    console.log(indexNgayMatched);
    //Xóa
    if (indexNgayMatched !== -1) {
      arrClone.splice(indexNgayMatched, 1);
    }
    //Set lại
    setArrPhuPhi(arrClone);
    layDataPhuPhi(arrClone);
  };

  const tongPhuPhi = tinhTongPhuPhi(arrPhuPhi);

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
      <table style={{ width: "100%" }}>
        {/* Tiêu đề */}
        <thead>
          <tr>
            <td className={`${classes.cellTitle} ${classes.part2}`}>Ngày</td>
            <td className={`${classes.cellTitle} ${classes.part4}`}>Ghi chú</td>
            <td className={`${classes.cellTitle} ${classes.part2}`}>
              Thành tiền
            </td>
            <td className={`${classes.cellTitle} ${classes.part2}`}>Actions</td>
          </tr>
        </thead>
        {/* Phần thân data */}
        <tbody>
          {arrPhuPhi.length > 0 &&
            arrPhuPhi.map((item) => (
              <tr key={item.ngayPhuPhiId}>
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
                      onClick={viewFormSuaPhuPhi.bind(0, item.ngayPhuPhiId)}
                    >
                      Sửa
                    </div>
                    <div
                      className={classes.xoa}
                      onClick={xoaNgayPhuPhiHandler.bind(0, item.ngayPhuPhiId)}
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
    </div>
  );
};

export default PhuPhi;
