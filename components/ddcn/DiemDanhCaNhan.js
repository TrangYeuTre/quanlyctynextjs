import classes from "./DiemDanhCaNhan.module.css";
import Card from "../UI/Card";
import Layout28 from "../layout/layout-2-8";
import PickGiaoVienBar from "../UI/PickGiaoVienBar";
import { useContext, useState } from "react";
import GiaoVienContext from "../../context/giaoVienContext";
import { convertInputDateFormat, layTenThuTuNgay } from "../../helper/uti";
import PickDateBar from "../UI/PickDateBar";
import DayChinh from "./DayChinh";

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
  //Lọc lại data giáo viên được chọn để truyền xuống phần chọn hóc sinh điểm danh chính
  const dataGiaoVienDuocChon = arrGiaoVien.find(
    (giaovien) => giaovien.id === giaoVienChonId
  );

  return (
    <Card>
      <Layout28>
        <div className="smallArea">
          <PickGiaoVienBar arrGiaoVien={arrGiaoVien} />
        </div>
        {giaoVienChonId && (
          <div className="bigArea">
            <h1>Trang điểm danh cá nhân đây</h1>
            <div className={classes.controls}>
              <PickDateBar getNgayDuocChon={layNgayHandler} />
            </div>
            {dataGiaoVienDuocChon && (
              <div className={classes.controls}>
                <DayChinh
                  dataGiaoVien={dataGiaoVienDuocChon}
                  ngayDiemDanh={ngayDiemDanh}
                />
              </div>
            )}
          </div>
        )}
        {!giaoVienChonId && (
          <div className="bigArea">
            <h3>Chọn giáo viên để thao tác tiếp</h3>
          </div>
        )}
      </Layout28>
    </Card>
  );
};

export default DiemDanhCaNhanPage;
