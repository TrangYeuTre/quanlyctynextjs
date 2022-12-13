import classes from "./DiemDanhCaNhan.module.css";
import Card from "../UI/Card";
import Layout28 from "../layout/layout-2-8";
import PickGiaoVienBar from "../UI/PickGiaoVienBar";
import { useContext, useState, useEffect } from "react";
import GiaoVienContext from "../../context/giaoVienContext";
import { convertInputDateFormat } from "../../helper/uti";
import {
  layMangHsTangCuongDeChon,
  lay3MangHsSubmit,
  layMangHsTangCuongDeSubmit,
  getObjSubmitDiemDanhChinh,
} from "./ddcn_helper";
import PickDateBar from "../UI/PickDateBar";
import DayChinh from "./DayChinh";
import ChonNguoiContext from "../../context/chonNguoiContext";
import NotiContext from "../../context/notiContext";
import ActionBar from "../UI/ActionBar";
import { useRouter } from "next/router";

//Comp chính
const DiemDanhCaNhanPage = (props) => {
  const { arrGiaoVien } = props;

  const router = useRouter();
  const gvCtx = useContext(GiaoVienContext);
  const notiCtx = useContext(NotiContext);
  //Lấy context giáo viên đẻ lấy id giáo viên được pick từ PickGiaoVienBar
  const giaoVienChonId = gvCtx.giaoVienSelectedId;
  //Thêm ctx  chọn người ở đây để truyền xuống render và lấy ds học sinh chonhj luôn
  const chonNguoiCtx = useContext(ChonNguoiContext);
  const arrHocSinhChon = chonNguoiCtx.arrHocSinh;
  //Mảng hs tăng cường chọn đã được lưu tạm trong arrGiaoVien trong chonNguoiCtx
  const arrHocSinhTangCuongCtx = chonNguoiCtx.arrGiaoVien;
  //Lấy lại 2 mảng chính nghỉ và dạy chính của học sinh
  const arrHocSinhNghi = arrHocSinhChon.filter((item) => !item.isSelected);
  const arrHocSinhDayChinh = arrHocSinhChon.filter((item) => item.isSelected);
  //State ngày được chọn để điểm danh
  const [ngayDiemDanh, setNgayDiemDanh] = useState(new Date());
  //Cb đổi ngày điểm danh
  const layNgayHandler = (date) => {
    setNgayDiemDanh(new Date(date));
  };
  //Lọc lại data giáo viên được chọn để truyền xuống phần chọn hóc sinh điểm danh chính
  const dataGiaoVienDuocChon = arrGiaoVien.find(
    (giaovien) => giaovien.id === giaoVienChonId
  );

  //Xử lý lấy mảng hs tăng cường để chọn ban đầu
  const arrHocSinhTangCuong = layMangHsTangCuongDeChon(
    arrHocSinhChon,
    dataGiaoVienDuocChon
  );

  //xử lý lấy mảng hs tăng cường cuối đẻ submit
  const arrHsTangCuongFinal = layMangHsTangCuongDeSubmit(
    arrHocSinhTangCuong,
    arrHocSinhTangCuongCtx
  );

  //Convert format lại các mảng cần cho submit
  const { arrHsHocChinh, arrHsNghi, arrHsTangCuong } = lay3MangHsSubmit(
    arrHocSinhDayChinh,
    arrHocSinhNghi,
    arrHsTangCuongFinal
  );
  //Chuyển mảng trên và các info cần thiét thành objSubmit, obj này là instance của class DDCN
  const { instanceDdcnMoi, objHocSinhData } = getObjSubmitDiemDanhChinh(
    arrHsHocChinh,
    arrHsNghi,
    arrHsTangCuong,
    ngayDiemDanh,
    giaoVienChonId,
    dataGiaoVienDuocChon
  );
  //CB chính submit
  const diemDanhCaNhanHandler = async () => {
    const { statusCode, dataGot } =
      await instanceDdcnMoi.themDiemDanhDayChinhMoi(objHocSinhData);
    //Chạy push noti
    setTimeout(() => {
      notiCtx.clearNoti();
      router.reload();
    }, process.env.DELAY_TIME_NOTI);
    notiCtx.pushNoti({
      status: statusCode,
      message: dataGot.thongbao,
    });
    window.scrollTo(0, 0);
  };
  //CB hủy điể danh
  const huyDiemDanhHandler = () => {};
  return (
    <Card>
      <Layout28>
        <div className="smallArea">
          <PickGiaoVienBar arrGiaoVien={arrGiaoVien} />
        </div>
        {giaoVienChonId && (
          <div className="bigArea">
            <h1>Trang điểm danh cá nhân đây</h1>
            <div className={classes.controls}>
              <PickDateBar getNgayDuocChon={layNgayHandler} />
            </div>
            {dataGiaoVienDuocChon && (
              <div className={classes.controls}>
                <DayChinh
                  dataGiaoVien={dataGiaoVienDuocChon}
                  ngayDiemDanh={ngayDiemDanh}
                  arrHocSinhTangCuong={arrHocSinhTangCuong}
                />
              </div>
            )}
            {dataGiaoVienDuocChon && (
              <div className={classes.controls}>
                <ActionBar
                  action1="Điểm danh"
                  action2="Hủy"
                  doAction1={diemDanhCaNhanHandler}
                  doAction2={huyDiemDanhHandler}
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

export default DiemDanhCaNhanPage;
