import classes from "./TinhTienTam.module.css";
import { Fragment } from "react";
import { useState, useEffect } from "react";
import { viewSplitMoney } from "../../helper/uti";

const TinhTienTam = (props) => {
  //VARIABLES
  const {
    thongKeLich,
    hpCaNhan,
    hpNhom,
    arrNghiKhongBuCoPhep,
    arrNghiKhongBuKoPhep,
    arrNghiCoBu,
    arrTangCuong,
    tienNghiKhongBuCoPhep,
    tienNghiKhongBuKoPhep,
    tienTangCuong,
  } = props;
  const [hpCn, setHpCn] = useState();
  const [hpN, setHpN] = useState();
  const [hpDh, setHpDh] = useState(300000);

  //CALLBACKS
  const formatViewNgay = (date) => {
    return new Date(date).toLocaleString("en-GB", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };
  const getHpCaNhanHandler = (e) => {
    setHpCn(e.target.value);
  };
  const getHpNhomHandler = (e) => {
    setHpN(e.target.value);
  };
  const getHpDongHanhHandler = (e) => {
    setHpDh(e.target.value);
  };

  //HANDLERS
  const tinhToanCacThongSo = (dataIn) => {
    const {
      thongKeLich,
      hpCn,
      hpN,
      hpDh,
      tienNghiKhongBuCoPhep,
      tienNghiKhongBuKoPhep,
      tienTangCuong,
    } = dataIn;
    const tienCaNhan = thongKeLich.canhan * hpCn;
    const tienNhom = thongKeLich.nhom * hpN;
    const tienDongHanh = thongKeLich.donghanh * hpDh;
    const tienTong =
      tienCaNhan +
      tienNhom +
      tienDongHanh -
      tienNghiKhongBuCoPhep -
      tienNghiKhongBuKoPhep +
      tienTangCuong;
    return { tienCaNhan, tienNhom, tienDongHanh, tienTong };
  };
  const { tienCaNhan, tienNhom, tienDongHanh, tienTong } = tinhToanCacThongSo({
    thongKeLich,
    hpCn,
    hpN,
    hpDh,
    tienNghiKhongBuCoPhep,
    tienNghiKhongBuKoPhep,
    tienTangCuong,
  });

  //SIDE EFFECT
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
          {thongKeLich.canhan > 0 && (
            <Fragment>
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
                <p>+ {viewSplitMoney(tienCaNhan)} đ</p>
              </div>
            </Fragment>
          )}
          {thongKeLich.nhom > 0 && (
            <Fragment>
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
                <p>+ {viewSplitMoney(tienNhom)} đ</p>
              </div>
            </Fragment>
          )}

          {thongKeLich.donghanh > 0 && (
            <Fragment>
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
                <p>+ {viewSplitMoney(tienDongHanh)} đ</p>
              </div>
            </Fragment>
          )}

          {arrNghiKhongBuCoPhep && arrNghiKhongBuCoPhep.length > 0 && (
            <Fragment>
              {/* Nghỉ không bù có phép, hoàn tiền full */}
              <p style={{ fontWeight: "bold" }}>Ngày nghỉ có phép:</p>
              <div className={classes.thangTruoc}>
                <div className={classes.showNgay}>
                  {arrNghiKhongBuCoPhep.map((item) => (
                    <div
                      key={item.ngayDiemDanh}
                      className={classes.tagNghiKoBu}
                    >
                      Nghỉ : {formatViewNgay(item.ngayDiemDanh)}
                    </div>
                  ))}
                </div>
                <div className={classes.controls}>
                  <label>Thành tiền</label>
                  <p>- {viewSplitMoney(tienNghiKhongBuCoPhep)} đ</p>
                </div>
              </div>
            </Fragment>
          )}

          {arrNghiKhongBuKoPhep && arrNghiKhongBuKoPhep.length > 0 && (
            <Fragment>
              {/* Nghỉ không bù không phép, hoàn tiền theo hệ số */}
              <p style={{ fontWeight: "bold" }}>Ngày nghỉ không phép:</p>
              <div className={classes.thangTruoc}>
                <div className={classes.showNgay}>
                  {arrNghiKhongBuKoPhep.map((item) => (
                    <div
                      key={item.ngayDiemDanh}
                      className={classes.tagNghiKoBu}
                    >
                      Nghỉ : {formatViewNgay(item.ngayDiemDanh)}
                    </div>
                  ))}
                </div>
                <div className={classes.controls}>
                  <label>Thành tiền</label>
                  <p>- {viewSplitMoney(tienNghiKhongBuKoPhep)} đ</p>
                </div>
              </div>
            </Fragment>
          )}

          {arrNghiCoBu && arrNghiCoBu.length > 0 && (
            <Fragment>
              {/* Nghỉ có bù, show và không tính tiền  */}
              <p style={{ fontWeight: "bold" }}>Ngày nghỉ đã được dạy bù:</p>
              <div className={classes.thangTruoc}>
                <div className={classes.showNgay}>
                  {arrNghiCoBu.map((item) => (
                    <div
                      key={item.ngayDiemDanh}
                      className={classes.tagNghiKoBu}
                      style={{ paddingRight: "0" }}
                    >
                      Nghỉ: {formatViewNgay(item.ngayDiemDanh)}{" "}
                      <span
                        style={{
                          backgroundColor: "rgb(36, 145, 255)",
                          padding: "8px",
                          borderTopRightRadius: "5px",
                          borderBottomRightRadius: "5px",
                          borderLeft: "3px solid #fff",
                          marginLeft: "3px",
                        }}
                      >
                        Bù: {formatViewNgay(item.ngayDayBu)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className={classes.controls}></div>
              </div>
            </Fragment>
          )}

          {arrTangCuong && arrTangCuong.length > 0 && (
            <Fragment>
              {/* Học tăng cường */}
              <p style={{ fontWeight: "bold" }}>Ngày học tăng cường </p>
              <div className={classes.thangTruoc}>
                <div className={classes.showNgay}>
                  {arrTangCuong.map((item) => (
                    <div
                      key={item.ngayDiemDanh}
                      className={classes.tagTangCuong}
                    >
                      {formatViewNgay(item.ngayDiemDanh)}
                    </div>
                  ))}
                </div>
                <div className={classes.controls}>
                  <label>Thành tiền</label>
                  <p>+ {viewSplitMoney(tienTangCuong)} đ</p>
                </div>
              </div>
            </Fragment>
          )}

          {/* Tổng tiền */}
          <div className={classes.controls}>
            <label>
              Tổng tiền tạm tính:
              <span
                style={{
                  color: "var(--mauMh4--)",
                  fontWeight: "bold",
                  marginLeft: "1rem",
                }}
              >
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
