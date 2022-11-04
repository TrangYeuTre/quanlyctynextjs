import classes from "../hocsinh/ThemHs.module.css";
import Card from "../UI/Card";
import CTA from "../UI/CTA";
import { useRef, Fragment } from "react";
import Link from "next/link";
import { convertInputDateFormat } from "../../helper/uti";

const ThemGvPage = (props) => {
  //Mong đợi mode dể render tương ứng
  const { renderMode, dataGiaoVien } = props;
  //Ref value cho input
  const gioiTinhRef = useRef();
  const tenGiaoVienRef = useRef();
  const shortNameRef = useRef();
  const ngaySinhRef = useRef();
  const soDienThoaiRef = useRef();
  const diaChiRef = useRef();
  const thongTinCoBanRef = useRef();
  const luongCaNhanRef = useRef();
  const luongNhomRef = useRef();

  //Cb chính fetch thêm giáo viên
  const themGiaoVienMoiHandler = async (e) => {
    e.preventDefault();
    //Tổng hợp value đẻ submnit
    const dataSubmit = {
      tenGiaoVien: tenGiaoVienRef.current.value,
      shortName: shortNameRef.current.value,
      gioiTinh: gioiTinhRef.current.value,
      ngaySinh: ngaySinhRef.current.value,
      luongCaNhan: luongCaNhanRef.current.value,
      luongNhon: luongNhomRef.current.value,
      soDienThoai: soDienThoaiRef.current.value,
      diaChi: diaChiRef.current.value,
      thongTinCoBan: thongTinCoBanRef.current.value,
    };
    console.log(dataSubmit);
    //FETCH HERE
    // await fetch();
  };
  //Cb chính fetch sưa hs
  const suaGiaoVienHandler = async (e) => {
    e.preventDefault();
    //Tổng hợp value đẻ submnit
    const dataSubmit = {
      tenGiaoVien: tenGiaoVienRef.current.value,
      shortName: shortNameRef.current.value,
      gioiTinh: gioiTinhRef.current.value,
      ngaySinh: ngaySinhRef.current.value,
      luongCaNhan: luongCaNhanRef.current.value,
      luongNhon: luongNhomRef.current.value,
      soDienThoai: soDienThoaiRef.current.value,
      diaChi: diaChiRef.current.value,
      thongTinCoBan: thongTinCoBanRef.current.value,
    };
    console.log(dataSubmit);
    //FETCH HERE
    // await fetch();
  };

  return (
    <Card>
      {renderMode === "them" && (
        <Fragment>
          <h3>Thêm giáo viên mới</h3>
          <form className={classes.container} onSubmit={themGiaoVienMoiHandler}>
            {/* Dòng đầu tiên lấy thông tin: lớp cá nhân, nhóm, giới tính */}
            <div className={classes.controls}>
              <div className={classes.control}>
                <label htmlFor="gioiTinh">Giới tính *</label>
                <select
                  name="gioiTinh"
                  id="gioiTinh"
                  ref={gioiTinhRef}
                  defaultValue="nam"
                  required
                >
                  <option value="nam">Nam</option>
                  <option value="nu">Nữ</option>
                </select>
              </div>
            </div>
            {/* Tên, tên ngắn */}
            <div className={classes.controls}>
              <div className={classes.control}>
                <label htmlFor="ten">Tên *</label>
                <input
                  style={{ width: "16rem" }}
                  type="text"
                  name="ten"
                  id="ten"
                  ref={tenGiaoVienRef}
                  defaultValue=""
                  required
                />
              </div>
              <div className={classes.control}>
                <label htmlFor="shortName">Tên ngắn *</label>
                <input
                  style={{ width: "10rem" }}
                  type="text"
                  name="shortName"
                  id="shortName"
                  defaultValue=""
                  ref={shortNameRef}
                  required
                />
              </div>
            </div>
            {/* Ngày sinh, số phút học một tiết */}
            <div className={classes.controls}>
              <div className={classes.control}>
                <label htmlFor="ngaySinh">Ngày sinh *</label>
                <input
                  type="date"
                  name="ngaySinh"
                  id="ngaySinh"
                  defaultValue={convertInputDateFormat("01-20-1992")}
                  ref={ngaySinhRef}
                  required
                />
              </div>
            </div>
            {/* lương cá nhân và nhóm */}
            <div className={classes.controls}>
              <div className={classes.control}>
                <label htmlFor="luongCaNhan">Lương cá nhân *</label>
                <input
                  type="number"
                  name="luongCaNhan"
                  id="luongCaNhan"
                  defaultValue="160000"
                  style={{ width: "8rem" }}
                  step="1000"
                  ref={luongCaNhanRef}
                  required
                />
              </div>
              <div className={classes.control}>
                <label htmlFor="luongNhom">Lương nhóm *</label>
                <input
                  type="number"
                  name="luongNhom"
                  id="luongNhom"
                  defaultValue="90000"
                  style={{ width: "8rem" }}
                  step="1000"
                  ref={luongNhomRef}
                  required
                />
              </div>
            </div>
            {/* Phụ huynh, địa chỉ ,sđt */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
                borderBottom: "2px dotted var(--mauNen--)",
                paddingBottom: "1rem",
              }}
            >
              <div className={classes.control}>
                <label htmlFor="soDienThoai">Số điện thoại</label>
                <input
                  style={{ width: "20rem" }}
                  type="text"
                  name="soDienThoai"
                  id="soDienThoai"
                  defaultValue=""
                  ref={soDienThoaiRef}
                />
              </div>
              <div className={classes.control}>
                <label htmlFor="diaChi">Địa chỉ</label>
                <input
                  style={{ width: "20rem" }}
                  type="text"
                  name="diaChi"
                  id="diaChi"
                  defaultValue=""
                  ref={diaChiRef}
                />
              </div>
            </div>
            {/* Ghi chú ở đây */}
            <div style={{ width: "100%" }}>
              <textarea
                name="thongTinCoBan"
                style={{ width: "90%" }}
                rows="7"
                ref={thongTinCoBanRef}
                defaultValue="Thông tin cơ bản về giáo viên"
              />
            </div>
            {/* Ghi chú ở đây */}
            <CTA message={null}>
              <button type="submit" className="btn btn-submit">
                Thêm mới
              </button>
              <Link href="/">
                <button type="button" className="btn btn-ghost">
                  Hủy
                </button>
              </Link>
            </CTA>
          </form>
        </Fragment>
      )}
      {renderMode === "sua" && (
        <Fragment>
          <h3>Sửa thông tin giáo viên: {dataGiaoVien.shortName}</h3>
          <form className={classes.container} onSubmit={suaGiaoVienHandler}>
            {/* Dòng đầu tiên lấy thông tin: lớp cá nhân, nhóm, giới tính */}
            <div className={classes.controls}>
              <div className={classes.control}>
                <label htmlFor="gioiTinh">Giới tính *</label>
                <select
                  name="gioiTinh"
                  id="gioiTinh"
                  ref={gioiTinhRef}
                  required
                  defaultValue={dataGiaoVien.gioiTinh === "nam" ? "nam" : "nu"}
                >
                  <option value="nam">Nam</option>
                  <option value="nu">Nữ</option>
                </select>
              </div>
            </div>
            {/* Tên, tên ngắn */}
            <div className={classes.controls}>
              <div className={classes.control}>
                <label htmlFor="ten">Tên *</label>
                <input
                  style={{ width: "16rem" }}
                  type="text"
                  name="ten"
                  id="ten"
                  ref={tenGiaoVienRef}
                  defaultValue={dataGiaoVien.tenGiaoVien}
                  required
                />
              </div>
              <div className={classes.control}>
                <label htmlFor="shortName">Tên ngắn *</label>
                <input
                  style={{ width: "10rem" }}
                  type="text"
                  name="shortName"
                  id="shortName"
                  ref={shortNameRef}
                  defaultValue={dataGiaoVien.shortName}
                  required
                />
              </div>
            </div>
            {/* Ngày sinh, số phút học một tiết */}
            <div className={classes.controls}>
              <div className={classes.control}>
                <label htmlFor="ngaySinh">Ngày sinh *</label>
                <input
                  type="date"
                  name="ngaySinh"
                  id="ngaySinh"
                  ref={ngaySinhRef}
                  defaultValue={convertInputDateFormat(dataGiaoVien.ngaySinh)}
                  required
                />
              </div>
            </div>
            {/* lương cá nhân và nhóm */}
            <div className={classes.controls}>
              <div className={classes.control}>
                <label htmlFor="luongCaNhan">Lương cá nhân *</label>
                <input
                  type="number"
                  name="luongCaNhan"
                  id="luongCaNhan"
                  style={{ width: "8rem" }}
                  step="1000"
                  ref={luongCaNhanRef}
                  defaultValue={dataGiaoVien.luongCaNhan}
                  required
                />
              </div>
              <div className={classes.control}>
                <label htmlFor="luongNhom">Lương nhóm *</label>
                <input
                  type="number"
                  name="luongNhom"
                  id="luongNhom"
                  style={{ width: "8rem" }}
                  step="1000"
                  ref={luongNhomRef}
                  defaultValue={dataGiaoVien.luongNhom}
                  required
                />
              </div>
            </div>
            {/* Địa chỉ ,sđt */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
                borderBottom: "2px dotted var(--mauNen--)",
                paddingBottom: "1rem",
              }}
            >
              <div className={classes.control}>
                <label htmlFor="soDienThoai">Số điện thoại</label>
                <input
                  style={{ width: "20rem" }}
                  type="text"
                  name="soDienThoai"
                  id="soDienThoai"
                  ref={soDienThoaiRef}
                  defaultValue={dataGiaoVien.soDienThoai}
                />
              </div>
              <div className={classes.control}>
                <label htmlFor="diaChi">Địa chỉ</label>
                <input
                  style={{ width: "20rem" }}
                  type="text"
                  name="diaChi"
                  id="diaChi"
                  ref={diaChiRef}
                  defaultValue={dataGiaoVien.diaChi}
                />
              </div>
            </div>
            {/* Ghi chú ở đây */}
            <div style={{ width: "100%" }}>
              <textarea
                name="thongTinCoBan"
                style={{ width: "90%" }}
                rows="7"
                ref={thongTinCoBanRef}
                defaultValue={dataGiaoVien.thongTinCoBan}
              />
            </div>
            {/* Ghi chú ở đây */}
            <CTA message={null}>
              <button type="submit" className="btn btn-submit">
                Sửa
              </button>
              <Link href="/giao-vien/ds-giao-vien">
                <button type="button" className="btn btn-ghost">
                  Hủy
                </button>
              </Link>
            </CTA>
          </form>
        </Fragment>
      )}
    </Card>
  );
};

export default ThemGvPage;
