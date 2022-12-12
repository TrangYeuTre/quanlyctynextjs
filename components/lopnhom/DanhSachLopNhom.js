import classes from "./DsLopNhom.module.css";
import Card from "../UI/Card";
import LopNhomBar from "../UI/LopNhomBar";
import { useRouter } from "next/router";
import { useContext } from "react";
import NotiContext from "../../context/notiContext";
import { removeDomItem } from "../../helper/uti";
import LopNhom from "../../classes/LopNhom";

const DanhSachLopNhomPage = (props) => {
  const API_LOPNHOM_ROUTE = "/api/lopnhom/lopNhom";
  const router = useRouter();
  //Ctx thông báo
  const notiCtx = useContext(NotiContext);
  //Lấy data từ props
  const { arrLopNhom } = props;
  //Cb xóa lớp nhóm
  const xoaLopNhomHandler = async (id) => {
    const { statusCode, dataGot } = await LopNhom.xoaLopNhom(id);
    //Đẩy thông báo
    setTimeout(() => {
      notiCtx.clearNoti();
      if (statusCode == 200 || statusCode === 201) {
        removeDomItem(id);
      }
    }, process.env.DELAY_TIME_NOTI);
    notiCtx.pushNoti({ status: statusCode, message: dataGot.thongbao });
  };
  //Cb sửa lớp nhom
  const suaLopNhomHandler = (id) => {
    router.push(`/lop-nhom/sua/${id}`);
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
