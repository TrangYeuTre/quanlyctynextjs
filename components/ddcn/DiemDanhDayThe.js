import classes from "./DiemDanhCaNhan.module.css";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { layTenThuTuNgay, convertInputDateFormat } from "../../helper/uti";
import {
  layArrGiaoVienDayThe,
  layArrHocSinhDayThe,
  layShortNameGiaoVienDayThe,
  getObjSubmitDayThe,
} from "./ddcn_helper";
import ChonNguoiContext from "../../context/chonNguoiContext";
import NotiContext from "../../context/notiContext";
import Card from "../UI/Card";
import Layout28 from "../layout/layout-2-8";
import PickGiaoVienBar from "../UI/PickGiaoVienBar";
import GiaoVienContext from "../../context/giaoVienContext";
import PickDateBar from "../UI/PickDateBar";
import ActionBar from "../UI/ActionBar";
import ChonNguoi from "../UI/ChonNguoi";

//Comp chính
const DiemDanhDayThePage = (props) => {
  const { arrGiaoVien } = props;

  const router = useRouter();
  const gvCtx = useContext(GiaoVienContext);
  const notiCtx = useContext(NotiContext);
  //Lấy context giáo viên đẻ lấy id giáo viên được pick từ PickGiaoVienBar
  const giaoVienChonId = gvCtx.giaoVienSelectedId;
  //Xử lý lấy mảng giáo viên day thế = loại giáo viên được chọn ra
  const arrGiaoVienDayThe = layArrGiaoVienDayThe(arrGiaoVien, giaoVienChonId);

  //Thêm ctx  chọn người ở đây để truyền xuống render và lấy ds học sinh chonhj luôn
  const chonNguoiCtx = useContext(ChonNguoiContext);
  const arrHocSinhChon = chonNguoiCtx.arrHocSinh;
  //State ngày được chọn để điểm danh
  const [ngayDiemDanh, setNgayDiemDanh] = useState(new Date());
  //State giáo viên dạy thế
  const [giaoVienDayTheId, setGiaoVienDayTheId] = useState("none");
  //Cb đổi ngày điểm danh
  const layNgayHandler = (date) => {
    setNgayDiemDanh(new Date(date));
  };
  //Cb lây giáo viên dạy thế id
  const layGiaoVienDayTheIdHandler = (e) => {
    setGiaoVienDayTheId(e.target.value);
  };
  //Lọc lại data giáo viên được chọn để truyền xuống phần chọn hóc sinh điểm danh chính
  const dataGiaoVienDuocChon = arrGiaoVien.find(
    (giaovien) => giaovien.id === giaoVienChonId
  );

  //Xử lý xem mảng học trò đẻ chọn dạy thế render
  const { arrHocTroCaNhan, arrHocTroDayThe } = layArrHocSinhDayThe(
    dataGiaoVienDuocChon,
    arrHocSinhChon
  );

  //Tra shortName của giáo viên dạy thế
  const giaoVienDayTheShortName = layShortNameGiaoVienDayThe(
    arrGiaoVien,
    giaoVienDayTheId
  );

  //Tổng hợp lại data submit theo obj only
  const dataSubmit = getObjSubmitDayThe(
    arrHocTroDayThe,
    ngayDiemDanh,
    giaoVienChonId,
    giaoVienDayTheId,
    giaoVienDayTheShortName,
    dataGiaoVienDuocChon
  );
  console.log(dataSubmit);

  //CB chính submit
  const diemDanhDayTheHandler = async () => {
    const response = await fetch("/api/ddcn/diemDanhDayThe", {
      method: "POST",
      body: JSON.stringify(dataSubmit),
      headers: { "Content-Type": "application/json" },
    });
    const statusCode = response.status;
    const dataRes = await response.json();
    //Chạy push noti
    setTimeout(() => {
      notiCtx.clearNoti();
      router.reload();
    }, process.env.DELAY_TIME_NOTI);
    notiCtx.pushNoti({
      status: statusCode,
      message: dataRes.thongbao,
    });
    window.scrollTo(0, 0);
  };
  //CB hủy điể danh
  const huyDdDayTheHandler = () => {};
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
                    <span>
                      {new Date(ngayDiemDanh).toLocaleString("en-GB", {
                        day: "numeric",
                        month: "numeric",
                        year: "numeric",
                      })}
                    </span>
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
