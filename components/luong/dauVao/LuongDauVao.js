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

const LuongDauVaoPage = (props) => {
  const { arrGiaoVien } = props;
  const API_HOCPHI_DAUVAO = "/api/luong/locThongTinDauVao";
  //CTx noti
  const notiCtx = useContext(NotiContext);
  //Láy ctx chọn người đẻ lấy học sinh được chọn
  const chonNguoiCtx = useContext(ChonNguoiContext);
  const giaoVienChonId = chonNguoiCtx.nguoiDuocChonId;
  //Lấy thông tin cần thiết từ giáo viên được chọnh
  const { shortName, luongCaNhan, luongNhom } = layDataGiaoVienDuocChon(
    arrGiaoVien,
    giaoVienChonId
  );
  //State load ui đầu vào hay ui đã xử lý fetch data về
  const [showDauVao, setShowDauVao] = useState(true);
  //State lấy ngày chọn
  const [ngayChon, setNgayChon] = useState(new Date());
  //State lấy kết quả lọc sau khi fetch
  // kqLoc này có thể là 'none' ứng với thêm mới, hoặc là chuỗi string id ứng với sửa
  const [kqLoc, setKqLoc] = useState();

  //Lấy view tháng sau từ ngày chọn để render phần ôption
  const viewThisMonth = new Date(ngayChon).toLocaleString("en-GB", {
    month: "numeric",
    year: "numeric",
  });
  //Cb trở lại giao diện lọc ban đầu
  const showUiDauVaoHandler = () => {
    setShowDauVao(true);
  };
  //Cb lấy ngày được chọn
  const layNgayChonHandler = (date) => {
    setNgayChon(date);
  };
  //Cb xử lý lấy thông tin đầu vào và fetch lên db đẻ lọc data cần lấy về
  const xuLyThongTinDauVaoHandler = async () => {
    //Lấy data submit
    const dataSubmit = {
      giaoVienId: giaoVienChonId || null,
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
                  href={`/luong/sua?giaoVienId=${giaoVienChonId}&thangTinh=${viewThisMonth}`}
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
