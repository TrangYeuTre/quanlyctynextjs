import classes from "./ThemHs.module.css";
import Card from "../UI/Card";
import CTA from "../UI/CTA";
import { useEffect, useState, useRef, Fragment, useContext } from "react";
import NotiContext from "../../context/notiContext";
import Link from "next/link";
import { convertInputDateFormat } from "../../helper/uti";
import { BsCheckLg } from "react-icons/bs";
import HocSinh from "../../classes/HocSinh";

const ThemHsPage = (props) => {
  //CÁC THIẾT LẬP GIÁ TRỊ
  const notiCtx = useContext(NotiContext);
  const notiData = notiCtx.noti;
  const { renderMode, dataHocSinh } = props;
  const gioiTinhRef = useRef();
  const tenHocSinhRef = useRef();
  const shortNameRef = useRef();
  const ngaySinhRef = useRef();
  const soPhutHocMotTietRef = useRef();
  const tenPhuHuynhRef = useRef();
  const soDienThoaiRef = useRef();
  const diaChiRef = useRef();
  const thongTinCoBanRef = useRef();
  const hocPhiCaNhanRef = useRef();
  const hocPhiNhomRef = useRef();
  const [isCanhan, setIsCanhan] = useState(
    dataHocSinh ? dataHocSinh.lopHoc.find((item) => item === "canhan") : false
  );
  const [isNhom, setIsNhom] = useState(
    dataHocSinh ? dataHocSinh.lopHoc.find((item) => item === "nhom") : false
  );
  const [isTangCuong, setIsTangCuong] = useState(
    dataHocSinh
      ? dataHocSinh.lopHoc.find((item) => item === "tangcuong")
      : false
  );
  const [isSubmit, setIsSubmit] = useState(false);

  //CB SET STATE
  const toggleCanhanHandler = () => {
    setIsCanhan(!isCanhan);
  };
  const toggleNhomHandler = () => {
    setIsNhom(!isNhom);
  };
  const toggleTangCuongHandler = () => {
    setIsTangCuong(!isTangCuong);
  };

  //FUNCTION
  const themHocSinhMoiHandler = async (e) => {
    e.preventDefault();
    const hocSinhMoi = taoInstanceHocSinhMoi();
    const { statusCode, dataGot } = await hocSinhMoi.themHocSinhMoi();
    dayThongBao(statusCode, dataGot);
  };
  const taoInstanceHocSinhMoi = () => {
    const hocSinhMoi = new HocSinh({
      lopHoc: [
        isCanhan ? "canhan" : null,
        isNhom ? "nhom" : null,
        isTangCuong ? "tangcuong" : null,
      ],
      gioiTinh: gioiTinhRef.current.value,
      tenHocSinh: tenHocSinhRef.current.value,
      shortName: shortNameRef.current.value,
      ngaySinh: ngaySinhRef.current.value,
      soPhutHocMotTiet: soPhutHocMotTietRef.current.value,
      hocPhiCaNhan: hocPhiCaNhanRef.current.value,
      hocPhiNhom: hocPhiNhomRef.current.value,
      tenPhuHuynh: tenPhuHuynhRef.current.value,
      soDienThoai: soDienThoaiRef.current.value,
      diaChi: diaChiRef.current.value,
      thongTinCoBan: thongTinCoBanRef.current.value,
    });
    return hocSinhMoi;
  };
  const dayThongBao = (statusCode, dataGot) => {
    //Đẩy thông báo thôi
    setTimeout(() => {
      notiCtx.clearNoti();
      if (statusCode === 200 || statusCode === 201) {
        clearInput();
      }
    }, process.env.DELAY_TIME_NOTI);
    window.scrollTo(0, 0);
    notiCtx.pushNoti({
      status: statusCode,
      message: dataGot.thongbao,
    });
  };
  const clearInput = () => {
    resetState();
    gioiTinhRef.current.value = "";
    tenHocSinhRef.current.value = "";
    shortNameRef.current.value = "";
    ngaySinhRef.current.value = "";
    soPhutHocMotTietRef.current.value = 60;
    tenPhuHuynhRef.current.value = "";
    soDienThoaiRef.current.value = "";
    diaChiRef.current.value = "";
    thongTinCoBanRef.current.value = "";
    hocPhiCaNhanRef.current.value = 300000;
    hocPhiNhomRef.current.value = 90000;
  };
  const resetState = () => {
    setIsCanhan(false);
    setIsNhom(false);
    setIsSubmit(false);
  };
  const suaHocSinhHandler = async (e) => {
    e.preventDefault();
    const hocSinhUpdate = taoInstanceHocSinhMoi();
    const { statusCode, dataGot } = await hocSinhUpdate.suaHocSinh(
      dataHocSinh.id
    );
    dayThongBao(statusCode, dataGot);
  };

  //SIDE EFFECT
  useEffect(() => {
    const checkSubmit = () => {
      if (isCanhan || isNhom || isTangCuong) {
        setIsSubmit(true);
      } else {
        setIsSubmit(false);
      }
    };
    checkSubmit();
  }, [isCanhan, isNhom, isTangCuong]);

  return (
    <Card>
      {renderMode === "them" && (
        <Fragment>
          <h3>Thêm học sinh mới</h3>
          <form className={classes.container} onSubmit={themHocSinhMoiHandler}>
            {/* Dòng đầu tiên lấy thông tin: lớp cá nhân, nhóm, giới tính */}
            <div
              className={
                isSubmit
                  ? classes.controls
                  : `${classes.controls} ${classes.warning}`
              }
            >
              <div className={classes.control}>
                <label>Cá nhân</label>
                <div className={classes.boxCheck} onClick={toggleCanhanHandler}>
                  {isCanhan && (
                    <div className={classes.checkIcon}>
                      <BsCheckLg />
                    </div>
                  )}
                </div>
              </div>
              <div className={classes.control}>
                <label>Nhóm</label>
                <div className={classes.boxCheck} onClick={toggleNhomHandler}>
                  {isNhom && (
                    <div className={classes.checkIcon}>
                      <BsCheckLg />
                    </div>
                  )}
                </div>
              </div>
              <div className={classes.control}>
                <label>Tăng cường</label>
                <div
                  className={classes.boxCheck}
                  onClick={toggleTangCuongHandler}
                >
                  {isTangCuong && (
                    <div className={classes.checkIcon}>
                      <BsCheckLg />
                    </div>
                  )}
                </div>
              </div>{" "}
              {!isSubmit && (
                <p style={{ color: "red", fontSize: "1rem" }}>
                  Chú ý phải chọn ở đây nhé.
                </p>
              )}
            </div>
            <div className={classes.controls}>
              <div className={classes.control}>
                <label htmlFor="gioiTinh">Giới tính *</label>
                <select
                  name="gioiTinh"
                  id="gioiTinh"
                  ref={gioiTinhRef}
                  required
                  defaultValue="nam"
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
                  ref={tenHocSinhRef}
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
                  ref={shortNameRef}
                  defaultValue=""
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
                  defaultValue={convertInputDateFormat("03-21-1991")}
                  required
                />
              </div>
              <div className={classes.control}>
                <label htmlFor="soPhutHocMotTiet">Số phút học một tiết *</label>
                <input
                  type="number"
                  name="soPhutHocMotTiet"
                  id="soPhutHocMotTiet"
                  style={{ width: "5rem" }}
                  defaultValue="60"
                  ref={soPhutHocMotTietRef}
                  required
                />
              </div>
            </div>
            {/* Học phí cá nhân và nhóm */}
            <div className={classes.controls}>
              <div className={classes.control}>
                <label htmlFor="hocPhiCaNhan">Học phí cá nhân *</label>
                <input
                  type="number"
                  name="hocPhiCaNhan"
                  id="hocPhiCaNhan"
                  defaultValue="300000"
                  // onChange={setHpCaNhanHandler}
                  ref={hocPhiCaNhanRef}
                  style={{ width: "8rem" }}
                  step="1000"
                  required
                />
              </div>
              <div className={classes.control}>
                <label htmlFor="hocPhiNhom">Học phí nhóm *</label>
                <input
                  type="number"
                  name="hocPhiNhom"
                  id="hocPhiNhom"
                  defaultValue="90000"
                  // onChange={setHpNhomHandler}
                  ref={hocPhiNhomRef}
                  style={{ width: "8rem" }}
                  step="1000"
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
                <label htmlFor="tenPhuHuynh">Tên phụ huynh</label>
                <input
                  style={{ width: "20rem" }}
                  type="text"
                  name="tenPhuHuynh"
                  id="tenPhuHuynh"
                  ref={tenPhuHuynhRef}
                  defaultValue=""
                />
              </div>
              <div className={classes.control}>
                <label htmlFor="soDienThoai">Số điện thoại</label>
                <input
                  style={{ width: "20rem" }}
                  type="text"
                  name="soDienThoai"
                  id="soDienThoai"
                  ref={soDienThoaiRef}
                  defaultValue=""
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
                  defaultValue=""
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
                defaultValue="Thông tin cơ bản trẻ"
              />
            </div>
            {/* Ghi chú ở đây */}
            <CTA message={notiData.message}>
              <button
                type="submit"
                className="btn btn-submit"
                disabled={isSubmit ? "" : "disabled"}
              >
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
          <h3>Sửa thông tin học sinh: {dataHocSinh.shortName}</h3>
          <form className={classes.container} onSubmit={suaHocSinhHandler}>
            {/* Dòng đầu tiên lấy thông tin: lớp cá nhân, nhóm, giới tính */}
            <div
              className={
                isSubmit
                  ? classes.controls
                  : `${classes.controls} ${classes.warning}`
              }
            >
              <div className={classes.control}>
                <label>Cá nhân</label>
                <div className={classes.boxCheck} onClick={toggleCanhanHandler}>
                  {isCanhan && (
                    <div className={classes.checkIcon}>
                      <BsCheckLg />
                    </div>
                  )}
                </div>
              </div>
              <div className={classes.control}>
                <label>Nhóm</label>
                <div className={classes.boxCheck} onClick={toggleNhomHandler}>
                  {isNhom && (
                    <div className={classes.checkIcon}>
                      <BsCheckLg />
                    </div>
                  )}
                </div>
              </div>
              <div className={classes.control}>
                <label>Tăng cường</label>
                <div
                  className={classes.boxCheck}
                  onClick={toggleTangCuongHandler}
                >
                  {isTangCuong && (
                    <div className={classes.checkIcon}>
                      <BsCheckLg />
                    </div>
                  )}
                </div>
              </div>{" "}
              {!isSubmit && (
                <p style={{ color: "red", fontSize: "1rem" }}>
                  Chú ý phải chọn ở đây nhé.
                </p>
              )}
            </div>
            <div className={classes.controls}>
              <div className={classes.control}>
                <label htmlFor="gioiTinh">Giới tính *</label>
                <select
                  name="gioiTinh"
                  id="gioiTinh"
                  ref={gioiTinhRef}
                  required
                  defaultValue={dataHocSinh.gioiTinh === "nam" ? "nam" : "nu"}
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
                  ref={tenHocSinhRef}
                  defaultValue={dataHocSinh.tenHocSinh}
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
                  defaultValue={dataHocSinh.shortName}
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
                  defaultValue={convertInputDateFormat(dataHocSinh.ngaySinh)}
                  required
                />
              </div>
              <div className={classes.control}>
                <label htmlFor="soPhutHocMotTiet">Số phút học một tiết *</label>
                <input
                  type="number"
                  name="soPhutHocMotTiet"
                  id="soPhutHocMotTiet"
                  style={{ width: "5rem" }}
                  ref={soPhutHocMotTietRef}
                  defaultValue={dataHocSinh.soPhutHocMotTiet}
                  required
                />
              </div>
            </div>
            {/* Học phí cá nhân và nhóm */}
            <div className={classes.controls}>
              <div className={classes.control}>
                <label htmlFor="hocPhiCaNhan">Học phí cá nhân *</label>
                <input
                  type="number"
                  name="hocPhiCaNhan"
                  id="hocPhiCaNhan"
                  defaultValue={dataHocSinh.hocPhiCaNhan}
                  ref={hocPhiCaNhanRef}
                  // onChange={setHpCaNhanHandler}
                  style={{ width: "8rem" }}
                  step="1000"
                  required
                />
              </div>
              <div className={classes.control}>
                <label htmlFor="hocPhiNhom">Học phí nhóm *</label>
                <input
                  type="number"
                  name="hocPhiNhom"
                  id="hocPhiNhom"
                  defaultValue={dataHocSinh.hocPhiNhom}
                  ref={hocPhiNhomRef}
                  // onChange={setHpNhomHandler}
                  style={{ width: "8rem" }}
                  step="1000"
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
                <label htmlFor="tenPhuHuynh">Tên phụ huynh</label>
                <input
                  style={{ width: "20rem" }}
                  type="text"
                  name="tenPhuHuynh"
                  id="tenPhuHuynh"
                  ref={tenPhuHuynhRef}
                  defaultValue={dataHocSinh.tenPhuHuynh}
                />
              </div>
              <div className={classes.control}>
                <label htmlFor="soDienThoai">Số điện thoại</label>
                <input
                  style={{ width: "20rem" }}
                  type="text"
                  name="soDienThoai"
                  id="soDienThoai"
                  ref={soDienThoaiRef}
                  defaultValue={dataHocSinh.soDienThoai}
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
                  defaultValue={dataHocSinh.diaChi}
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
                defaultValue={dataHocSinh.thongTinCoBan}
              />
            </div>
            {/* Ghi chú ở đây */}
            <CTA message={notiData.message}>
              <button
                type="submit"
                className="btn btn-submit"
                disabled={isSubmit ? "" : "disabled"}
              >
                Sửa
              </button>
              <Link href="/hoc-sinh/ds-ca-nhan">
                <button type="button" className="btn btn-ghost">
                  Ds cá nhân
                </button>
              </Link>
              <Link href="/hoc-sinh/ds-nhom">
                <button type="button" className="btn btn-ghost">
                  Ds nhóm
                </button>
              </Link>
            </CTA>
          </form>
        </Fragment>
      )}
    </Card>
  );
};

export default ThemHsPage;
