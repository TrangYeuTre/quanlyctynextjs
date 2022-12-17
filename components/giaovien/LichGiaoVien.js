import Card from "../UI/Card";
import Layout28 from "../layout/layout-2-8";
import PickGiaoVienBar from "../UI/PickGiaoVienBar";
import classes from "./HsPhuTrach.module.css";
import { useContext, Fragment, useState, useEffect } from "react";
import { removeDomItem } from "../../helper/uti";
import GiaoVienContext from "../../context/giaoVienContext";
import LichBar from "../UI/LichBar";
import NotiContext from "../../context/notiContext";
import GiaoVien from "../../classes/GiaoVien";
import DataGiaoVien from "../../classes/DataGiaoVien";

const LichGiaoVienPage = (props) => {
  //VARIABLES
  const arrGiaoVien = DataGiaoVien.arrGiaoVien;
  const notiCtx = useContext(NotiContext);
  const giaoVienCtx = useContext(GiaoVienContext);
  const giaoVienDuocChonId = giaoVienCtx.giaoVienSelectedId;
  const [giaoVienChon, setGiaoVienChon] = useState();

  //FUNCTIONS
  const xoaLichHandler = async (lichId) => {
    if (isValidLichIdAndGiaoVienId(lichId, giaoVienDuocChonId)) {
      const { statusCode, dataGot } = await GiaoVien.xoaLichGiaoVien(
        lichId,
        giaoVienDuocChonId
      );
      dayThongBao(statusCode, dataGot, lichId);
    }
  };
  const isValidLichIdAndGiaoVienId = (lichId, giaoVienDuocChonId) => {
    return lichId && giaoVienDuocChonId;
  };
  const dayThongBao = (statusCode, dataGot, lichId) => {
    setTimeout(() => {
      notiCtx.clearNoti();
      if (statusCode === 200 || statusCode == 201) {
        removeDomItem(lichId);
      }
    }, process.env.DELAY_TIME_NOTI);
    notiCtx.pushNoti({ status: statusCode, message: dataGot.thongbao });
  };

  //SIDE EFFECT
  useEffect(() => {
    const giaoVienMatched =
      DataGiaoVien.timKiemGiaoVienTheoId(giaoVienDuocChonId);
    setGiaoVienChon(giaoVienMatched);
  }, [giaoVienDuocChonId]);

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
