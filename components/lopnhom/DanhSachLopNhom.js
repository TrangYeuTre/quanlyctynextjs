import classes from "./DsLopNhom.module.css";
import Card from "../UI/Card";
import LopNhomBar from "../UI/LopNhomBar";
import { useRouter } from "next/router";
import { useContext } from "react";
import NotiContext from "../../context/notiContext";

const DanhSachLopNhomPage = (props) => {
  const API_LOPNHOM_ROUTE = "/api/lopnhom/lopNhom";
  const router = useRouter();
  //Ctx thông báo
  const notiCtx = useContext(NotiContext);
  //Lấy data từ props
  const { arrLopNhom } = props;
  //Cb xóa lớp nhóm
  const xoaLopNhomHandler = async (id) => {
    const response = await fetch(API_LOPNHOM_ROUTE, {
      method: "DELETE",
      body: JSON.stringify(id),
      headers: { "Content-Type": "application/json" },
    });
    const statusCode = response.status;
    const dataGot = await response.json();
    //Đẩy thông báo
    setTimeout(() => {
      notiCtx.clearNoti();
      router.reload();
    }, process.env.DELAY_TIME_NOTI);
    window.scrollTo(0, 0);
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
