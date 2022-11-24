import classes from "./DiemDanhCaNhan.module.css";
import Card from "../UI/Card";
import Layout28 from "../layout/layout-2-8";
import PickGiaoVienBar from "../UI/PickGiaoVienBar";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import {
  layArrTkDayChinhVaDayTheCuaGv,
  locArrTkChinhVaTheTheoNgay,
} from "./ddcn_helper";
import ChonNguoiContext from "../../context/chonNguoiContext";
import GiaoVienContext from "../../context/giaoVienContext";
import NotiContext from "../../context/notiContext";
import PickDateBar from "../UI/PickDateBar";
import ItemNgayDdcn from "./ItemNgayDdcn";

const ThongKeGiaoVienPage = (props) => {
  const { arrGiaoVien, arrDiemDanhCaNhan } = props;

  const gvCtx = useContext(GiaoVienContext);
  const notiCtx = useContext(NotiContext);
  //Lấy context giáo viên đẻ lấy id giáo viên được pick từ PickGiaoVienBar
  const giaoVienChonId = gvCtx.giaoVienSelectedId;
  //State ngày được chọn để điểm danh
  const [ngayDiemDanh, setNgayDiemDanh] = useState(new Date());
  const curTimeView = new Date(ngayDiemDanh).toLocaleString("en-GB", {
    month: "numeric",
    year: "numeric",
  });
  //Cb đổi ngày điểm danh
  const layNgayHandler = (date) => {
    setNgayDiemDanh(new Date(date));
  };
  //Lấy mảng ddcn dạy chính và dạy thế của gv được chọn
  const { arrDdChinhCuaGvDuocChon, arrDayTheCuaGvDuocChon } =
    layArrTkDayChinhVaDayTheCuaGv(giaoVienChonId, arrDiemDanhCaNhan);
  //Lọc lại hai mảng này theo tháng đang được chọn
  const { arrDdChinhTheoNgay, arrDdDayTheTheoNgay } =
    locArrTkChinhVaTheTheoNgay(
      ngayDiemDanh,
      arrDdChinhCuaGvDuocChon,
      arrDayTheCuaGvDuocChon
    );
  console.log(arrDdChinhTheoNgay);
  console.log(arrDdDayTheTheoNgay);
  return (
    <Card>
      <Layout28>
        <div className="smallArea">
          <PickGiaoVienBar arrGiaoVien={arrGiaoVien} />
        </div>
        {giaoVienChonId && (
          <div className="bigArea">
            <div className={classes.controls}>
              <PickDateBar
                getNgayDuocChon={layNgayHandler}
                hint="Ví dụ: nếu chọn ngày 20/01/2022 thì kết quả thông kê điểm danh sẽ là của tháng 1 năm 2022."
                limitPreNThisMonth={true}
              />
            </div>
            <div className={classes.controls}>
              <div className={classes.container}>
                <h4>Kết quả điểm danh tháng {curTimeView}</h4>
                <ItemNgayDdcn />
              </div>
            </div>
          </div>
        )}
        {!giaoVienChonId && (
          <div className="bigArea">
            <h3>Chọn giáo viên để thao tác tiếp</h3>
          </div>
        )}
      </Layout28>{" "}
    </Card>
  );
};

export default ThongKeGiaoVienPage;
