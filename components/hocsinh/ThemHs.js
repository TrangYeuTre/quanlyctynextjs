import classes from "./ThemHs.module.css";
import Card from "../UI/Card";
import CTA from "../UI/CTA";
import { useEffect, useState, useRef, Fragment } from "react";
import Link from "next/link";
import { convertInputDateFormat } from "../../helper/uti";

const ThemHsPage = (props) => {
  //Mong đợi mode dể render tương ứng
  const { renderMode, dataHocSinh } = props;
  //Ref value cho input
  const gioiTinhRef = useRef();
  const tenHocSinhRef = useRef();
  const shortNameRef = useRef();
  const ngaySinhRef = useRef();
  const soPhutHocMotTietRef = useRef();
  const tenPhuHuynhRef = useRef();
  const soDienThoaiRef = useRef();
  const diaChiRef = useRef();
  const thongTinCoBanRef = useRef();

  //State lấy giá trị nhóm,cá nhân
  const [isNhom, setNhom] = useState(false);
  const [isCaNhan, setCaNhan] = useState(false);
  //Sate lấy giá trị hp nhóm cá nhân
  const [hpCaNhan, setHpCaNhan] = useState(300000);
  const [hpNhom, setHpNhom] = useState(90000);
  //State cho phép submit hay không
  const [isSubmit, setSubmit] = useState(false);
  //State báo lỗi
  const [message, setMessage] = useState(null);
  //Cb đổi state
  const setNhomHandler = () => {
    setNhom(!isNhom);
  };
  const setCaNhanHandler = () => {
    setCaNhan(!isCaNhan);
  };
  const setHpCaNhanHandler = (e) => {
    setTimeout(() => {
      setHpCaNhan(e.target.value);
    }, 3000);
  };
  const setHpNhomHandler = (e) => {
    setTimeout(() => {
      setHpNhom(e.target.value);
    }, 3000);
  };
  //Cb chính fetch thêm hs
  const themHocSinhMoiHandler = async (e) => {
    e.preventDefault();
    //Tổng hợp value đẻ submnit
    const dataSubmit = {
      canhan: isCaNhan,
      nhom: isNhom,
      gioiTinh: gioiTinhRef.current.value,
      tenHocSinh: tenHocSinhRef.current.value,
      shortName: shortNameRef.current.value,
      ngaySinh: ngaySinhRef.current.value,
      soPhutHocMotTiet: soPhutHocMotTietRef.current.value,
      hocPhiCaNhan: hpCaNhan,
      hocPhiNhom: hpNhom,
      tenPhuHuynh: tenPhuHuynhRef.current.value,
      soDienThoai: soDienThoaiRef.current.value,
      diaChi: diaChiRef.current.value,
      thongTinCoBan: thongTinCoBanRef.current.value,
    };
    //FETCH HERE
    // await fetch();
  };
  //Cb chính fetch sưa hs
  const suaHocSinhHandler = async (e) => {
    e.preventDefault();
    //Tổng hợp value đẻ submnit
    const dataSubmit = {
      canhan: isCaNhan,
      nhom: isNhom,
      gioiTinh: gioiTinhRef.current.value,
      tenHocSinh: tenHocSinhRef.current.value,
      shortName: shortNameRef.current.value,
      ngaySinh: ngaySinhRef.current.value,
      soPhutHocMotTiet: soPhutHocMotTietRef.current.value,
      hocPhiCaNhan: hpCaNhan,
      hocPhiNhom: hpNhom,
      tenPhuHuynh: tenPhuHuynhRef.current.value,
      soDienThoai: soDienThoaiRef.current.value,
      diaChi: diaChiRef.current.value,
      thongTinCoBan: thongTinCoBanRef.current.value,
    };
    console.log(dataSubmit);
    //FETCH HERE
    // await fetch();
  };
  //Side effect xử lý để được ấn nút submit
  useEffect(() => {
    if (isNhom && hpNhom === 0) {
      setMessage("Đã chọn nhóm thì học phí nhóm phải lớn hơn 0.");
      setSubmit(false);
    }
    if (isCaNhan && hpCaNhan === 0) {
      setMessage("Đã chọn cá nhân thì học phí cá nhân phải lớn hơn 0.");
      setSubmit(false);
    }
    if (!isNhom && !isCaNhan) {
      setMessage("Phải chọn lớp cá nhân hoặc nhóm để tiếp tục!");
      setSubmit(false);
    }
    if (isNhom && hpNhom > 0) {
      setSubmit(true);
      setMessage(null);
    }
    if (isCaNhan && hpCaNhan > 0) {
      setSubmit(true);
      setMessage(null);
    }
  }, [isNhom, isCaNhan, hpNhom, hpCaNhan]);
  //Side effect dugnf cho chế đó sửa
  useEffect(() => {
    if (renderMode === "sua" && !isNhom && !isCaNhan) {
      setMessage("Sửa : Nhớ chọn lại lớp cá nhân hoặc nhóm để sửa !");
    }
    if (renderMode === "sua" && isNhom && dataHocSinh.hocPhiNhom === 0) {
      setMessage("Sửa : Đã chọn nhóm thì học phí nhóm phải lớn hơn 0.");
      setSubmit(false);
    }
    if (renderMode === "sua" && isCaNhan && dataHocSinh.hocPhiCaNhan === 0) {
      setMessage("Sửa :Đã chọn cá nhân thì học phí cá nhân phải lớn hơn 0.");
      setSubmit(false);
    }
  }, [renderMode, isNhom, isCaNhan, dataHocSinh]);
  return (
    <Card>
      {renderMode === "them" && (
        <Fragment>
          <h3>Thêm học sinh mới</h3>
          <form className={classes.container} onSubmit={themHocSinhMoiHandler}>
            {/* Dòng đầu tiên lấy thông tin: lớp cá nhân, nhóm, giới tính */}
            <div className={classes.controls}>
              <div className={classes.control}>
                <label htmlFor="canhan" className={classes.customCheck}>
                  Cá nhân{" "}
                  <input
                    type="checkbox"
                    id="canhan"
                    name="canhan"
                    value="canhan"
                    onChange={setCaNhanHandler}
                  />
                  <span className={classes.checkmark}></span>
                </label>
              </div>
              <div className={classes.control}>
                <label htmlFor="nhom" className={classes.customCheck}>
                  Nhóm{" "}
                  <input
                    type="checkbox"
                    id="nhom"
                    value="nhom"
                    name="nhom"
                    onChange={setNhomHandler}
                  />
                  <span className={classes.checkmark}></span>
                </label>
              </div>{" "}
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
                  onChange={setHpCaNhanHandler}
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
                  onChange={setHpNhomHandler}
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
            <CTA message={message}>
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
            <div className={classes.controls}>
              <div className={classes.control}>
                <label htmlFor="canhan" className={classes.customCheck}>
                  Cá nhân{" "}
                  <input
                    type="checkbox"
                    id="canhan"
                    name="canhan"
                    value="canhan"
                    onChange={setCaNhanHandler}
                  />
                  <span className={classes.checkmark}></span>
                </label>
              </div>
              <div className={classes.control}>
                <label htmlFor="nhom" className={classes.customCheck}>
                  Nhóm{" "}
                  <input
                    type="checkbox"
                    id="nhom"
                    value="nhom"
                    name="nhom"
                    onChange={setNhomHandler}
                  />
                  <span className={classes.checkmark}></span>
                </label>
              </div>{" "}
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
                  onChange={setHpCaNhanHandler}
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
                  onChange={setHpNhomHandler}
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
            <CTA message={message}>
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
