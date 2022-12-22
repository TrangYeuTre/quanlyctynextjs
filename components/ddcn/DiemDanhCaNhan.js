import classes from "./DiemDanhCaNhan.module.css";
import Card from "../UI/Card";
import Layout28 from "../layout/layout-2-8";
import PickGiaoVienBar from "../UI/PickGiaoVienBar";
import { useContext, useState } from "react";
import GiaoVienContext from "../../context/giaoVienContext";
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
import DataGiaoVien from "../../classes/DataGiaoVien";

const DiemDanhCaNhanPage = (props) => {
  const router = useRouter();
  const arrGiaoVien = DataGiaoVien.arrGiaoVien;
  const gvCtx = useContext(GiaoVienContext);
  const notiCtx = useContext(NotiContext);
  const chonNguoiCtx = useContext(ChonNguoiContext);
  const giaoVienChonId = gvCtx.giaoVienSelectedId;
  const arrHocSinhChon = chonNguoiCtx.arrHocSinh;
  const arrHocSinhTangCuongCtx = chonNguoiCtx.arrGiaoVien;
  const [ngayDiemDanh, setNgayDiemDanh] = useState(new Date());
  const dataGiaoVienDuocChon =
    DataGiaoVien.timKiemGiaoVienTheoId(giaoVienChonId);

  //CALLBACKS
  const layNgayHandler = (date) => {
    setNgayDiemDanh(new Date(date));
  };
  const locLaiArrHsNghi = (arrHsChon) => {
    if (!arrHsChon || arrHsChon.length === 0) {
      return;
    }
    const result = arrHsChon.filter((item) => !item.isSelected);
    return result;
  };
  const locLaiArrHsDayChinh = (arrHsChon) => {
    if (!arrHsChon || arrHsChon.length === 0) {
      return;
    }
    const result = arrHsChon.filter((item) => item.isSelected);
    return result;
  };

  //HANDLERS
  //Xử lý lấy mảng hs tăng cường để chọn ban đầu
  const arrHocSinhTangCuongChonBanDau = layMangHsTangCuongDeChon(
    arrHocSinhChon,
    dataGiaoVienDuocChon
  );
  //xử lý lấy mảng hs tăng cường cuối đẻ submit
  const arrHsTangCuongSubmit = layMangHsTangCuongDeSubmit(
    arrHocSinhTangCuongChonBanDau,
    arrHocSinhTangCuongCtx
  );

  const arrHocSinhDayChinhSubmit = locLaiArrHsDayChinh(arrHocSinhChon);
  const arrHocSinhNghiSubmit = locLaiArrHsNghi(arrHocSinhChon);
  //Convert format lại các mảng cần cho submit
  const { arrHsHocChinh, arrHsNghi, arrHsTangCuong } = lay3MangHsSubmit(
    arrHocSinhDayChinhSubmit,
    arrHocSinhNghiSubmit,
    arrHsTangCuongSubmit
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

  //FUNCITONS
  const diemDanhCaNhanHandler = async () => {
    const { statusCode, dataGot } =
      await instanceDdcnMoi.themDiemDanhDayChinhMoi(objHocSinhData);
    dayThongBao(statusCode, dataGot);
  };
  const dayThongBao = (statusCode, dataGot) => {
    setTimeout(() => {
      notiCtx.clearNoti();
    }, process.env.DELAY_TIME_NOTI);
    notiCtx.pushNoti({
      status: statusCode,
      message: dataGot.thongbao,
    });
    window.scrollTo(0, 0);
  };

  const huyDiemDanhHandler = () => {
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
            <h1>Trang điểm danh cá nhân đây</h1>
            <div className={classes.controls}>
              <PickDateBar getNgayDuocChon={layNgayHandler} />
            </div>
            {dataGiaoVienDuocChon && (
              <div className={classes.controls}>
                <DayChinh
                  dataGiaoVien={dataGiaoVienDuocChon}
                  ngayDiemDanh={ngayDiemDanh}
                  arrHocSinhTangCuong={arrHocSinhTangCuongChonBanDau}
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
