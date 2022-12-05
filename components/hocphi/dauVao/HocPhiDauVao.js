import classes from "./HocPhiDauVao.module.css";
import Card from "../../UI/Card";
import ChonMotNguoi from "../../UI/ChonMotNguoi";
import Search from "../../UI/Search";
import PickDateBar from "../../UI/PickDateBar";
import ChonNguoiContext from "../../../context/chonNguoiContext";
import { useState, useContext, Fragment } from "react";
import {
  layArrHocSinhRender,
  layThongTinHocSinhTuId,
  chuyenNgayView,
} from "../hocphi_helper";
import NotiContext from "../../../context/notiContext";
import {
  convertInputDateFormat,
  getFirstLastDateOfNextMonth,
} from "../../../helper/uti";
import Link from "next/link";

const HocPhiDauVaoPage = (props) => {
  const { arrHocSinh } = props;
  const API_HOCPHI_DAUVAO = "/api/hocphi/locThongTinDauVao";
  //CTx noti
  const notiCtx = useContext(NotiContext);
  //Láy ctx chọn người đẻ lấy học sinh được chọn
  const chonNguoiCtx = useContext(ChonNguoiContext);
  const hocSinhChonId = chonNguoiCtx.nguoiDuocChonId;
  const hocSinhChonShortName = layThongTinHocSinhTuId(
    arrHocSinh,
    hocSinhChonId
  ).shortName;
  //State load ui đầu vào hay ui đã xử lý fetch data về
  const [showDauVao, setShowDauVao] = useState(true);
  //State lấy keyword từ search để lọc
  const [keySearch, setKeySearch] = useState();
  //State lấy ngày chọn
  const [ngayChon, setNgayChon] = useState(new Date());
  //State lấy kết quả lọc sau khi fetch
  const [kqLoc, setKqLoc] = useState();

  //Lấy view tháng sau từ ngày chọn để render phần ôption
  const { firstDateOfNextMonth } = getFirstLastDateOfNextMonth(ngayChon);
  const viewNextMonth = new Date(firstDateOfNextMonth).toLocaleString("en-GB", {
    month: "numeric",
    year: "numeric",
  });
  const viewThisMonth = new Date(ngayChon).toLocaleString("en-GB", {
    month: "numeric",
    year: "numeric",
  });

  //Cb trở lại giao diện lọc ban đầu
  const showUiDauVaoHandler = () => {
    setShowDauVao(true);
  };

  //Cb lấy key từ comp Search
  const layKeySearchHandler = (value) => {
    setKeySearch(value);
  };
  //Cb lấy ngày được chọn
  const layNgayChonHandler = (date) => {
    setNgayChon(date);
  };
  //Lọc lại mảng hs theo key để render
  const arrHocSinhRender = layArrHocSinhRender(keySearch, arrHocSinh);

  //Cb xử lý lấy thông tin đầu vào và fetch lên db đẻ lọc data cần lấy về
  const xuLyThongTinDauVaoHandler = async () => {
    //Lấy data submit
    const dataSubmit = {
      hocSinhId: hocSinhChonId || null,
      ngayChon: convertInputDateFormat(ngayChon) || null,
    };
    const response = await fetch(API_HOCPHI_DAUVAO, {
      method: "POST",
      body: JSON.stringify(dataSubmit),
      headers: { "Content-Type": "application/json" },
    });
    const statusCode = response.status;
    const dataGot = await response.json();
    setKqLoc(dataGot.data);
    //Đẩy thông báo nào
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
      {/* Giao diện ban đầu xử lý chọn học sinh va ngày để lọc thông tin */}
      {showDauVao && (
        <Fragment>
          <h4>
            Chọn học sinh để tính phí tháng mới{" "}
            <span
              style={{ color: "var(--mauMh1--)", cursor: "pointer" }}
            ></span>
          </h4>
          <div className={classes.container}>
            <Search
              getKeyword={layKeySearchHandler}
              hint="Nhập chữ cái tên học sinh để tìm ..."
            />
            <ChonMotNguoi arrPeople={arrHocSinhRender} />
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
          {hocSinhChonId && (
            <button
              type="button"
              style={{ margin: "2rem auto", width: "70%" }}
              className="btn btn-submit"
              onClick={xuLyThongTinDauVaoHandler}
            >
              Chốt nè
            </button>
          )}
          {!hocSinhChonId && (
            <btn
              type="button"
              style={{
                margin: "2rem auto",
                width: "70%",
                textAlign: "center",
                cursor: "not-allowed",
              }}
              className="btn btn-ghost"
            >
              Chọn học sinh và ngày để chốt
            </btn>
          )}
        </Fragment>
      )}
      {/* Giao diện sau khi đã xử lý để chọn hành động tiếp theo */}
      {!showDauVao && (
        <Fragment>
          <h4>Thông tin đã chọn</h4>
          <div className={classes.container}>
            <div className={classes.controls}>
              <label>Học sinh</label>
              <p style={{ color: "var(--mauMh4--)" }}>{hocSinhChonShortName}</p>
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
            {kqLoc.dataPhiThangSauId && kqLoc.dataPhiThangSauId !== "none" && (
              <div className={classes.controls}>
                <label>
                  Tháng sau là{" "}
                  <span style={{ color: "var(--mauMh4--)" }}>
                    {viewNextMonth}
                  </span>
                  . Tháng này{" "}
                  <span style={{ color: "var(--mauMh4--)" }}>đã được</span> tính
                  phí, ấn vào nút bên để sửa nếu muốn
                </label>
                <Link href="#">
                  <div className="btn btn-sub">Sửa phí</div>
                </Link>
              </div>
            )}

            {kqLoc.dataPhiThangSauId && kqLoc.dataPhiThangSauId === "none" && (
              <div className={classes.controls}>
                <label>
                  Tháng sau là{" "}
                  <span style={{ color: "var(--mauMh4--)" }}>
                    {viewNextMonth}
                  </span>
                  . Tháng này{" "}
                  <span style={{ color: "var(--mauMh4--)" }}>chưa được</span>{" "}
                  tính phí, ấn vào nút bên để tính
                </label>
                <Link
                  href={`/hoc-phi/tinh-toan?hocSinhId=${hocSinhChonId}&thangTinh=${viewNextMonth}`}
                >
                  <div className="btn btn-sub">Tính phí tháng sau</div>
                </Link>
              </div>
            )}
            {kqLoc.dataPhiDaTonTai && kqLoc.dataPhiDaTonTai !== "none" && (
              <div className={classes.controls}>
                <label>
                  Tháng này là{" "}
                  <span style={{ color: "var(--mauMh4--)" }}>
                    {viewThisMonth}
                  </span>
                  . Tháng này{" "}
                  <span style={{ color: "var(--mauMh4--)" }}>đã được</span> tính
                  phí, ấn vào nút bên để tính
                </label>
                <Link href="#">
                  <div className="btn btn-sub">Sửa phí</div>
                </Link>
              </div>
            )}

            {kqLoc.dataPhiDaTonTai && kqLoc.dataPhiDaTonTai === "none" && (
              <div className={classes.controls}>
                <label>
                  Tháng này là{" "}
                  <span style={{ color: "var(--mauMh4--)" }}>
                    {viewThisMonth}
                  </span>
                  . Tháng này{" "}
                  <span style={{ color: "var(--mauMh4--)" }}>chưa được</span>{" "}
                  tính phí, ấn vào nút bên để tính
                </label>
                <Link
                  href={`/hoc-phi/tinh-toan?hocSinhId=${hocSinhChonId}&thangTinh=${viewThisMonth}`}
                >
                  <div className="btn btn-sub">Tính phí tháng này</div>
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
