import classes from "./DsLopNhom.module.css";
import Card from "../UI/Card";
import LopNhomBar from "../UI/LopNhomBar";
import { useRouter } from "next/router";

const DanhSachLopNhomPage = (props) => {
  const router = useRouter();
  const { arrLopNhom } = props;
  //Cb xóa lớp nhóm
  const xoaLopNhomHandler = (id) => {
    console.log(id);
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
