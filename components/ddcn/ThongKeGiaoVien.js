import classes from "./DiemDanhCaNhan.module.css";
import Card from "../UI/Card";
import Layout28 from "../layout/layout-2-8";
import PickGiaoVienBar from "../UI/PickGiaoVienBar";
import { useContext, useState, useEffect } from "react";
import { getArrDdcnByGvNThisMonth } from "./ddcn_helper";
import { removeDomItem } from "../../helper/uti";
import GiaoVienContext from "../../context/giaoVienContext";
import NotiContext from "../../context/notiContext";
import PickDateBar from "../UI/PickDateBar";
import ItemNgayDdcn from "./ItemNgayDdcn";
import SuaNgayDiemDanhCuaHocSinhPage from "./SuaNgayDdHocSinh";
import DiemDanhCaNhan from "../../classes/DiemDanhCaNhan";
import DataGiaoVien from "../../classes/DataGiaoVien";
import DataDiemDanhCaNhan from "../../classes/DataDiemDanhCaNhan";

const ThongKeGiaoVienPage = (props) => {
  const arrGiaoVien = DataGiaoVien.arrGiaoVien;
  const {
    ngayThongKe,
    thietLapNgayThongKe,
    arrDdcnOfThisMonth,
    thietLapGiaoVienChonId,
  } = props;
  // const arrDiemDanhCaNhan = DataDiemDanhCaNhan.arrDiemDanhCaNhan;
  //State render giao diện sửa cho hs
  const [hocSinhSua, setHocSinhSua] = useState(null);
  //Cb thiết lập data hs sua
  const renderTrangSuaHocSinhHandler = (data) => {
    setHocSinhSua(data);
  };
  const huyRenderTrangSuaHsHandler = () => {
    setHocSinhSua(null);
  };
  //Lấy ctx
  const gvCtx = useContext(GiaoVienContext);
  const notiCtx = useContext(NotiContext);
  //Lấy context giáo viên đẻ lấy id giáo viên được pick từ PickGiaoVienBar
  const giaoVienChonId = gvCtx.giaoVienSelectedId;
  //State ngày được chọn để điểm danh
  // const [ngayDiemDanh, setNgayDiemDanh] = useState(new Date());
  const curTimeView = new Date(ngayThongKe).toLocaleString("en-GB", {
    month: "numeric",
    year: "numeric",
  });
  //Cb đổi ngày điểm danh
  const layNgayHandler = (date) => {
    thietLapNgayThongKe(date);
  };
  //Cb xóa ngày điểm danh
  const xoaNgayDiemDanhHandler = async (ngayDiemDanhId) => {
    const { statusCode, dataGot } = await DiemDanhCaNhan.xoaNgayDiemDanhCaNhan(
      ngayDiemDanhId
    );
    //Chạy push noti
    setTimeout(() => {
      notiCtx.clearNoti();
      if (statusCode === 200 || statusCode === 201) {
        removeDomItem(ngayDiemDanhId);
      }
    }, process.env.DELAY_TIME_NOTI);
    notiCtx.pushNoti({
      status: statusCode,
      message: dataGot.thongbao,
    });
  };
  let arrDdcnByGvNThisMonth = arrDdcnOfThisMonth;

  useEffect(() => {
    thietLapGiaoVienChonId(giaoVienChonId);
  }, [giaoVienChonId, thietLapGiaoVienChonId]);
  return (
    <Card>
      <Layout28>
        {!giaoVienChonId && !hocSinhSua && (
          <div className="smallArea">
            <PickGiaoVienBar arrGiaoVien={arrGiaoVien} />
          </div>
        )}
        {giaoVienChonId && !hocSinhSua && (
          <div className="smallArea">
            <PickGiaoVienBar arrGiaoVien={arrGiaoVien} />
          </div>
        )}
        {giaoVienChonId && hocSinhSua && (
          <div className="smallArea">
            <PickGiaoVienBar arrGiaoVien={arrGiaoVien} disAll={true} />
          </div>
        )}

        {/* Giao diên load trang lịch thông kê */}
        {giaoVienChonId && !hocSinhSua && (
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
                <ul className={classes.ghiChuMau}>
                  <div className={classes.nodeItem}>
                    <p>Dạy chính</p>
                    <div className={classes.dayChinh}></div>
                  </div>
                  <div className={classes.nodeItem}>
                    <p>Dạy thế</p>
                    <div className={classes.dayThe}></div>
                  </div>
                  <div className={classes.nodeItem}>
                    <p>Dạy tăng cường</p>
                    <div className={classes.dayTangCuong}></div>
                  </div>
                  <div className={classes.nodeItem}>
                    <p>Nghỉ - Đã bù</p>
                    <div className={classes.dayBu}></div>
                  </div>
                  <div className={classes.nodeItem}>
                    <p>Nghỉ - Chưa bù</p>
                    <div className={classes.nghi}></div>
                  </div>
                </ul>
                <ul className={classes.listLich}>
                  <p className="ghichu">
                    Cô Trang lùn có thể click trực tiếp vào thẻ học sinh màu bên
                    dưới đẻ sửa thông tin.
                  </p>
                  {arrDdcnByGvNThisMonth.length > 0 &&
                    arrDdcnByGvNThisMonth.map((item) => {
                      const arrHocSinh = [];
                      for (let key in item) {
                        if (
                          key !== "_id" &&
                          key !== "shortName" &&
                          key !== "giaoVienId" &&
                          key !== "ngayDiemDanh"
                        ) {
                          arrHocSinh.push({ ...item[key], hocSinhId: key });
                        }
                      }
                      return (
                        <ItemNgayDdcn
                          key={item._id}
                          _id={item._id}
                          ngayDiemDanh={item.ngayDiemDanh}
                          arrHocSinh={arrHocSinh}
                          xoaNgayDiemDanh={xoaNgayDiemDanhHandler.bind(
                            0,
                            item._id
                          )}
                          chuyenGiaoDienSua={renderTrangSuaHocSinhHandler}
                        />
                      );
                    })}
                </ul>
              </div>
            </div>
          </div>
        )}
        {/* Giao diện load trang sửa thông tin điểm danh ngày của học sinh */}
        {giaoVienChonId && hocSinhSua && (
          <div className="bigArea">
            <SuaNgayDiemDanhCuaHocSinhPage
              data={hocSinhSua}
              arrGiaoVien={arrGiaoVien}
              tatTrangSua={huyRenderTrangSuaHsHandler}
            />
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
