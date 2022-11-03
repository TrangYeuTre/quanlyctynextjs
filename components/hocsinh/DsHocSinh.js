import Card from "../UI/Card";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import PersonBar from "../UI/PersonBar";
import Search from "../UI/Search";
import { sortArtByLastShortName } from "../../helper/uti";
import classes from "./DsHocSinh.module.css";

const DanhSachHocSinhPage = (props) => {
  //Lấy về từ props
  const { arrHocSinhDaPhanLoai } = props;
  //State lấy keyword search
  const [searchKey, setSearchKey] = useState("");
  //Mảng kết quả hs render
  //Quan trọng : arrHocsinh (arrHocSinhDaPhanLoai ở dưới) đã được fitler nhóm hay cá nhân từ SSG nên ở đây không cần quan tâm
  const [arrHocSinh, setArrHocSinh] = useState([]);
  //CB lấy key search
  const setSearchKeyHandler = (value) => {
    console.log(value);
    setSearchKey(value);
  };

  //Xử lý side effect láy mảng hs nếu có search
  useEffect(() => {
    if (!searchKey || searchKey === "") {
      setArrHocSinh(sortArtByLastShortName(arrHocSinhDaPhanLoai));
    } else {
      const arrFilter = arrHocSinhDaPhanLoai.filter((item) =>
        item.shortName
          .toLowerCase()
          .trim()
          .includes(searchKey.toLowerCase().trim())
      );
      setArrHocSinh(sortArtByLastShortName(arrFilter));
    }
  }, [searchKey, arrHocSinhDaPhanLoai]);
  return (
    <Card>
      <div className={classes.container}>
        <Search hint="Tìm tên học sinh..." getKeyword={setSearchKeyHandler} />
        {arrHocSinh.map((item) => (
          <PersonBar
            key={item.id}
            id={item.id}
            shortName={item.shortName}
            gioiTinh={item.gioiTinh}
            arrLoaiLop={item.arrLoaiLop}
            currentRoute="/hoc-sinh/ds-ca-nhan"
          />
        ))}
      </div>
    </Card>
  );
};

export default DanhSachHocSinhPage;
