import classes from "./DiemDanhCaNhan.module.css";
import ChonNguoi from "../UI/ChonNguoi";
import { laylabelThuTuNgay } from "../../helper/uti";
import { locMangHsDayChinhTheoThuLabel } from "./ddcn_helper";
import { useEffect, useContext } from "react";
import ChonNguoiContext from "../../context/chonNguoiContext";
import NgayChot from "../UI/NgayChot";

const DayChinh = (props) => {
  const { dataGiaoVien, ngayDiemDanh, arrHocSinhTangCuong } = props;
  const chonNguoiCtx = useContext(ChonNguoiContext);
  const arrHocSinhCtx = chonNguoiCtx.arrHocSinh;
  const arrHsTangCuongCtx = chonNguoiCtx.arrGiaoVien;
  const labelThuNgayDiemDanh = laylabelThuTuNgay(ngayDiemDanh).toLowerCase();

  //HANDLERS
  const arrHsTangCuongRender = xuLyLayArrHsTangCuongRender(
    arrHocSinhTangCuong,
    arrHsTangCuongCtx
  );
  const arrHocSinhNghi = xuLyLayArrHsNghiKhiBoChonHsChinh(arrHocSinhCtx);

  //SIDE EFFECT
  useEffect(() => {
    //GHI CHÚ: ví dụ hôm nay là thứ sáu thì label là fri, load theo lịch học trò của giáo viên này những hs học thứ sáu thì auto đánh selected true
    //Phần dependencies nếu thêm ctx như gợi ý sẽ loop vô cực
    const arrLichDayCaNhan = dataGiaoVien.lichDayCaNhan;
    const isDungXuLyChonHsDayChinhMacDinhTheoThu = () => {
      if (!arrLichDayCaNhan || arrLichDayCaNhan.length === 0) {
        return;
      }
    };
    isDungXuLyChonHsDayChinhMacDinhTheoThu();

    const arrHsChinhMacDinhTrueCuaGiaoVien = locMangHsDayChinhTheoThuLabel(
      arrLichDayCaNhan,
      labelThuNgayDiemDanh
    );
    chonNguoiCtx.chonHocSinh(arrHsChinhMacDinhTrueCuaGiaoVien);
  }, [labelThuNgayDiemDanh, dataGiaoVien]);

  return (
    <div className={classes.container}>
      {/* Vùng chọn hs dạy chính */}
      <h3 className="h3GachChan">Dạy chính</h3>
      <NgayChot ngayDiemDanh={ngayDiemDanh} />
      <h4>Chọn học sinh học chính / nghỉ</h4>
      <p className="ghichu">
        Mặc định học trò của giáo viên đảm nhận đã được chọn. Khi bỏ chọn một
        học sinh tương ứng học sinh đó nghỉ.
      </p>
      <ChonNguoi arrPeople={arrHocSinhCtx} type="hocsinh" />
      {/* Vùng học sinh nghỉ */}
      <h4>Học sinh nghỉ</h4>
      <p className="ghichu">
        Khi bỏ chọn học sinh ở trên sẽ được tự động chuyển vào danh sách nghỉ.
        LƯU Ý: trường hợp học sinh không nghỉ cũng không học thì chịu khó vào
        Thống Kê Giáo Viên và xóa tay học sinh nghỉ.
      </p>
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

//SUB FUNCTIONS
const xuLyLayArrHsTangCuongRender = (
  arrHocSinhTangCuong,
  arrHsTangCuongCtx
) => {
  let arrHsTangCuongRender = arrHocSinhTangCuong;
  if (arrHsTangCuongCtx && arrHsTangCuongCtx.length > 0) {
    arrHsTangCuongRender = arrHsTangCuongCtx;
  }
  return arrHsTangCuongRender;
};
const xuLyLayArrHsNghiKhiBoChonHsChinh = (arrHocSinhCtx) => {
  let arrHocSinhNghi = [];
  if (arrHocSinhCtx) {
    arrHocSinhNghi = arrHocSinhCtx.filter((hocsinh) => !hocsinh.isSelected);
  }
  return arrHocSinhNghi;
};

export default DayChinh;
