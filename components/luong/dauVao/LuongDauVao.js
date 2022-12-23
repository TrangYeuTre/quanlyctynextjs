import classes from "./LuongDauVao.module.css";
import Card from "../../UI/Card";
import ChonMotNguoi from "../../UI/ChonMotNguoi";
import PickDateBar from "../../UI/PickDateBar";
import ChonNguoiContext from "../../../context/chonNguoiContext";
import { useState, useContext, Fragment } from "react";
import { layDataGiaoVienDuocChon, chuyenNgayView } from "../luong_helper";
import NotiContext from "../../../context/notiContext";
import { convertInputDateFormat } from "../../../helper/uti";
import Link from "next/link";
import DataGiaoVien from "../../../classes/DataGiaoVien";
import LuongGiaoVien from "../../../classes/LuongGiaoVien";

const LuongDauVaoPage = (props) => {
  //VARIABLES
  const arrGiaoVien = DataGiaoVien.arrGiaoVien;
  const notiCtx = useContext(NotiContext);
  const chonNguoiCtx = useContext(ChonNguoiContext);
  const giaoVienChonId = chonNguoiCtx.nguoiDuocChonId;
  const shortName = DataGiaoVien.timKiemGiaoVienTheoId(giaoVienChonId)
    ? DataGiaoVien.timKiemGiaoVienTheoId(giaoVienChonId).shortName
    : "";
  const [luongThangIdTonTai, setLuongThangIdTonTai] = useState();
  const [showDauVao, setShowDauVao] = useState(true);
  const [ngayChon, setNgayChon] = useState(new Date());
  const [kqLoc, setKqLoc] = useState();
  const viewThisMonth = new Date(ngayChon).toLocaleString("en-GB", {
    month: "numeric",
    year: "numeric",
  });

  //CALLBACKS
  const showUiDauVaoHandler = () => {
    setShowDauVao(true);
  };
  const layNgayChonHandler = (date) => {
    setNgayChon(date);
  };

  //FUNCTIONS
  const xuLyThongTinDauVaoHandler = async () => {
    if (!isAllowFetching()) {
      return;
    }
    const dataSubmit = {
      giaoVienId: giaoVienChonId || null,
      ngayChon: convertInputDateFormat(ngayChon) || null,
    };
    const { statusCode, dataGot } = await LuongGiaoVien.xuLyThongTinDauVao(
      dataSubmit
    );
    capNhatKetQuaLoc(statusCode, dataGot);
    dayThongBao(statusCode, dataGot);
  };
  const isAllowFetching = () => {
    return (
      giaoVienChonId && ngayChon && giaoVienChonId !== "" && ngayChon !== ""
    );
  };
  const capNhatKetQuaLoc = (statusCode, dataGot) => {
    if (statusCode === 200 || statusCode == 201) {
      setKqLoc(dataGot.data);
    }
  };
  const dayThongBao = (statusCode, dataGot) => {
    setTimeout(() => {
      notiCtx.clearNoti();
      if (statusCode === 200 || statusCode === 201) {
        setShowDauVao(false);
        setLuongThangIdTonTai(dataGot.data);
      }
    }, process.env.DELAY_TIME_NOTI);
    window.scrollTo(0, 0);
    notiCtx.pushNoti({ status: statusCode, message: dataGot.thongbao });
  };

  return (
    <Card>
      {/* Giao diện ban đầu xử lý chọn học sinh va ngày để lọc thông tin */}
      {showDauVao && (
        <Fragment>
          <h4>
            Chọn giáo viên để tính lương{" "}
            <span
              style={{ color: "var(--mauMh1--)", cursor: "pointer" }}
            ></span>
          </h4>
          <div className={classes.container}>
            <ChonMotNguoi arrPeople={arrGiaoVien} />
          </div>
          {/* ___________________________________________________ */}
          <h4 style={{ paddingTop: "2rem" }}>
            Chọn ngày để xử lý{" "}
            <span
              style={{ color: "var(--mauMh1--)", cursor: "pointer" }}
            ></span>
          </h4>
          <div className={classes.container}>
            <PickDateBar
              getNgayDuocChon={layNgayChonHandler}
              hint="Chọn ngày để xử lý."
            />
          </div>
          {/* ___________________________________________________ */}
          {giaoVienChonId && (
            <button
              type="button"
              style={{ margin: "2rem auto", width: "70%" }}
              className="btn btn-submit"
              onClick={xuLyThongTinDauVaoHandler}
            >
              Chốt nè
            </button>
          )}
          {!giaoVienChonId && (
            <button
              type="button"
              style={{
                margin: "2rem auto",
                width: "70%",
                textAlign: "center",
                cursor: "not-allowed",
              }}
              className="btn btn-ghost"
            >
              Chọn giáo viên và ngày để chốt
            </button>
          )}
        </Fragment>
      )}
      {/* Giao diện sau khi đã xử lý để chọn hành động tiếp theo */}
      {!showDauVao && (
        <Fragment>
          <h4>Thông tin đã chọn</h4>
          <div className={classes.container}>
            <div className={classes.controls}>
              <label>Giáo viên</label>
              <p style={{ color: "var(--mauMh4--)" }}>{shortName}</p>
              <label>Ngày đã chọn:</label>
              <p style={{ color: "var(--mauMh4--)" }}>
                {chuyenNgayView(ngayChon)}
              </p>
              <button
                type="button"
                onClick={showUiDauVaoHandler}
                className="btn btn-sub"
              >
                Chọn lại
              </button>
            </div>
          </div>
          <h4>Chọn để thao tác tiếp</h4>
          <div className={classes.container}>
            {kqLoc && kqLoc !== "none" && (
              <div className={classes.controls}>
                <label>
                  Tháng này là{" "}
                  <span style={{ color: "var(--mauMh4--)" }}>
                    {viewThisMonth}
                  </span>
                  . Tháng này{" "}
                  <span style={{ color: "var(--mauMh4--)" }}>đã được</span> tính
                  lương, ấn vào nút bên để sửa nếu muốn
                </label>
                <Link
                  href={
                    luongThangIdTonTai
                      ? `/luong/sua?luongThangId=${luongThangIdTonTai}&giaoVienId=${giaoVienChonId}&thangTinh=${viewThisMonth}`
                      : null
                  }
                >
                  <div className="btn btn-sub">Sửa lương</div>
                </Link>
              </div>
            )}

            {kqLoc && kqLoc === "none" && (
              <div className={classes.controls}>
                <label>
                  Tháng này là{" "}
                  <span style={{ color: "var(--mauMh4--)" }}>
                    {viewThisMonth}
                  </span>
                  . Tháng này{" "}
                  <span style={{ color: "var(--mauMh4--)" }}>chưa được</span>{" "}
                  tính lương, ấn vào nút bên để tính
                </label>
                <Link
                  href={`/luong/tinh-toan?giaoVienId=${giaoVienChonId}&thangTinh=${viewThisMonth}`}
                >
                  <div className="btn btn-sub">Tính lương tháng này</div>
                </Link>
              </div>
            )}
          </div>
        </Fragment>
      )}
    </Card>
  );
};

export default LuongDauVaoPage;
