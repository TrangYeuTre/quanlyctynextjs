import Card from "../UI/Card";
import { useEffect, useState } from "react";
import PersonBar from "../UI/PersonBar";
import Search from "../UI/Search";
import { sortArtByLastShortName } from "../../helper/uti";
import classes from "../hocsinh/DsHocSinh.module.css";
import { useContext } from "react";
import NotiContext from "../../context/notiContext";
import { useRouter } from "next/router";
const DanhSachGiaoVienPage = (props) => {
  const notiCtx = useContext(NotiContext);
  const router = useRouter();
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

  //Cb xóa giáo viên
  const delGiaoVienHandler = async (id) => {
    const response = await fetch("/api/giaoVien", {
      method: "DELETE",
      body: JSON.stringify(id),
      headers: { "Content-Type": "application/json" },
    });
    const statusCode = response.status;
    const dataGot = await response.json();
    setTimeout(() => {
      notiCtx.clearNoti();
      if ((statusCode === 200) | (statusCode === 201)) {
        router.reload();
      }
    }, process.env.DELAY_TIME_NOTI);
    window.scrollTo(0, 0);
    notiCtx.pushNoti({ status: statusCode, message: dataGot.thongbao });
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
            arrLoaiLop={[]}
            doDelFetch={delGiaoVienHandler}
          />
        ))}
      </div>
    </Card>
  );
};

export default DanhSachGiaoVienPage;
