import Card from "../UI/Card";
import GiaoVien from "../../classes/GiaoVien";
import { useEffect, useState } from "react";
import PersonBar from "../UI/PersonBar";
import Search from "../UI/Search";
import { removeDomItem } from "../../helper/uti";
import classes from "../hocsinh/DsHocSinh.module.css";
import { useContext } from "react";
import NotiContext from "../../context/notiContext";
import DataGiaoVien from "../../classes/DataGiaoVien";

const DanhSachGiaoVienPage = (props) => {
  //VARIABLES
  const notiCtx = useContext(NotiContext);
  const [searchKey, setSearchKey] = useState("");
  const [arrGiaoVien, setArrGiaoVien] = useState([]);

  //CB SET STATE
  const setSearchKeyHandler = (value) => {
    setSearchKey(value);
  };

  //FUNCTION
  const delGiaoVienHandler = async (giaoVienId) => {
    const { statusCode, dataGot } = await GiaoVien.xoaGiaoVien(giaoVienId);
    dayThongBao(statusCode, dataGot, giaoVienId);
  };
  const dayThongBao = (statusCode, dataGot, id) => {
    setTimeout(() => {
      notiCtx.clearNoti();
      if ((statusCode === 200) | (statusCode === 201)) {
        removeDomItem(id);
      }
    }, process.env.DELAY_TIME_NOTI);
    window.scrollTo(0, 0);
    notiCtx.pushNoti({ status: statusCode, message: dataGot.thongbao });
  };

  //SIDE EFFECT
  useEffect(() => {
    const arrResult = DataGiaoVien.timKiemGiaoVienTheoShortName(searchKey);
    setArrGiaoVien(arrResult);
  }, [searchKey]);

  return (
    <Card>
      <div className={classes.container}>
        <Search hint="Tìm tên giáo viên..." getKeyword={setSearchKeyHandler} />
        {arrGiaoVien.map((item) => (
          <PersonBar
            key={item.id}
            id={item.id}
            shortName={item.shortName}
            gioiTinh={item.gioiTinh}
            arrLoaiLop={[]}
            doDelFetch={delGiaoVienHandler}
          />
        ))}
      </div>
    </Card>
  );
};

export default DanhSachGiaoVienPage;
