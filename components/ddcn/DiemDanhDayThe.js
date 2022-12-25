import classes from "./DiemDanhCaNhan.module.css";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { layTenThuTuNgay } from "../../helper/uti";
import { layArrHocSinhDayThe, getObjSubmitDayThe } from "./ddcn_helper";
import ChonNguoiContext from "../../context/chonNguoiContext";
import NotiContext from "../../context/notiContext";
import Card from "../UI/Card";
import Layout28 from "../layout/layout-2-8";
import PickGiaoVienBar from "../UI/PickGiaoVienBar";
import GiaoVienContext from "../../context/giaoVienContext";
import PickDateBar from "../UI/PickDateBar";
import ActionBar from "../UI/ActionBar";
import ChonNguoi from "../UI/ChonNguoi";
import DataGiaoVien from "../../classes/DataGiaoVien";

const DiemDanhDayThePage = (props) => {
  const router = useRouter();
  const notiCtx = useContext(NotiContext);
  const gvCtx = useContext(GiaoVienContext);
  const chonNguoiCtx = useContext(ChonNguoiContext);
  const arrHocSinhChon = chonNguoiCtx.arrHocSinh;
  const giaoVienChonId = gvCtx.giaoVienSelectedId;
  const arrGiaoVien = DataGiaoVien.arrGiaoVien;
  const arrGiaoVienDayThe = DataGiaoVien.layArrGiaoVienDayThe(giaoVienChonId);
  const [ngayDiemDanh, setNgayDiemDanh] = useState(new Date());
  const [giaoVienDayTheId, setGiaoVienDayTheId] = useState("none");
  const dataGiaoVienDuocChon =
    DataGiaoVien.timKiemGiaoVienTheoId(giaoVienChonId);
  const giaoVienDayTheShortName = DataGiaoVien.timKiemGiaoVienTheoId(
    giaoVienDayTheId
  )
    ? DataGiaoVien.timKiemGiaoVienTheoId(giaoVienDayTheId).shortName
    : "";

  //CALLBACKS
  const layNgayHandler = (date) => {
    setNgayDiemDanh(new Date(date));
  };
  const layGiaoVienDayTheIdHandler = (e) => {
    setGiaoVienDayTheId(e.target.value);
  };
  const fortmatViewNgay = (date) => {
    return new Date(date).toLocaleString(
      ("en-GB",
      {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      })
    );
  };

  //HANDLERS
  //Xử lý xem mảng học trò đẻ chọn dạy thế render
  const { arrHocTroCaNhan, arrHocTroDayThe } = layArrHocSinhDayThe(
    dataGiaoVienDuocChon,
    arrHocSinhChon
  );
  //Tổng hợp lại data submit theo obj only
  const { instaceNgayDayTheMoi, objHocSinhData } = getObjSubmitDayThe(
    arrHocTroDayThe,
    ngayDiemDanh,
    giaoVienChonId,
    giaoVienDayTheId,
    giaoVienDayTheShortName,
    dataGiaoVienDuocChon
  );

  //FUNCTIONS
  const diemDanhDayTheHandler = async () => {
    const { statusCode, dataGot } =
      await instaceNgayDayTheMoi.themDiemDanhDayTheMoi(objHocSinhData);
    dayThongBao(statusCode, dataGot);
  };
  const dayThongBao = (statusCode, dataGot) => {
    setTimeout(() => {
      notiCtx.clearNoti();
      router.reload();
    }, process.env.DELAY_TIME_NOTI);
    window.scrollTo(0, 0);
    notiCtx.pushNoti({
      status: statusCode,
      message: dataGot.thongbao,
    });
  };
  const huyDdDayTheHandler = () => {
    router.reload();
  };

  return (
    <Card>
      <Layout28>
        <div className="smallArea">
          <PickGiaoVienBar arrGiaoVien={arrGiaoVien} />
        </div>
        {giaoVienChonId && (
          <div className="bigArea">
            <h1>Trang điểm danh dạy thế</h1>
            <div className={classes.controls}>
              <PickDateBar getNgayDuocChon={layNgayHandler} />
            </div>
            {dataGiaoVienDuocChon && (
              <div className={classes.controls}>
                <div className={classes.container}>
                  {/* Vùng xác nhận ngày được chọn */}
                  <h4>Ngày đã chốt điểm danh</h4>
                  <p className={classes.warning}>
                    Thứ: <span>{layTenThuTuNgay(ngayDiemDanh)}</span> --- Ngày:{" "}
                    <span>{fortmatViewNgay(ngayDiemDanh)}</span>
                  </p>
                  {/* Vùng chọn giáo viên day thế */}
                  <div className={classes.control}>
                    <h4 htlmlfor="chonGiaoVienDayThe">
                      Chọn giáo viên dạy thế:
                    </h4>
                    <select
                      id="chonGiaoVienDayThe"
                      onChange={layGiaoVienDayTheIdHandler}
                      defaultValue="none"
                    >
                      <option value="none">None</option>
                      {arrGiaoVienDayThe &&
                        arrGiaoVienDayThe.map((giaovien) => (
                          <option key={giaovien.id} value={giaovien.id}>
                            {giaovien.shortName}
                          </option>
                        ))}
                    </select>
                  </div>
                  {/* Vùng chọn học sinh dạy thế */}
                  <h4>
                    Chọn học sinh của giáo viên{" "}
                    <span style={{ color: "var(--mauMh4--)" }}>
                      {dataGiaoVienDuocChon.shortName}
                    </span>{" "}
                    để dạy thế
                  </h4>
                  <ChonNguoi arrPeople={arrHocTroCaNhan} type="hocsinh" />
                </div>
              </div>
            )}
            {dataGiaoVienDuocChon && (
              <div className={classes.controls}>
                <ActionBar
                  action1="Điểm danh"
                  action2="Hủy"
                  disAction1={giaoVienDayTheId === "none" ? true : false}
                  doAction1={diemDanhDayTheHandler}
                  doAction2={huyDdDayTheHandler}
                  description="---------->"
                />
              </div>
            )}
          </div>
        )}
        {!giaoVienChonId && (
          <div className="bigArea">
            <h3>Chọn giáo viên để thao tác tiếp</h3>
          </div>
        )}
      </Layout28>
    </Card>
  );
};

export default DiemDanhDayThePage;
