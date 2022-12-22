import classes from "./DiemDanhNhom.module.css";
import Card from "../UI/Card";
import Layout28 from "../layout/layout-2-8";
import PickLopNhomBar from "../UI/PickLopNhomBar";
import PickDateBar from "../UI/PickDateBar";
import { useState, Fragment, useContext } from "react";
import {
  layArrGvCuaLopNhom,
  layArrGvChonMacDinhCuaLopNhom,
  layObjSubmit,
  layTenLopNhom,
} from "./ddn_helper";
import ChonNguoi from "../UI/ChonNguoi";
import ChonNguoiContext from "../../context/chonNguoiContext";
import NotiContext from "../../context/notiContext";
import ActionBar from "../UI/ActionBar";
import NgayDaChotDiemDanh from "../UI/NgayChot";
import { useRouter } from "next/router";
import DataGiaoVien from "../../classes/DataGiaoVien";
import DataLopNhom from "../../classes/DataLopNhom";

const DiemDanhNhomPage = (props) => {
  //VARIABLES
  const arrGiaoVien = DataGiaoVien.arrGiaoVien;
  const arrLopNhom = DataLopNhom.arrLopNhom;
  const router = useRouter();
  const chonNguoiCtx = useContext(ChonNguoiContext);
  const arrGiaoVienCtx = chonNguoiCtx.arrGiaoVien;
  const notiCtx = useContext(NotiContext);
  const [lopNhomChonId, setLopNhomChonId] = useState();
  const [disChot, setDisChot] = useState(false);
  const tenLopNhomChon = DataLopNhom.traTenLopNhomChon(lopNhomChonId);
  const [ngayChon, setNgayChon] = useState(new Date());

  //CALLBACKS
  const layNgayDiemDanhNhomHandler = (date) => {
    setNgayChon(date);
  };
  const layLopNhomChonIdHandler = (idLopNhom) => {
    setLopNhomChonId(idLopNhom);
  };

  //HANDLERS
  //Lấy mảng giáo viên trong lớp nhóm trước
  const arrGiaoVienCuaLopNhom = layArrGvCuaLopNhom(arrLopNhom, lopNhomChonId);
  //Từ mảng giáo viên full isSelected false -> đánh giáo viên trong lớp nhóm trong mảng này isSelected true
  const arrGiaoVienDefault = layArrGvChonMacDinhCuaLopNhom(
    arrGiaoVien,
    arrGiaoVienCuaLopNhom
  );
  const chotArrGiaoVienRender = (arrGiaoVienDefault, arrGiaoVienCtx) => {
    let arrGiaoVienRender = arrGiaoVienDefault;
    if (arrGiaoVienCtx && arrGiaoVienCtx.length > 0) {
      arrGiaoVienRender = arrGiaoVienCtx;
    }
    return arrGiaoVienRender;
  };
  const arrGiaoVienRender = chotArrGiaoVienRender(
    arrGiaoVienDefault,
    arrGiaoVienCtx
  );

  //FUNTIONS
  const diemDanhNhomHandler = async () => {
    setDisChot(true);
    const { instanceDdnMoi, objGiaoVien } = layObjSubmit(
      ngayChon,
      arrGiaoVienRender,
      lopNhomChonId,
      tenLopNhomChon
    );
    const { statusCode, dataGot } =
      await instanceDdnMoi.themNgayDiemDanhNhomMoi(objGiaoVien);
    dayThongBao(statusCode, dataGot);
  };
  const dayThongBao = (statusCode, dataGot) => {
    setTimeout(() => {
      notiCtx.clearNoti();
      setDisChot(false);
    }, process.env.DELAY_TIME_NOTI);
    window.scrollTo(0, 0);
    notiCtx.pushNoti({ status: statusCode, message: dataGot.thongbao });
  };
  const huyDiemDanhNhomHandler = () => {
    router.reload();
  };

  return (
    <Card>
      <Layout28>
        <div className="smallArea">
          <PickLopNhomBar
            arrLopNhom={arrLopNhom}
            layLopNhomId={layLopNhomChonIdHandler}
          />
        </div>
        <div className="bigArea">
          {!lopNhomChonId && <h3>Chọn lớp nhóm để thao tác</h3>}
          {lopNhomChonId && (
            <Fragment>
              <div className={classes.controls}>
                <PickDateBar
                  title="Chọn ngày điểm danh nhóm"
                  getNgayDuocChon={layNgayDiemDanhNhomHandler}
                />
              </div>
              <div className={classes.controls}>
                <NgayDaChotDiemDanh ngayDiemDanh={ngayChon} />
                <h4>Chọn giáo viên điểm danh nhóm</h4>
                <ChonNguoi arrPeople={arrGiaoVienRender} type="giaovien" />
                <ActionBar
                  disAction1={disChot}
                  action1="Chốt"
                  action2="Té"
                  doAction1={diemDanhNhomHandler}
                  doAction2={huyDiemDanhNhomHandler}
                  description="---------->"
                />
              </div>
            </Fragment>
          )}
        </div>
      </Layout28>
    </Card>
  );
};

export default DiemDanhNhomPage;
