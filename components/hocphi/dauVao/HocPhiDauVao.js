import classes from "./HocPhiDauVao.module.css";
import Card from "../../UI/Card";
import ChonMotNguoi from "../../UI/ChonMotNguoi";
import Search from "../../UI/Search";
import PickDateBar from "../../UI/PickDateBar";
import ChonNguoiContext from "../../../context/chonNguoiContext";
import { useState, useContext, Fragment } from "react";
import { chuyenNgayView } from "../hocphi_helper";
import NotiContext from "../../../context/notiContext";
import {
  convertInputDateFormat,
  getFirstLastDateOfNextMonth,
} from "../../../helper/uti";
import Link from "next/link";
import DataHocSinh from "../../../classes/DataHocSinh";
import HocPhiHocSinh from "../../../classes/HocPhiHocSinh";

const HocPhiDauVaoPage = (props) => {
  //VARIABLES
  const notiCtx = useContext(NotiContext);
  const chonNguoiCtx = useContext(ChonNguoiContext);
  const hocSinhChonId = chonNguoiCtx.nguoiDuocChonId;
  const [showDauVao, setShowDauVao] = useState(true);
  const [keySearch, setKeySearch] = useState();
  const [ngayChon, setNgayChon] = useState(new Date());
  const [kqLoc, setKqLoc] = useState();
  const { firstDateOfNextMonth } = getFirstLastDateOfNextMonth(ngayChon);
  const viewNextMonth = new Date(firstDateOfNextMonth).toLocaleString("en-GB", {
    month: "numeric",
    year: "numeric",
  });
  const viewThisMonth = new Date(ngayChon).toLocaleString("en-GB", {
    month: "numeric",
    year: "numeric",
  });
  const hocSinhChonShortName = DataHocSinh.traHsCaNhanData(hocSinhChonId)
    ? DataHocSinh.traHsCaNhanData(hocSinhChonId).shortName
    : "";
  const arrHocSinhRender = DataHocSinh.timKiemHsCaNhanTheoShortName(keySearch);

  //CALLBACKS
  const showUiDauVaoHandler = () => {
    setShowDauVao(true);
  };
  const layKeySearchHandler = (value) => {
    setKeySearch(value);
  };
  const layNgayChonHandler = (date) => {
    setNgayChon(date);
  };

  //FUNCITONS
  const xuLyThongTinDauVaoHandler = async () => {
    const dataSubmit = layDataSubmit(hocSinhChonId, ngayChon);
    const { statusCode, dataGot } = await HocPhiHocSinh.xuLyDauVao(dataSubmit);
    setKqLoc(dataGot.data);
    dayThongBao(statusCode, dataGot);
  };
  const layDataSubmit = (hocSinhChonId, ngayChon) => {
    const dataSubmit = {
      hocSinhId: hocSinhChonId || null,
      ngayChon: convertInputDateFormat(ngayChon) || null,
    };
    return dataSubmit;
  };
  const dayThongBao = (statusCode, dataGot) => {
    setTimeout(() => {
      notiCtx.clearNoti();
      if (statusCode === 200 || statusCode === 201) {
        setShowDauVao(false);
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
            Ch???n h???c sinh ????? t??nh ph?? th??ng m???i{" "}
            <span
              style={{ color: "var(--mauMh1--)", cursor: "pointer" }}
            ></span>
          </h4>
          <div className={classes.container}>
            <Search
              getKeyword={layKeySearchHandler}
              hint="Nh???p ch??? c??i t??n h???c sinh ????? t??m ..."
            />
            <ChonMotNguoi arrPeople={arrHocSinhRender} />
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
          {hocSinhChonId && (
            <button
              type="button"
              style={{ margin: "2rem auto", width: "70%" }}
              className="btn btn-submit"
              onClick={xuLyThongTinDauVaoHandler}
            >
              Ch???t n??
            </button>
          )}
          {!hocSinhChonId && (
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
              Ch???n h???c sinh v?? ng??y ????? ch???t
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
              <label>H???c sinh</label>
              <p style={{ color: "var(--mauMh4--)" }}>{hocSinhChonShortName}</p>
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
            {kqLoc.dataPhiThangSauId && kqLoc.dataPhiThangSauId !== "none" && (
              <div className={classes.controls}>
                <label>
                  Th??ng sau l??{" "}
                  <span style={{ color: "var(--mauMh4--)" }}>
                    {viewNextMonth}
                  </span>
                  . Th??ng n??y{" "}
                  <span style={{ color: "var(--mauMh4--)" }}>???? ???????c</span> t??nh
                  ph??, ???n v??o n??t b??n ????? s???a n???u mu???n
                </label>
                <Link
                  href={`/hoc-phi/sua?hocSinhId=${hocSinhChonId}&thangTinh=${viewNextMonth}`}
                >
                  <div className="btn btn-sub">S???a ph??</div>
                </Link>
              </div>
            )}

            {kqLoc.dataPhiThangSauId && kqLoc.dataPhiThangSauId === "none" && (
              <div className={classes.controls}>
                <label>
                  Th??ng sau l??{" "}
                  <span style={{ color: "var(--mauMh4--)" }}>
                    {viewNextMonth}
                  </span>
                  . Th??ng n??y{" "}
                  <span style={{ color: "var(--mauMh4--)" }}>ch??a ???????c</span>{" "}
                  t??nh ph??, ???n v??o n??t b??n ????? t??nh
                </label>
                <Link
                  href={`/hoc-phi/tinh-toan?hocSinhId=${hocSinhChonId}&thangTinh=${viewNextMonth}`}
                >
                  <div className="btn btn-sub">T??nh ph?? th??ng sau</div>
                </Link>
              </div>
            )}

            {kqLoc.dataPhiDaTonTai && kqLoc.dataPhiDaTonTai !== "none" && (
              <div className={classes.controls}>
                <label>
                  Th??ng n??y l??{" "}
                  <span style={{ color: "var(--mauMh4--)" }}>
                    {viewThisMonth}
                  </span>
                  . Th??ng n??y{" "}
                  <span style={{ color: "var(--mauMh4--)" }}>???? ???????c</span> t??nh
                  ph??, ???n v??o n??t b??n ????? t??nh
                </label>
                <Link
                  href={`/hoc-phi/sua?hocSinhId=${hocSinhChonId}&thangTinh=${viewThisMonth}`}
                >
                  <div className="btn btn-sub">S???a ph??</div>
                </Link>
              </div>
            )}

            {kqLoc.dataPhiDaTonTai && kqLoc.dataPhiDaTonTai === "none" && (
              <div className={classes.controls}>
                <label>
                  Th??ng n??y l??{" "}
                  <span style={{ color: "var(--mauMh4--)" }}>
                    {viewThisMonth}
                  </span>
                  . Th??ng n??y{" "}
                  <span style={{ color: "var(--mauMh4--)" }}>ch??a ???????c</span>{" "}
                  t??nh ph??, ???n v??o n??t b??n ????? t??nh
                </label>
                <Link
                  href={`/hoc-phi/tinh-toan?hocSinhId=${hocSinhChonId}&thangTinh=${viewThisMonth}`}
                >
                  <div className="btn btn-sub">T??nh ph?? th??ng n??y</div>
                </Link>
              </div>
            )}
          </div>
        </Fragment>
      )}
    </Card>
  );
};

export default HocPhiDauVaoPage;
