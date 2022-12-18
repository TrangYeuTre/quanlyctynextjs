import classes from "./DsLopNhom.module.css";
import Card from "../UI/Card";
import LopNhomBar from "../UI/LopNhomBar";
import { useRouter } from "next/router";
import { useContext } from "react";
import NotiContext from "../../context/notiContext";
import { removeDomItem, redirectPageAndResetState } from "../../helper/uti";
import LopNhom from "../../classes/LopNhom";
import DataLopNhom from "../../classes/DataLopNhom";

const DanhSachLopNhomPage = (props) => {
  //VARIABLES
  const router = useRouter();
  const notiCtx = useContext(NotiContext);
  const arrLopNhom = DataLopNhom.arrLopNhom;

  //FUNCTIONS
  const xoaLopNhomHandler = async (lopNhomId) => {
    const { statusCode, dataGot } = await LopNhom.xoaLopNhom(lopNhomId);
    dayThongBao(statusCode, dataGot, lopNhomId);
  };
  const dayThongBao = (statusCode, dataGot, lopNhomId) => {
    setTimeout(() => {
      notiCtx.clearNoti();
      if (statusCode == 200 || statusCode === 201) {
        removeDomItem(lopNhomId);
      }
    }, process.env.DELAY_TIME_NOTI);
    notiCtx.pushNoti({ status: statusCode, message: dataGot.thongbao });
  };
  const suaLopNhomHandler = (lopNhomId) => {
    redirectPageAndResetState(`/lop-nhom/sua/${lopNhomId}`);
  };

  return (
    <Card>
      <div className={classes.container}>
        {!arrLopNhom ||
          (arrLopNhom.length === 0 && <h3>Chưa có lớp nhóm nào</h3>)}
        {arrLopNhom &&
          arrLopNhom.length > 0 &&
          arrLopNhom.map((lopnhom) => (
            <LopNhomBar
              key={lopnhom.id}
              id={lopnhom.id}
              data={lopnhom}
              doXoaLopNhom={xoaLopNhomHandler}
              doSuaLopNhom={suaLopNhomHandler}
            />
          ))}
      </div>
    </Card>
  );
};

export default DanhSachLopNhomPage;
