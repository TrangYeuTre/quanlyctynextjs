import Card from "../UI/Card";
import Layout28 from "../layout/layout-2-8";
import PickGiaoVienBar from "../UI/PickGiaoVienBar";
import classes from "./HsPhuTrach.module.css";
import { useContext, Fragment, useState, useEffect } from "react";
import { removeDomItem } from "../../helper/uti";
import GiaoVienContext from "../../context/giaoVienContext";
import LichBar from "../UI/LichBar";
import NotiContext from "../../context/notiContext";
// import { useRouter } from "next/router";
import GiaoVien from "../../classes/GiaoVien";
import DataGiaoVien from "../../classes/DataGiaoVien";

//Comp chính nè
const LichGiaoVienPage = (props) => {
  // const { arrGiaoVien } = props;
  const arrGiaoVien = DataGiaoVien.arrGiaoVien;
  //Lấy ctx giáo viên
  // const router = useRouter();
  const notiCtx = useContext(NotiContext);
  const giaoVienCtx = useContext(GiaoVienContext);
  const giaoVienDuocChonId = giaoVienCtx.giaoVienSelectedId;

  //Cb async xóa lịch
  const xoaLichHandler = async (id) => {
    if (id && giaoVienDuocChonId) {
      const { statusCode, dataGot } = await GiaoVien.xoaLichGiaoVien(
        id,
        giaoVienDuocChonId
      );
      //Đẩy thông báo
      setTimeout(() => {
        notiCtx.clearNoti();
        if (statusCode === 200 || statusCode == 201) {
          removeDomItem(id);
        }
      }, process.env.DELAY_TIME_NOTI);
      notiCtx.pushNoti({ status: statusCode, message: dataGot.thongbao });
    }
  };

  //State lấy giao vien được chọn
  const [giaoVienChon, setGiaoVienChon] = useState();
  //Side effect set giáo viên chọn
  useEffect(() => {
    const giaoVienMatched =
      DataGiaoVien.timKiemGiaoVienTheoId(giaoVienDuocChonId);
    setGiaoVienChon(giaoVienMatched);
  }, [giaoVienDuocChonId]);
  //Trả
  return (
    <Card>
      <Layout28>
        <Fragment>
          {" "}
          <section className={classes.smallArea}>
            <PickGiaoVienBar arrGiaoVien={arrGiaoVien} />
          </section>
          <section className={classes.bigArea}>
            {!giaoVienDuocChonId && <h3>Chọn giáo viên để thao tác tiếp.</h3>}
            {giaoVienChon &&
              giaoVienChon.lichDayCaNhan.map((lich) => (
                <LichBar
                  key={lich.lichId}
                  id={lich.lichId}
                  data={lich}
                  doXoaLich={xoaLichHandler}
                />
              ))}
          </section>
        </Fragment>
      </Layout28>
    </Card>
  );
};

export default LichGiaoVienPage;
