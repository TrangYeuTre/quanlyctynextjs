import Card from "../UI/Card";
import { useEffect, useState } from "react";
import PersonBar from "../UI/PersonBar";
import Search from "../UI/Search";
import { sortArtByLastShortName, removeDomItem } from "../../helper/uti";
import classes from "./DsHocSinh.module.css";
import { useContext } from "react";
import NotiContext from "../../context/notiContext";
import HocSinh from "../../classes/HocSinh";

const DanhSachHocSinhPage = (props) => {
  const HS_API_ROUTE = "/api/hocsinh/hocSinh";

  const notiCtx = useContext(NotiContext);
  // const router = useRouter();
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
    const { statusCode, dataGot } = await HocSinh.xoaHocSinh(id);
    // const response = await fetch(HS_API_ROUTE, {
    //   method: "DELETE",
    //   body: JSON.stringify(id),
    //   headers: { "Content-Type": "application/json" },
    // });
    // const statusCode = response.status;
    // const dataGot = await response.json();
    //Đẩy thông báo
    setTimeout(() => {
      notiCtx.clearNoti();
      if (statusCode === 200 || statusCode === 201) {
        removeDomItem(id);
      }
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
  console.log(arrHocSinh);
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

export default DanhSachHocSinhPage;
