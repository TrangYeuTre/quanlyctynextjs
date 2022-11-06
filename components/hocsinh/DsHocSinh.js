import Card from "../UI/Card";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import PersonBar from "../UI/PersonBar";
import Search from "../UI/Search";
import { sortArtByLastShortName } from "../../helper/uti";
import classes from "./DsHocSinh.module.css";
import { useContext } from "react";
import NotiContext from "../../context/notiContext";
import { useRouter } from "next/router";

const DanhSachHocSinhPage = (props) => {
  const notiCtx = useContext(NotiContext);
  const router = useRouter();
  //Lấy về từ props
  const { arrHocSinhDaPhanLoai } = props;
  //State lấy keyword search
  const [searchKey, setSearchKey] = useState("");
  //Mảng kết quả hs render
  //Quan trọng : arrHocsinh (arrHocSinhDaPhanLoai ở dưới) đã được fitler nhóm hay cá nhân từ SSG nên ở đây không cần quan tâm
  const [arrHocSinh, setArrHocSinh] = useState([]);
  //CB lấy key search
  const setSearchKeyHandler = (value) => {
    setSearchKey(value);
  };
  //CB xóa học sinh theo id
  const delHocSinhHandler = async (id) => {
    const response = await fetch("/api/hocSinh", {
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
    }, 3000);
    notiCtx.pushNoti({ status: statusCode, message: dataGot.thongbao });
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
            arrLoaiLop={item.lopHoc}
            doDelFetch={delHocSinhHandler}
          />
        ))}
      </div>
    </Card>
  );
};

export default DanhSachHocSinhPage;
