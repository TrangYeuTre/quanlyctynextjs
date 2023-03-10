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
      {/* Giao di???n ban ?????u x??? l?? ch???n h???c sinh va ng??y ????? l???c th??ng tin */}
      {showDauVao && (
        <Fragment>
          <h4>
            Ch???n gi??o vi??n ????? t??nh l????ng{" "}
            <span
              style={{ color: "var(--mauMh1--)", cursor: "pointer" }}
            ></span>
          </h4>
          <div className={classes.container}>
            <ChonMotNguoi arrPeople={arrGiaoVien} />
          </div>
          {/* ___________________________________________________ */}
          <h4 style={{ paddingTop: "2rem" }}>
            Ch???n ng??y ????? x??? l??{" "}
            <span
              style={{ color: "var(--mauMh1--)", cursor: "pointer" }}
            ></span>
          </h4>
          <div className={classes.container}>
            <PickDateBar
              getNgayDuocChon={layNgayChonHandler}
              hint="Ch???n ng??y ????? x??? l??."
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
              Ch???t n??
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
              Ch???n gi??o vi??n v?? ng??y ????? ch???t
            </button>
          )}
        </Fragment>
      )}
      {/* Giao di???n sau khi ???? x??? l?? ????? ch???n h??nh ?????ng ti???p theo */}
      {!showDauVao && (
        <Fragment>
          <h4>Th??ng tin ???? ch???n</h4>
          <div className={classes.container}>
            <div className={classes.controls}>
              <label>Gi??o vi??n</label>
              <p style={{ color: "var(--mauMh4--)" }}>{shortName}</p>
              <label>Ng??y ???? ch???n:</label>
              <p style={{ color: "var(--mauMh4--)" }}>
                {chuyenNgayView(ngayChon)}
              </p>
              <button
                type="button"
                onClick={showUiDauVaoHandler}
                className="btn btn-sub"
              >
                Ch???n l???i
              </button>
            </div>
          </div>
          <h4>Ch???n ????? thao t??c ti???p</h4>
          <div className={classes.container}>
            {kqLoc && kqLoc !== "none" && (
              <div className={classes.controls}>
                <label>
                  Th??ng n??y l??{" "}
                  <span style={{ color: "var(--mauMh4--)" }}>
                    {viewThisMonth}
                  </span>
                  . Th??ng n??y{" "}
                  <span style={{ color: "var(--mauMh4--)" }}>???? ???????c</span> t??nh
                  l????ng, ???n v??o n??t b??n ????? s???a n???u mu???n
                </label>
                <Link
                  href={
                    luongThangIdTonTai
                      ? `/luong/sua?luongThangId=${luongThangIdTonTai}&giaoVienId=${giaoVienChonId}&thangTinh=${viewThisMonth}`
                      : null
                  }
                >
                  <div className="btn btn-sub">S???a l????ng</div>
                </Link>
              </div>
            )}

            {kqLoc && kqLoc === "none" && (
              <div className={classes.controls}>
                <label>
                  Th??ng n??y l??{" "}
                  <span style={{ color: "var(--mauMh4--)" }}>
                    {viewThisMonth}
                  </span>
                  . Th??ng n??y{" "}
                  <span style={{ color: "var(--mauMh4--)" }}>ch??a ???????c</span>{" "}
                  t??nh l????ng, ???n v??o n??t b??n ????? t??nh
                </label>
                <Link
                  href={`/luong/tinh-toan?giaoVienId=${giaoVienChonId}&thangTinh=${viewThisMonth}`}
                >
                  <div className="btn btn-sub">T??nh l????ng th??ng n??y</div>
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
