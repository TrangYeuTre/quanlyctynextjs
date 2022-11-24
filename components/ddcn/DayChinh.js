import classes from "./DiemDanhCaNhan.module.css";
import ChonNguoi from "../UI/ChonNguoi";
import { laylabelThuTuNgay, layTenThuTuNgay } from "../../helper/uti";
import { locMangHsDayChinh } from "./ddcn_helper";
import { useEffect, useContext } from "react";
import ChonNguoiContext from "../../context/chonNguoiContext";

const DayChinh = (props) => {
  //Lấy data giáo viên về đã
  const { dataGiaoVien, ngayDiemDanh, arrHocSinhTangCuong } = props;
  //Lấy ctx chon người
  const chonNguoiCtx = useContext(ChonNguoiContext);
  const arrHocSinhCtx = chonNguoiCtx.arrHocSinh;
  //Ở đay lấy mảng giáo viên ctx ctrong chọn người để render tạm cho phần hs tăng cường
  const arrHsTangCuongCtx = chonNguoiCtx.arrGiaoVien;
  //Từ quyết định arr hs tăng cường nào được render
  let arrHsTangCuongRender = arrHocSinhTangCuong;
  if (arrHsTangCuongCtx && arrHsTangCuongCtx.length > 0) {
    arrHsTangCuongRender = arrHsTangCuongCtx;
  }

  //Xử lý mảng học sinh nghỉ khi bỏ chọn
  let arrHocSinhNghi = [];
  if (arrHocSinhCtx) {
    arrHocSinhNghi = arrHocSinhCtx.filter((hocsinh) => !hocsinh.isSelected);
  }
  //Lấy thứ từ ngày điểm danh để lọc ra hs của ngày được chọn
  const labelThuNgayDiemDanh = laylabelThuTuNgay(ngayDiemDanh).toLowerCase();

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
      {/* Vùng chọn hs dạy chính */}
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
      <h4>Chọn học sinh học chính / nghỉ</h4>
      <p className="ghichu">
        Mặc định học trò của giáo viên đảm nhận đã được chọn. Khi bỏ chọn một học sinh tương ứng học sinh đó nghỉ.
      </p>
      <ChonNguoi arrPeople={arrHocSinhCtx} type="hocsinh" />
      {/* Vùng học sinh nghỉ */}
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
      {/* Vùng chọn học sinh tăng cường */}
      <h4>Chọn học sinh tăng cường</h4>
      {/* ghi chú : do chọn người ctx chỉ có 1 mảng chưa hs ta đã dùng ở dùng 62 bên trên, ở đây ta dùng tạm chọn giáo viên đê chứa hs */}
      <ChonNguoi arrPeople={arrHsTangCuongRender} type="giaovien" />
    </div>
  );
};

export default DayChinh;
