import classes from "./ThemLopNhom.module.css";
import Card from "../UI/Card";
import ChonNguoi from "../UI/ChonNguoi";
import { useContext, useRef } from "react";
import ChonNguoiContext from "../../context/chonNguoiContext";
import NotiContext from "../../context/notiContext";
import ActionBar from "../UI/ActionBar";
import { useRouter } from "next/router";
import LopNhom from "../../classes/LopNhom";
import DataHocSinh from "../../classes/DataHocSinh";
import DataGiaoVien from "../../classes/DataGiaoVien";

const ThemLopNhomPage = (props) => {
  const router = useRouter();
  const notiCtx = useContext(NotiContext);
  const chonNguoiCtx = useContext(ChonNguoiContext);
  const arrGiaoVienChon = chonNguoiCtx.arrGiaoVien;
  const arrHocSinhChon = chonNguoiCtx.arrHocSinh;
  const arrHocSinhNhom = DataHocSinh.arrHocSinhNhom;
  const arrGiaoVien = DataGiaoVien.arrGiaoVien;
  const tenLopNhomRef = useRef();

  // Mảng gv/hs dùng render ban đầu sẽ khác với khi có 1 hs/gv được chọn kich hoạt ctx - dùng function queyes định mảng nào renderÏ
  const chotArrGiaoVienRender = (arrGiaoVien, arrGiaoVienChon) => {
    let arrGiaoVienRender = arrGiaoVien;
    if (arrGiaoVienChon.length > 0) {
      arrGiaoVienRender = arrGiaoVienChon;
    }
    return arrGiaoVienRender;
  };
  const chotArrHocSinhRender = (arrHocSinhNhom, arrHocSinhChon) => {
    let arrHocSinhRender = arrHocSinhNhom;
    if (arrHocSinhChon.length > 0) {
      arrHocSinhRender = arrHocSinhChon;
    }
    return arrHocSinhRender;
  };
  const arrGiaoVienRender = chotArrGiaoVienRender(arrGiaoVien, arrGiaoVienChon);
  const arrHocSinhRender = chotArrHocSinhRender(arrHocSinhNhom, arrHocSinhChon);

  //CHú ý: 2 mảng render trên là full hs/gv có các hs/gv được đánh isSelected -> lọc lại mảng chỉ isSelected hs/gv để submit
  const locArrGiaoVienDataSubmit = (arrGiaoVienRender) => {
    const arrGiaoVienSelected = locArrNguoiSelected(arrGiaoVienRender);
    if (arrGiaoVienSelected.length > 0) {
      const arrResult = arrGiaoVienSelected.map((giaovien) => {
        return {
          giaoVienId: giaovien.id,
          luongNhom: giaovien.luongNhom,
          shortName: giaovien.shortName,
        };
      });
      return arrResult;
    }
  };
  const locArrHocSinhDataSubmit = (arrHocSinhRender) => {
    const arrHocSinhSelected = locArrNguoiSelected(arrHocSinhRender);
    if (arrHocSinhSelected.length > 0) {
      const arrResult = arrHocSinhSelected.map((hocsinh) => {
        return {
          hocSinhId: hocsinh.id,
          shortName: hocsinh.shortName,
        };
      });
      return arrResult;
    }
  };
  const locArrNguoiSelected = (arrNguoi) => {
    let arrResult = [];
    if (arrNguoi.length > 0) {
      arrResult = arrNguoi.filter((giaovien) => giaovien.isSelected);
    }
    return arrResult;
  };
  const arrGiaoVienDataSubmit = locArrGiaoVienDataSubmit(arrGiaoVienRender);
  const arrHocSinhDataSubmit = locArrHocSinhDataSubmit(arrHocSinhRender);

  const themLopNhomHandler = async () => {
    const lopNhomMoi = createNewInstanceLopNhom();
    const { statusCode, dataGot } = await lopNhomMoi.themLopNhom();
    dayThongBao(statusCode, dataGot);
  };
  const createNewInstanceLopNhom = () => {
    const instanceLopNhom = new LopNhom({
      tenLopNhom: layTenLopNhom() || "",
      giaoVienLopNhom: arrGiaoVienDataSubmit,
      hocSinhLopNhom: arrHocSinhDataSubmit,
    });
    return instanceLopNhom;
  };
  const layTenLopNhom = () => {
    return tenLopNhomRef.current.value;
  };
  const dayThongBao = (statusCode, dataGot) => {
    setTimeout(() => {
      notiCtx.clearNoti();
      if (statusCode === 200 || statusCode == 201) {
        reloadPage();
      }
    }, process.env.DELAY_TIME_NOTI);
    window.scrollTo(0, 0);
    notiCtx.pushNoti({ status: statusCode, message: dataGot.thongbao });
  };
  const huyThemLopNhomHandler = () => {
    reloadPage();
  };
  const reloadPage = () => {
    router.reload();
  };

  return (
    <Card>
      <section className={classes.container}>
        {" "}
        <div className={classes.controls}>
          <label htmlFor="tenLopNhom">Thêm tên lớp nhóm:</label>
          <input type="text" id="tenLopNhom" ref={tenLopNhomRef} required />
        </div>
        <div className={classes.controls}>
          <h3>Chọn giáo viên dạy lớp nhóm</h3>
          <ChonNguoi arrPeople={arrGiaoVienRender} type="giaovien" />
        </div>
        <div className={classes.controls}>
          <h3>Chọn học sinh cho lớp nhóm</h3>
          <ChonNguoi arrPeople={arrHocSinhRender} type="hocsinh" />
        </div>
        <div className={classes.controls}>
          <ActionBar
            action1="Chốt"
            action2="Té"
            doAction1={themLopNhomHandler}
            doAction2={huyThemLopNhomHandler}
            description="Phải chọn giáo viên và học sinh mới được Chốt nhé."
          />
        </div>
      </section>
    </Card>
  );
};

export default ThemLopNhomPage;
