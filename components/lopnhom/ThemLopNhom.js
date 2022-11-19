import classes from "./ThemLopNhom.module.css";
import Card from "../UI/Card";
import ChonNguoi from "../UI/ChonNguoi";
import { useContext, useRef } from "react";
import ChonNguoiContext from "../../context/chonNguoiContext";
import ActionBar from "../UI/ActionBar";

const ThemLopNhomPage = (props) => {
  //Ctx lấy mảng được chọn
  const chonNguoiCtx = useContext(ChonNguoiContext);
  const arrGiaoVienChon = chonNguoiCtx.arrGiaoVien;
  const arrHocSinhChon = chonNguoiCtx.arrHocSinh;
  //Cần từ props mảng học sinh nhóm và giáo viên ở đây
  const { arrHocSinhNhom, arrGiaoVien } = props;
  //Ref lấy tên
  const tenLopNhomRef = useRef();
  //Nếu arr giáo viên / hs trên chọn người trên ctx có tồn tại thì lấy mảng này render
  let arrGiaoVienRender = arrGiaoVien;
  let arrHocSinhRender = arrHocSinhNhom;
  if (arrGiaoVienChon.length > 0) {
    arrGiaoVienRender = arrGiaoVienChon;
  }
  if (arrHocSinhChon.length > 0) {
    arrHocSinhRender = arrHocSinhChon;
  }

  //CB chính submit thêm lớp nhóm
  const themLopNhomHandler = async () => {
    //Lấy tên, phần này nếu tên rỗng thì api trả lại lỗi
    const tenLopNhom = tenLopNhomRef.current.value;

    //Xử lý lấy mảng hoc sinh và giáo viên
    const arrGiaoVienLopNhom = arrGiaoVienRender.map((gv) => {
      return {
        giaoVienId: gv.id,
        luongNhom: gv.luongNhom,
        shortName: gv.shortName,
      };
    });
    const arrHocSinhLopNhom = arrHocSinhRender.map((hs) => {
      return {
        hocSinhId: hs.id,
        shortName: hs.shortName,
      };
    });
    const dataSubmit = {
      tenLopNhom,
      giaoVienLopNhom: arrGiaoVienLopNhom,
      hocSinhLopNhom: arrHocSinhLopNhom,
    };
    console.log(dataSubmit);
  };
  //Cb Hủy thêm
  const huyThemLopNhomHandler = () => {
    console.log("Hủy thêm");
  };
  //Xử lý biến tĩnh quyết định có được chốt không
  let disChot = true;
  const arrGvDaChon = arrGiaoVienRender.filter((i) => i.isSelected);
  const arrHsDaChon = arrHocSinhRender.filter((i) => i.isSelected);
  if (arrGvDaChon.length > 0 && arrHsDaChon.length > 0) {
    disChot = false;
  }

  //Trả
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
            disAction1={disChot}
          />
        </div>
      </section>
    </Card>
  );
};

export default ThemLopNhomPage;
