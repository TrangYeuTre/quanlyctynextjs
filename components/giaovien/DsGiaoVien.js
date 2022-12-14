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
  const notiCtx = useContext(NotiContext);
  //State lấy keyword search
  const [searchKey, setSearchKey] = useState("");
  //Mảng kết quả hs render
  //Quan trọng : arrHocsinh (arrGiaoVien ở dưới) đã được fitler nhóm hay cá nhân từ SSG nên ở đây không cần quan tâm
  const [arrGiaoVien, setArrGiaoVien] = useState([]);
  //CB lấy key search
  const setSearchKeyHandler = (value) => {
    setSearchKey(value);
  };
  //Cb xóa giáo viên
  const delGiaoVienHandler = async (id) => {
    //Class xóa giáo viên
    const { statusCode, dataGot } = await GiaoVien.xoaGiaoVien(id);
    //Đẩy thông báo
    setTimeout(() => {
      notiCtx.clearNoti();
      if ((statusCode === 200) | (statusCode === 201)) {
        removeDomItem(id);
      }
    }, process.env.DELAY_TIME_NOTI);
    window.scrollTo(0, 0);
    notiCtx.pushNoti({ status: statusCode, message: dataGot.thongbao });
  };

  //Xử lý side effect láy mảng giáo viên nếu có search
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
