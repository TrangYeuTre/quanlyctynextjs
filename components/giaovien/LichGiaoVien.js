import Card from "../UI/Card";
import Layout28 from "../layout/layout-2-8";
import PickGiaoVienBar from "../UI/PickGiaoVienBar";
import classes from "./HsPhuTrach.module.css";
import { useContext, Fragment, useState, useEffect } from "react";
import { removeDomItem } from "../../helper/uti";
import GiaoVienContext from "../../context/giaoVienContext";
import LichBar from "../UI/LichBar";
import NotiContext from "../../context/notiContext";
import { useRouter } from "next/router";

//Comp chính nè
const LichGiaoVienPage = (props) => {
  const { arrGiaoVien } = props;
  //Lấy ctx giáo viên
  const router = useRouter();
  const notiCtx = useContext(NotiContext);
  const giaoVienCtx = useContext(GiaoVienContext);
  const giaoVienDuocChonId = giaoVienCtx.giaoVienSelectedId;

  //Cb async xóa lịch
  const xoaLichHandler = async (id) => {
    if (id && giaoVienDuocChonId) {
      const response = await fetch("/api/giaovien/lichChoHocSinhCuaGiaoVien", {
        method: "DELETE",
        body: JSON.stringify({ lichId: id, giaoVienId: giaoVienDuocChonId }),
        headers: { "Content-Type": "application/json" },
      });
      const statusCode = response.status;
      const dataGot = await response.json();
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
    const giaoVienMatched = arrGiaoVien.find(
      (i) => i.id === giaoVienDuocChonId
    );
    if (giaoVienMatched) {
      setGiaoVienChon(giaoVienMatched);
    }
  }, [arrGiaoVien, giaoVienDuocChonId]);
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
