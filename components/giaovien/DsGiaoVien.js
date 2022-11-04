import Card from "../UI/Card";
import { useEffect, useState } from "react";
import PersonBar from "../UI/PersonBar";
import Search from "../UI/Search";
import { sortArtByLastShortName } from "../../helper/uti";
import classes from "../hocsinh/DsHocSinh.module.css";

const DanhSachGiaoVienPage = (props) => {
  //Lấy về từ props
  const { arrGiaoVienGot } = props;
  //State lấy keyword search
  const [searchKey, setSearchKey] = useState("");
  //Mảng kết quả hs render
  //Quan trọng : arrHocsinh (arrGiaoVien ở dưới) đã được fitler nhóm hay cá nhân từ SSG nên ở đây không cần quan tâm
  const [arrGiaoVien, setArrGiaoVien] = useState([]);
  //CB lấy key search
  const setSearchKeyHandler = (value) => {
    setSearchKey(value);
  };

  //Xử lý side effect láy mảng giáo viên nếu có search
  useEffect(() => {
    if (!searchKey || searchKey === "") {
      //Không search - lấy full
      setArrGiaoVien(sortArtByLastShortName(arrGiaoVienGot));
    } else {
      //Search
      const arrFilter = arrGiaoVienGot.filter((item) =>
        item.shortName
          .toLowerCase()
          .trim()
          .includes(searchKey.toLowerCase().trim())
      );
      setArrGiaoVien(sortArtByLastShortName(arrFilter));
    }
  }, [searchKey, arrGiaoVienGot]);
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
            currentRoute="/giao-vien/ds-giao-vien"
            arrLoaiLop={[]}
          />
        ))}
      </div>
    </Card>
  );
};

export default DanhSachGiaoVienPage;
