import classes from "./SuaNgayDdHocSinh.module.css";
import { useState, useEffect, useRef, Fragment, useContext } from "react";
import { convertInputDateFormat } from "../../helper/uti";
import { getDataSubmitSuaNgayDiemDanh } from "./ddcn_helper";
import { useRouter } from "next/router";
import NotiContext from "../../context/notiContext";

const SuaNgayDiemDanhCuaHocSinhPage = (props) => {
  const { data, arrGiaoVien, tatTrangSua } = props;
  const router = useRouter();
  const notiCtx = useContext(NotiContext);
  //Des ra các prop chung
  //2 props quan trọng : ngayDiemDanhId để tìm trực tiếp obj trên db đẻ sửa, hocSInhId để tìm học sinh trong obj đéo để sửa
  const {
    ngayDiemDanhId,
    hocSinhId,
    type,
    shortName,
    ngayDiemDanh,
    soPhutHocMotTiet,
    giaoVienDayTheId,
    giaoVienDayBuId,
  } = data;

  //Ref var

  //State quan sát type điểm danh để trong trường hợp đổi loại điểm danh cho ngày thì load form phù hợp
  const [typeDd, setTypeDd] = useState();

  //State quan sát giáo viên dạy thế id
  const [gvDayTheId, setGvDayTheId] = useState("none");
  //State quan sát giáo viên dạy thế id
  const [gvDayBuId, setGvDayBuId] = useState("none");
  //State ngày nghỉ trước đó để chọn dạy bù
  //State ngày dạy bù
  const [ngayDayBu, setNgayDayBu] = useState(
    convertInputDateFormat(new Date())
  );
  //State hệ số haonf tiền
  const [heSoHoanTien, setHeSoHoanTien] = useState(0.7);
  //State số phút học một tiêt
  const [timeHocMotTiet, setTimeHocMotTiet] = useState(
    soPhutHocMotTiet ? soPhutHocMotTiet : 45
  );

  //Cb thiết lập laoij điểm danh
  const thietLapLoaiDdHandler = (e) => {
    setTypeDd(e.target.value);
  };
  //Cb thiết lập gv dạy thế id
  const thietLapGvTheIdHandler = (e) => {
    setGvDayTheId(e.target.value);
  };
  //Cb thiết lập dạy bù id
  const thietLapGvBuIdHandler = (e) => {
    setGvDayBuId(e.target.value);
  };

  //Cb thiết lập ngày dạy bù
  const thietLapNgayBuHandler = (e) => {
    setNgayDayBu(e.target.value);
  };
  //Cb thiết lập hệ số hoàn tiền
  const thietLapHeSoHoanTienHandler = (e) => {
    setHeSoHoanTien(+e.target.value);
  };
  //Cb thiết lập hệ số hoàn tiền
  const thietLapSoPhutHocHandler = (e) => {
    setTimeHocMotTiet(+e.target.value);
  };
  //Cb tăt trang sửa, trở lại trang thống kê
  const tatTrangSuaHandler = () => {
    tatTrangSua();
  };

  //Tổng hợp data submit
  const dataSubmit = getDataSubmitSuaNgayDiemDanh(
    ngayDiemDanhId,
    hocSinhId,
    typeDd,
    timeHocMotTiet,
    gvDayTheId,
    arrGiaoVien,
    gvDayBuId,
    ngayDiemDanh,
    ngayDayBu,
    heSoHoanTien,
    shortName
  );
  //Cb chính sửa lại ngày điểm dánh
  const suaNgayDiemDanhHandler = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/ddcn/suaNgayDiemDanh", {
      method: "PUT",
      body: JSON.stringify(dataSubmit),
      headers: { "Content-Type": "application/json" },
    });
    const statusCode = response.status;
    const dataRes = await response.json();
    //Chạy push noti
    setTimeout(() => {
      notiCtx.clearNoti();
      if (statusCode === 200 || statusCode === 201) {
        tatTrangSuaHandler();
        router.reload();
      }
    }, process.env.DELAY_TIME_NOTI);
    window.scrollTo(0, 0);
    notiCtx.pushNoti({
      status: statusCode,
      message: dataRes.thongbao,
    });
  };
  //Cb chính xóa ngày điểm dánh
  const xoaHocSinhDiemDanhHandler = async (hocSinhId) => {
    const response = await fetch("/api/ddcn/xoaHocSinhTrongNgayDiemDanh", {
      method: "DELETE",
      body: JSON.stringify({
        ngayDiemDanhId: ngayDiemDanhId,
        hocSinhId: hocSinhId,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const statusCode = response.status;
    const dataRes = await response.json();
    //Chạy push noti
    setTimeout(() => {
      notiCtx.clearNoti();
      if (statusCode === 200 || statusCode === 201) {
        tatTrangSuaHandler();
        router.reload();
      }
    }, process.env.DELAY_TIME_NOTI);
    window.scrollTo(0, 0);
    notiCtx.pushNoti({
      status: statusCode,
      message: dataRes.thongbao,
    });
  };

  //Side effect sửa lại type
  useEffect(() => {
    setTypeDd(type);
    if (giaoVienDayTheId) {
      setGvDayTheId(giaoVienDayTheId);
    }
    if (giaoVienDayBuId) {
      setGvDayBuId(giaoVienDayTheId);
    }
  }, [type, giaoVienDayTheId, giaoVienDayBuId]);

  return (
    <form className={classes.container} onSubmit={suaNgayDiemDanhHandler}>
      {/* Tên và ngày điểm danh, fix cứng */}
      <div className={classes.controls}>
        <div className={classes.control}>
          <label>Bí danh: </label>
          <p style={{ color: "var(--mauMh4--)" }}>{shortName}</p>
        </div>
        <div className={classes.control}>
          <label>Ngày sửa: </label>
          <p style={{ color: "var(--mauMh4--)" }}>{ngayDiemDanh}</p>
        </div>
      </div>
      {/* Kiểu điểm danh xài chung */}
      <div className={classes.control}>
        <label>Loại điểm danh: </label>
        <select value={typeDd} onChange={thietLapLoaiDdHandler}>
          <option value="dayChinh">Dạy chính</option>
          <option value="dayThe">Dạy thế</option>
          <option value="dayTangCuong">Dạy tăng cường</option>
          {typeDd === "nghi" && <option value="dayBu">Dạy bù</option>}
          <option value="nghi">Nghỉ</option>
        </select>
      </div>
      {/* Loại thằng nghỉ không render cái này */}
      {typeDd !== "nghi" && (
        <div className={classes.control}>
          <label>Số phút học một tiết: </label>
          <input
            type="number"
            value={timeHocMotTiet}
            onChange={thietLapSoPhutHocHandler}
          />
        </div>
      )}
      {/* Trường hợp dạy thế */}
      {typeDd === "dayThe" && (
        <div className={classes.control}>
          <label>Chọn lại giáo viên dạy thế: </label>
          <select value={gvDayTheId} onChange={thietLapGvTheIdHandler}>
            <option value="none">None</option>
            {arrGiaoVien.length > 0 &&
              arrGiaoVien.map((giaovien) => (
                <option key={giaovien.id} value={giaovien.id}>
                  {giaovien.shortName}
                </option>
              ))}
          </select>
        </div>
      )}
      {/* Trường hợp dạy bù */}
      {typeDd === "dayBu" && (
        <Fragment>
          <div className={classes.control}>
            <label>Chọn giáo viên dạy bù: </label>
            <select value={gvDayBuId} onChange={thietLapGvBuIdHandler}>
              <option value="none">None</option>
              {arrGiaoVien.length > 0 &&
                arrGiaoVien.map((giaovien) => (
                  <option key={giaovien.id} value={giaovien.id}>
                    {giaovien.shortName}
                  </option>
                ))}
            </select>
          </div>
          <div className={classes.control}>
            <label>Ngày nghỉ: </label>
            <input
              type="date"
              value={convertInputDateFormat(ngayDiemDanh)}
              disabled
            />
          </div>

          <div className={classes.control}>
            <label>Chọn ngày dạy bù: </label>
            <input
              type="date"
              value={ngayDayBu}
              onChange={thietLapNgayBuHandler}
            />
          </div>
          <p className="ghichu">
            - Ví dụ sau khi thực hiện dạy bù cho ngày nghỉ, phần thống kê khi
            kích vào ngày xanh lam sẽ không load lại được data dạy bù để sửa.
            Khi đó : phải sửa lại ngày đó là nghỉ -- sau đó sưa lại ngày đó
            thành dạy bù một lần nữa mới cập nhật được thông tin dạy bù.
          </p>
        </Fragment>
      )}
      {/* Trường hợp nghỉ */}
      {typeDd === "nghi" && (
        <Fragment>
          <div className={classes.control}>
            <label>Hệ số hoàn phí </label>
            <input
              type="number"
              min={0}
              max={1}
              step={0.1}
              value={heSoHoanTien}
              onChange={thietLapHeSoHoanTienHandler}
            />
          </div>
          <p className="ghichu">
            - Chọn chế độ dạy bù nếu muốn bù cho ngày nghỉ này. Chú ý: chỉ đang
            ở chế độ nghỉ này mới chọn được dạy bù.
          </p>
          <p className="ghichu">
            - Hệ số hoàn tiền 1 : nghỉ có phép. Hệ số hoàn tiền 0.7: hoàn 70%
            tiên
          </p>
        </Fragment>
      )}
      <div className={classes.actions}>
        <button type="submit" className="btn btn-submit">
          Sửa
        </button>
        <button
          type="button"
          className="btn btn-submit"
          onClick={xoaHocSinhDiemDanhHandler.bind(0, hocSinhId)}
        >
          Xóa
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={tatTrangSuaHandler}
        >
          Huy
        </button>
      </div>
    </form>
  );
};

export default SuaNgayDiemDanhCuaHocSinhPage;
