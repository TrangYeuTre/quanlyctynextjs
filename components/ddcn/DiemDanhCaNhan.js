import classes from "./DiemDanhCaNhan.module.css";
import Card from "../UI/Card";
import Layout28 from "../layout/layout-2-8";
import PickGiaoVienBar from "../UI/PickGiaoVienBar";
import { useContext, useState, useEffect } from "react";
import GiaoVienContext from "../../context/giaoVienContext";
import { convertInputDateFormat, layTenThuTuNgay } from "../../helper/uti";
import PickDateBar from "../UI/PickDateBar";

const DiemDanhCaNhanPage = (props) => {
  const { arrGiaoVien } = props;

  const gvCtx = useContext(GiaoVienContext);
  //Lấy context giáo viên đẻ lấy id giáo viên được pick từ PickGiaoVienBar
  const giaoVienChonId = gvCtx.giaoVienSelectedId;
  //State ngày được chọn để điểm danh
  const [ngayDiemDanh, setNgayDiemDanh] = useState(new Date());
  //Cb đổi ngày điểm danh
  const layNgayHandler = (date) => {
    setNgayDiemDanh(new Date(date));
  };
  console.log(convertInputDateFormat(ngayDiemDanh));
  //Side effect thiết lập ngày lần đầu là hôm nay
  return (
    <Card>
      <Layout28>
        <div className="smallArea">
          <PickGiaoVienBar arrGiaoVien={arrGiaoVien} />
        </div>
        <div className="bigArea">
          <h1>Trang điểm danh cá nhân đây</h1>
          <div className={classes.controls}>
            <p className="ghichu">
              Mặc định là ngày hôm nay, muốn thay đổi thì chọn lại nhé.
            </p>
            <PickDateBar getNgayDuocChon={layNgayHandler} />
            {/* <div className={classes.chonNgay}>
              <label>Thứ</label>
              <div className={classes.thuLabel}>
                {layTenThuTuNgay(ngayDiemDanh)}
              </div>
              <label>Ngày</label>
              <input
                type="date"
                value={convertInputDateFormat(ngayDiemDanh)}
                onChange={thayDoiNgayDiemDanhHandler}
              />
            </div> */}
          </div>
        </div>
      </Layout28>
    </Card>
  );
};

export default DiemDanhCaNhanPage;
