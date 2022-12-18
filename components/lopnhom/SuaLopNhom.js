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
import DataLopNhom from "../../classes/DataLopNhom";
import { redirectPageAndResetState } from "../../helper/uti";

const SuaLopNhomPage = (props) => {
  //VARIABLES
  const router = useRouter();
  const notiCtx = useContext(NotiContext);
  const chonNguoiCtx = useContext(ChonNguoiContext);
  const arrGiaoVienChon = chonNguoiCtx.arrGiaoVien;
  const arrHocSinhChon = chonNguoiCtx.arrHocSinh;
  const arrHocSinhNhom = DataHocSinh.arrHocSinhNhom;
  const arrGiaoVien = DataGiaoVien.arrGiaoVien;
  const lopNhom = DataLopNhom.lopNhomChonData;
  const { giaoVienLopNhom, hocSinhLopNhom } = lopNhom;
  const tenLopNhomRef = useRef();

  //FUNCTIONS
  //Dựa vào 2 mảng giaoVienLopNhom và hocSinhLopNhom ban đầu truyền xuống comp này, đánh isSelected để chọn mặc định cho data sưa này
  //Đánh chọn mặc định học sinh nhóm
  const danhIsSelectedArrHsNhomMacDinhTrue = (
    hocSinhLopNhom,
    arrHocSinhNhom
  ) => {
    if (!isValidHocSinhLopNhom(hocSinhLopNhom)) {
      return;
    }
    hocSinhLopNhom.forEach((hocsinh) => {
      const hsNhomMatched = timHocSinhNhom(hocsinh.hocSinhId, arrHocSinhNhom);
      if (hsNhomMatched) {
        hsNhomMatched.isSelected = true;
      }
    });
  };
  const isValidHocSinhLopNhom = (hocSinhLopNhom) => {
    return hocSinhLopNhom;
  };
  const timHocSinhNhom = (hocSinhId, arrHsNhom) => {
    const hsNhomMatched = arrHsNhom.find((item) => item.id === hocSinhId);
    if (!hsNhomMatched) {
      return;
    }
    return hsNhomMatched;
  };
  danhIsSelectedArrHsNhomMacDinhTrue(hocSinhLopNhom, arrHocSinhNhom);

  //Đánh chọn mặc định giáo viên nhóm
  const danhIsSelectedArrGiaoVienMacDinhTrue = (
    giaoVienLopNhom,
    arrGiaoVien
  ) => {
    if (!isValidGiaoVienLopNhom(giaoVienLopNhom)) {
      return;
    }
    giaoVienLopNhom.forEach((giaovien) => {
      const giaoVienMatched = timGiaoVien(arrGiaoVien, giaovien.giaoVienId);
      if (giaoVienMatched) {
        giaoVienMatched.isSelected = true;
      }
    });
  };
  const isValidGiaoVienLopNhom = (giaoVienLopNhom) => {
    return giaoVienLopNhom;
  };
  const timGiaoVien = (arrGiaoVien, giaoVienId) => {
    const giaoVienMatched = arrGiaoVien.find(
      (giaovien) => giaovien.id === giaoVienId
    );
    if (!giaoVienMatched) {
      return;
    }
    return giaoVienMatched;
  };
  danhIsSelectedArrGiaoVienMacDinhTrue(giaoVienLopNhom, arrGiaoVien);

  //Load lần đầu thì lấy mảng hs và gv được đánh isSelected sẽ khác khi có thao tác chọn thêm, tách biệt cac màng để chọn render phù hợp như dưới
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

  const layTenLopNhom = () => {
    return tenLopNhomRef.current.value;
  };
  const createNewInstanceLopNhom = () => {
    const instanceLopNhom = new LopNhom({
      tenLopNhom: layTenLopNhom() || "",
      giaoVienLopNhom: arrGiaoVienDataSubmit,
      hocSinhLopNhom: arrHocSinhDataSubmit,
    });
    return instanceLopNhom;
  };

  const suaLopNhomHandler = async () => {
    const lopNhomUpdate = createNewInstanceLopNhom();
    const { statusCode, dataGot } = await lopNhomUpdate.suaLopNhom(
      lopNhom.lopNhomId
    );
    dayThongBao(statusCode, dataGot);
  };
  const dayThongBao = (statusCode, dataGot) => {
    setTimeout(() => {
      notiCtx.clearNoti();
      if (statusCode === 200 || statusCode == 201) {
        redirectPageAndResetState("/lop-nhom/ds-lop-nhom");
      }
    }, process.env.DELAY_TIME_NOTI);
    window.scrollTo(0, 0);
    notiCtx.pushNoti({ status: statusCode, message: dataGot.thongbao });
  };
  const huySuaLopNhomHandler = () => {
    redirectPageAndResetState("/lop-nhom/ds-lop-nhom");
  };

  return (
    <Card>
      <section className={classes.container}>
        {" "}
        <div className={classes.controls}>
          <label htmlFor="tenLopNhom">Thêm tên lớp nhóm:</label>
          <input
            type="text"
            id="tenLopNhom"
            ref={tenLopNhomRef}
            defaultValue={lopNhom.tenLopNhom}
            required
          />
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
            action1="Sửa"
            action2="Té"
            doAction1={suaLopNhomHandler}
            doAction2={huySuaLopNhomHandler}
            description="Phải chọn giáo viên và học sinh mới được Chốt nhé."
          />
        </div>
      </section>
    </Card>
  );
};

export default SuaLopNhomPage;
