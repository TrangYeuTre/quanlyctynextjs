import classes from "./TinhTienTam.module.css";
import { Fragment } from "react";
import { useState, useEffect } from "react";
import { viewSplitMoney } from "../../helper/uti";

const TinhTienTam = (props) => {
  const { thongKeLich, hpCaNhan, hpNhom } = props;
  //State quan sát học phí của 3 loại lớp
  const [hpCn, setHpCn] = useState();
  const [hpN, setHpN] = useState();
  const [hpDh, setHpDh] = useState(300000);
  //Cb onChange quan sát thay đổi của các input
  const getHpCaNhanHandler = (e) => {
    setHpCn(e.target.value);
  };
  const getHpNhomHandler = (e) => {
    setHpN(e.target.value);
  };
  const getHpDongHanhHandler = (e) => {
    setHpDh(e.target.value);
  };
  //TÍnh kết quả
  const tienCaNhan = thongKeLich.canhan * hpCn;
  const tienNhom = thongKeLich.nhom * hpN;
  const tienDongHanh = thongKeLich.donghanh * hpDh;
  const tienTong = tienCaNhan + tienNhom + tienDongHanh;
  //Side effect load học phí lần đầu
  useEffect(() => {
    setHpCn(hpCaNhan);
    setHpN(hpNhom);
  }, [hpCaNhan, hpNhom]);
  return (
    <Fragment>
      {Object.keys(thongKeLich).length === 0 && (
        <div className={classes.container}>Chưa chốt lịch</div>
      )}
      {Object.keys(thongKeLich).length > 0 && (
        <div className={classes.container}>
          {/* Cá nhân */}
          <p style={{ fontWeight: "bold" }}>Cá nhân</p>
          <div className={classes.controls}>
            <label>Số ngày:</label>
            <p>{thongKeLich.canhan || 0}</p>
            <label>Học phí:</label>
            <input
              step="1000"
              type="number"
              style={{ width: "7rem" }}
              value={hpCn || 0}
              onChange={getHpCaNhanHandler}
            />
            <label>Thành tiền</label>
            <p>{viewSplitMoney(tienCaNhan)} đ</p>{" "}
          </div>
          {/* Nhóm */}
          <p style={{ fontWeight: "bold" }}>Nhóm</p>
          <div className={classes.controls}>
            <label>Số ngày:</label>
            <p>{thongKeLich.nhom || 0}</p>
            <label>Học phí:</label>
            <input
              step="1000"
              type="number"
              style={{ width: "7rem" }}
              value={hpN || 0}
              onChange={getHpNhomHandler}
            />
            <label>Thành tiền</label>
            <p>{viewSplitMoney(tienNhom)} đ</p>{" "}
          </div>
          {/* Đòng hành */}
          <p style={{ fontWeight: "bold" }}>Đồng hành</p>
          <div className={classes.controls}>
            <label>Số ngày:</label>
            <p>{thongKeLich.donghanh || 0}</p>
            <label>Học phí:</label>
            <input
              step="1000"
              type="number"
              style={{ width: "7rem" }}
              value={hpDh || 0}
              onChange={getHpDongHanhHandler}
            />
            <label>Thành tiền</label>
            <p>{viewSplitMoney(tienDongHanh)} đ</p>{" "}
          </div>
          {/* Tổng tiền */}
          <div className={classes.controls}>
            <label>
              Tổng tiền tạm tính:{" "}
              <span style={{ color: "var(--mauMh4--)", fontWeight: "bold" }}>
                {viewSplitMoney(tienTong)} đ{" "}
              </span>
            </label>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default TinhTienTam;
