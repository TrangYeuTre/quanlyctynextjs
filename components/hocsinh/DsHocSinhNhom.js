import Card from "../UI/Card";
import { useEffect, useState } from "react";
import PersonBar from "../UI/PersonBar";
import Search from "../UI/Search";
import { removeDomItem } from "../../helper/uti";
import classes from "./DsHocSinh.module.css";
import { useContext } from "react";
import NotiContext from "../../context/notiContext";
import HocSinh from "../../classes/HocSinh";
import DataHocSinh from "../../classes/DataHocSinh";

const DanhSachHocSinhNhomPage = (props) => {
  //VARIABLE
  const notiCtx = useContext(NotiContext);
  const [searchKey, setSearchKey] = useState("");
  const [arrHocSinh, setArrHocSinh] = useState([]);
  //CB SET STATE
  const setSearchKeyHandler = (value) => {
    setSearchKey(value);
  };
  //FUNCTION
  const delHocSinhHandler = async (id) => {
    const { statusCode, dataGot } = await HocSinh.xoaHocSinh(id);
    dayThongBao(statusCode, dataGot, id);
  };
  const dayThongBao = (statusCode, dataGot, id) => {
    setTimeout(() => {
      notiCtx.clearNoti();
      if (statusCode === 200 || statusCode === 201) {
        removeDomItem(id);
      }
    }, process.env.DELAY_TIME_NOTI);
    notiCtx.pushNoti({ status: statusCode, message: dataGot.thongbao });
  };

  //Xử lý side effect láy mảng hs nếu có search
  useEffect(() => {
    const isEmptySearch = () => {
      return !searchKey || searchKey === "";
    };
    if (isEmptySearch()) {
      setArrHocSinh(DataHocSinh.arrHocSinhNhom);
    } else {
      const arrHocSinhNhomTrungSearch =
        DataHocSinh.timKiemHsNhomTheoShortName(searchKey);
      setArrHocSinh(arrHocSinhNhomTrungSearch);
    }
  }, [searchKey]);
  return (
    <Card>
      <div className={classes.container}>
        <Search hint="Tìm tên học sinh..." getKeyword={setSearchKeyHandler} />
        {arrHocSinh.length > 0 &&
          arrHocSinh.map((item) => (
            <PersonBar
              key={item.id}
              id={item.id}
              shortName={item.shortName}
              gioiTinh={item.gioiTinh}
              arrLoaiLop={item.lopHoc}
              doDelFetch={delHocSinhHandler}
            />
          ))}
      </div>
    </Card>
  );
};

export default DanhSachHocSinhNhomPage;
