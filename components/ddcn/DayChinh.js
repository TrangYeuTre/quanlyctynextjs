import classes from "./DiemDanhCaNhan.module.css";
import ChonNguoi from "../UI/ChonNguoi";
import {
  laylabelThuTuNgay,
  locMangHsDayChinh,
  layTenThuTuNgay,
} from "../../helper/uti";
import { useEffect, useContext } from "react";
import ChonNguoiContext from "../../context/chonNguoiContext";

const DayChinh = (props) => {
  //Lấy data giáo viên về đã
  const { dataGiaoVien, ngayDiemDanh } = props;
  //Lấy ctx chon người
  const chonNguoiCtx = useContext(ChonNguoiContext);
  const arrHocSinhCtx = chonNguoiCtx.arrHocSinh;

  //Xử lý mảng học sinh nghỉ khi bỏ chọn
  let arrHocSinhNghi = [];
  if (arrHocSinhCtx) {
    arrHocSinhNghi = arrHocSinhCtx.filter((hocsinh) => !hocsinh.isSelected);
  }
  //Lấy thứ từ ngày điểm danh để lọc ra hs của ngày được chọn
  const labelThuNgayDiemDanh = laylabelThuTuNgay(ngayDiemDanh).toLowerCase();

  //Lấy lại mảng học trò của giáo viên
  let arrHocTroCaNhan = [];
  if (dataGiaoVien) {
    arrHocTroCaNhan = dataGiaoVien.hocTroCaNhan.map((hocsinh) => {
      return { ...hocsinh, isSelected: true };
    });
  }

  //Side effect load mảng hc dạy chính
  useEffect(() => {
    //Lấy lại mảng lich dạy cá nhâ
    let arrLichDayCaNhan = [];
    if (dataGiaoVien) {
      arrLichDayCaNhan = dataGiaoVien.lichDayCaNhan;
    }

    //Xử lý lấy mảng học sinh của giáo viên được chọn auto theo ngày được chọn
    const arrHsChonTrue = locMangHsDayChinh(
      arrLichDayCaNhan,
      labelThuNgayDiemDanh,
      chonNguoiCtx
    );
    //Xử lý ưu tiên nếu arrhocSinhCtx có thì dùng cái này
    // setHocTroDayChinhTheoNgay(arrHsChonTrue);
    chonNguoiCtx.chonHocSinh(arrHsChonTrue);
  }, [labelThuNgayDiemDanh, dataGiaoVien]);
  return (
    <div className={classes.container}>
      <h3 className="h3GachChan">Dạy chính</h3>
      <h4>Ngày đã chốt điểm danh</h4>
      <p className={classes.warning}>
        Thứ: <span>{layTenThuTuNgay(ngayDiemDanh)}</span> --- Ngày:{" "}
        <span>
          {new Date(ngayDiemDanh).toLocaleString("en-GB", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
          })}
        </span>
      </p>
      <h4>Học sinh học chính</h4>
      <p className="ghichu">
        Mặc định học trò của giáo viên đảm nhận đã được chọn. Muốn thêm / bớt
        thì chọn lại
      </p>
      <ChonNguoi arrPeople={arrHocSinhCtx} type="hocsinh" />
      <h4>Học sinh nghỉ</h4>
      <div className={classes.dsNghi}>
        <ul className={classes.tags}>
          {arrHocSinhNghi.length === 0 && (
            <li className={classes.tag}>Không có học sinh nghỉ.</li>
          )}
          {arrHocSinhNghi.length > 0 &&
            arrHocSinhNghi.map((hocsinh) => (
              <li className={classes.tag} key={hocsinh.id}>
                {hocsinh.shortName}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default DayChinh;
