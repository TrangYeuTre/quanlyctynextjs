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

const DiemDanhNhomPage = (props) => {
  const { arrLopNhom, arrGiaoVien } = props;

  const router = useRouter();
  //Lấy context chọn người
  const chonNguoiCtx = useContext(ChonNguoiContext);
  const arrGiaoVienCtx = chonNguoiCtx.arrGiaoVien;
  //Lấy context thông báo
  const notiCtx = useContext(NotiContext);

  //State kiểm soát id lớp nhóm được chọn
  const [lopNhomChonId, setLopNhomChonId] = useState();
  //Tạo một state dis actons1 của ActionBar, khi bấm nút thêm thì dis nó, đến khi res thành công mới mở lại
  const [disChot, setDisChot] = useState(false);
  //Lấy tên lớp nhóm chọn
  const tenLopNhomChon = layTenLopNhom(arrLopNhom, lopNhomChonId);
  //State kiểm soát ngày được chọn để điểm danh
  const [ngayChon, setNgayChon] = useState(new Date());

  //Cb lấy ngày được chọn
  const layNgayDiemDanhNhomHandler = (date) => {
    setNgayChon(date);
  };

  //cb lấy lớp nhóm được chọn
  const layLopNhomChonIdHandler = (idLopNhom) => {
    setLopNhomChonId(idLopNhom);
  };

  //Lấy mảng giáo viên trong lớp nhóm trước
  const arrGiaoVienCuaLopNhom = layArrGvCuaLopNhom(arrLopNhom, lopNhomChonId);
  //Từ mảng giáo viên full isSelected false -> đánh giáo viên trong lớp nhóm trong mảng này isSelected true
  const arrGiaoVienDefault = layArrGvChonMacDinhCuaLopNhom(
    arrGiaoVien,
    arrGiaoVienCuaLopNhom
  );

  //QUyết định mảng nào được render
  let arrGiaoVienRender = arrGiaoVienDefault;
  if (arrGiaoVienCtx && arrGiaoVienCtx.length > 0) {
    arrGiaoVienRender = arrGiaoVienCtx;
  }
  //Cb chính ddn
  const diemDanhNhomHandler = async () => {
    setDisChot(true);
    //Lấy data submit
    const { instanceDdnMoi, objGiaoVien } = layObjSubmit(
      ngayChon,
      arrGiaoVienRender,
      lopNhomChonId,
      tenLopNhomChon
    );
    //Fetch thôi
    const { statusCode, dataGot } =
      await instanceDdnMoi.themNgayDiemDanhNhomMoi(objGiaoVien);
    //Đẩy thông báo
    setTimeout(() => {
      notiCtx.clearNoti();
      setDisChot(false);
    }, process.env.DELAY_TIME_NOTI);
    window.scrollTo(0, 0);
    notiCtx.pushNoti({ status: statusCode, message: dataGot.thongbao });
  };
  //Cb té ddn
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
