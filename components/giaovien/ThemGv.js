import classes from "../hocsinh/ThemHs.module.css";
import GiaoVien from "../../classes/GiaoVien";
import Card from "../UI/Card";
import CTA from "../UI/CTA";
import { useRef, Fragment } from "react";
import Link from "next/link";
import { convertInputDateFormat } from "../../helper/uti";
import { useContext } from "react";
import NotiContext from "../../context/notiContext";
import { useRouter } from "next/router";

const ThemGvPage = (props) => {
  //VARIABLES
  const notiCtx = useContext(NotiContext);
  const router = useRouter();
  const { renderMode, dataGiaoVienSua } = props;
  const dataGiaoVien = dataGiaoVienSua;
  const gioiTinhRef = useRef();
  const tenGiaoVienRef = useRef();
  const shortNameRef = useRef();
  const ngaySinhRef = useRef();
  const soDienThoaiRef = useRef();
  const diaChiRef = useRef();
  const thongTinCoBanRef = useRef();
  const luongCaNhanRef = useRef();
  const luongNhomRef = useRef();

  //FUNCTIONS
  const createInstanceGiaoVien = () => {
    const giaoVienInstance = new GiaoVien({
      tenGiaoVien: tenGiaoVienRef.current.value,
      shortName: shortNameRef.current.value,
      gioiTinh: gioiTinhRef.current.value,
      ngaySinh: ngaySinhRef.current.value,
      luongCaNhan: luongCaNhanRef.current.value,
      luongNhom: luongNhomRef.current.value,
      soDienThoai: soDienThoaiRef.current.value,
      diaChi: diaChiRef.current.value,
      thongTinCoBan: thongTinCoBanRef.current.value,
      hocTroCaNhan: [],
      lichDayCaNhan: [],
    });
    return giaoVienInstance;
  };
  const themGiaoVienMoiHandler = async (e) => {
    e.preventDefault();
    const giaoVienMoi = createInstanceGiaoVien();
    const { statusCode, dataGot } = await giaoVienMoi.themGiaoVien();
    dayThongBao(statusCode, dataGot);
  };
  const suaGiaoVienHandler = async (e) => {
    e.preventDefault();
    const giaoVienUpdate = createInstanceGiaoVien();
    const { statusCode, dataGot } = await giaoVienUpdate.suaGiaoVien(
      dataGiaoVien._id
    );
    dayThongBao(statusCode, dataGot);
  };
  const dayThongBao = (statusCode, dataGot) => {
    setTimeout(() => {
      notiCtx.clearNoti();
      if (statusCode === 200 || statusCode === 201) {
        clearInput();
      }
    }, process.env.DELAY_TIME_NOTI);
    window.scrollTo(0, 0);
    notiCtx.pushNoti({ status: statusCode, message: dataGot.thongbao });
  };
  const clearInput = () => {
    gioiTinhRef.current.value = "";
    tenGiaoVienRef.current.value = "";
    shortNameRef.current.value = "";
    soDienThoaiRef.current.value = "";
    diaChiRef.current.value = "";
    thongTinCoBanRef.current.value = "";
    luongCaNhanRef.current.value = 160000;
    luongNhomRef.current.value = 90000;
  };

  return (
    <Card>
      {renderMode === "them" && (
        <Fragment>
          <h3>Th??m gi??o vi??n m???i</h3>
          <form className={classes.container} onSubmit={themGiaoVienMoiHandler}>
            {/* D??ng ?????u ti??n l???y th??ng tin: l???p c?? nh??n, nh??m, gi???i t??nh */}
            <div className={classes.controls}>
              <div className={classes.control}>
                <label htmlFor="gioiTinh">Gi???i t??nh *</label>
                <select
                  name="gioiTinh"
                  id="gioiTinh"
                  ref={gioiTinhRef}
                  defaultValue="nam"
                  required
                >
                  <option value="nam">Nam</option>
                  <option value="nu">N???</option>
                </select>
              </div>
            </div>
            {/* T??n, t??n ng???n */}
            <div className={classes.controls}>
              <div className={classes.control}>
                <label htmlFor="ten">T??n *</label>
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
                <label htmlFor="shortName">T??n ng???n *</label>
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
            {/* Ng??y sinh, s??? ph??t h???c m???t ti???t */}
            <div className={classes.controls}>
              <div className={classes.control}>
                <label htmlFor="ngaySinh">Ng??y sinh *</label>
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
            {/* l????ng c?? nh??n v?? nh??m */}
            <div className={classes.controls}>
              <div className={classes.control}>
                <label htmlFor="luongCaNhan">L????ng c?? nh??n *</label>
                <input
                  type="number"
                  name="luongCaNhan"
                  id="luongCaNhan"
                  defaultValue={160000}
                  style={{ width: "8rem" }}
                  step="1000"
                  ref={luongCaNhanRef}
                  required
                />
              </div>
              <div className={classes.control}>
                <label htmlFor="luongNhom">L????ng nh??m *</label>
                <input
                  type="number"
                  name="luongNhom"
                  id="luongNhom"
                  defaultValue={90000}
                  style={{ width: "8rem" }}
                  step="1000"
                  ref={luongNhomRef}
                  required
                />
              </div>
            </div>
            {/* Ph??? huynh, ?????a ch??? ,s??t */}
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
                <label htmlFor="soDienThoai">S??? ??i???n tho???i</label>
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
                <label htmlFor="diaChi">?????a ch???</label>
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
            {/* Ghi ch?? ??? ????y */}
            <div style={{ width: "100%" }}>
              <textarea
                name="thongTinCoBan"
                style={{ width: "90%" }}
                rows="7"
                ref={thongTinCoBanRef}
                defaultValue="Th??ng tin c?? b???n v??? gi??o vi??n"
              />
            </div>
            {/* Ghi ch?? ??? ????y */}
            <CTA message={null}>
              <button type="submit" className="btn btn-submit">
                Th??m m???i
              </button>
              <Link href="/">
                <button type="button" className="btn btn-ghost">
                  H???y
                </button>
              </Link>
            </CTA>
          </form>
        </Fragment>
      )}
      {renderMode === "sua" && (
        <Fragment>
          <h3>S???a th??ng tin gi??o vi??n: {dataGiaoVien.shortName}</h3>
          <form className={classes.container} onSubmit={suaGiaoVienHandler}>
            {/* D??ng ?????u ti??n l???y th??ng tin: l???p c?? nh??n, nh??m, gi???i t??nh */}
            <div className={classes.controls}>
              <div className={classes.control}>
                <label htmlFor="gioiTinh">Gi???i t??nh *</label>
                <select
                  name="gioiTinh"
                  id="gioiTinh"
                  ref={gioiTinhRef}
                  required
                  defaultValue={dataGiaoVien.gioiTinh === "nam" ? "nam" : "nu"}
                >
                  <option value="nam">Nam</option>
                  <option value="nu">N???</option>
                </select>
              </div>
            </div>
            {/* T??n, t??n ng???n */}
            <div className={classes.controls}>
              <div className={classes.control}>
                <label htmlFor="ten">T??n *</label>
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
                <label htmlFor="shortName">T??n ng???n *</label>
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
            {/* Ng??y sinh, s??? ph??t h???c m???t ti???t */}
            <div className={classes.controls}>
              <div className={classes.control}>
                <label htmlFor="ngaySinh">Ng??y sinh *</label>
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
            {/* l????ng c?? nh??n v?? nh??m */}
            <div className={classes.controls}>
              <div className={classes.control}>
                <label htmlFor="luongCaNhan">L????ng c?? nh??n *</label>
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
                <label htmlFor="luongNhom">L????ng nh??m *</label>
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
            {/* ?????a ch??? ,s??t */}
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
                <label htmlFor="soDienThoai">S??? ??i???n tho???i</label>
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
                <label htmlFor="diaChi">?????a ch???</label>
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
            {/* Ghi ch?? ??? ????y */}
            <div style={{ width: "100%" }}>
              <textarea
                name="thongTinCoBan"
                style={{ width: "90%" }}
                rows="7"
                ref={thongTinCoBanRef}
                defaultValue={dataGiaoVien.thongTinCoBan}
              />
            </div>
            {/* Ghi ch?? ??? ????y */}
            <CTA message={null}>
              <button type="submit" className="btn btn-submit">
                S???a
              </button>
              <Link href="/giao-vien/ds-giao-vien">
                <button type="button" className="btn btn-ghost">
                  H???y
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
