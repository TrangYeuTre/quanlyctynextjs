import classes from "./SuaNgayDdHocSinh.module.css";
import { useState, useEffect, useRef, Fragment, useContext } from "react";
import { convertInputDateFormat } from "../../helper/uti";
import { getDataSubmitSuaNgayDiemDanh } from "./ddcn_helper";
import { useRouter } from "next/router";
import NotiContext from "../../context/notiContext";
import DiemDanhCaNhan from "../../classes/DiemDanhCaNhan";

const SuaNgayDiemDanhCuaHocSinhPage = (props) => {
  //VARIABLES
  const { data, arrGiaoVien, tatTrangSua } = props;
  const router = useRouter();
  const notiCtx = useContext(NotiContext);
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
  const [typeDd, setTypeDd] = useState();
  const [gvDayTheId, setGvDayTheId] = useState("none");
  const [gvDayBuId, setGvDayBuId] = useState("none");
  const [ngayDayBu, setNgayDayBu] = useState(
    convertInputDateFormat(new Date())
  );
  const [heSoHoanTien, setHeSoHoanTien] = useState(0.7);
  const [timeHocMotTiet, setTimeHocMotTiet] = useState(
    soPhutHocMotTiet ? soPhutHocMotTiet : 45
  );

  //CALLBACKS
  const thietLapLoaiDdHandler = (e) => {
    setTypeDd(e.target.value);
  };
  const thietLapGvTheIdHandler = (e) => {
    setGvDayTheId(e.target.value);
  };
  const thietLapGvBuIdHandler = (e) => {
    setGvDayBuId(e.target.value);
  };
  const thietLapNgayBuHandler = (e) => {
    setNgayDayBu(e.target.value);
  };
  const thietLapHeSoHoanTienHandler = (e) => {
    setHeSoHoanTien(+e.target.value);
  };
  const thietLapSoPhutHocHandler = (e) => {
    setTimeHocMotTiet(+e.target.value);
  };
  const tatTrangSuaHandler = () => {
    tatTrangSua();
  };

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

  //FUNCTIONS
  const suaNgayDiemDanhHandler = async (e) => {
    e.preventDefault();
    const { statusCode, dataGot } = await DiemDanhCaNhan.suaNgayDiemDanhCaNhan(
      dataSubmit
    );
    dayThongBao(statusCode, dataGot);
  };
  const xoaHocSinhDiemDanhHandler = async (hocSinhId) => {
    const { statusCode, dataGot } =
      await DiemDanhCaNhan.xoaHocSinhTrongNgayDiemDanhCaNhan(
        hocSinhId,
        ngayDiemDanhId
      );
    dayThongBao(statusCode, dataGot);
  };
  const dayThongBao = (statusCode, dataGot) => {
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
      message: dataGot.thongbao,
    });
  };

  //SIDE ECFFECT
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
      {/* T??n v?? ng??y ??i???m danh, fix c???ng */}
      <div className={classes.controls}>
        <div className={classes.control}>
          <label>B?? danh: </label>
          <p style={{ color: "var(--mauMh4--)" }}>{shortName}</p>
        </div>
        <div className={classes.control}>
          <label>Ng??y s???a: </label>
          <p style={{ color: "var(--mauMh4--)" }}>{ngayDiemDanh}</p>
        </div>
      </div>
      {/* Ki???u ??i???m danh x??i chung */}
      <div className={classes.control}>
        <label>Lo???i ??i???m danh: </label>
        <select value={typeDd} onChange={thietLapLoaiDdHandler}>
          <option value="dayChinh">D???y ch??nh</option>
          <option value="dayThe">D???y th???</option>
          <option value="dayTangCuong">D???y t??ng c?????ng</option>
          {typeDd === "nghi" && <option value="dayBu">D???y b??</option>}
          <option value="nghi">Ngh???</option>
        </select>
      </div>
      {/* Lo???i th???ng ngh??? kh??ng render c??i n??y */}
      {typeDd !== "nghi" && typeDd !== "dayThe" && (
        <div className={classes.control}>
          <label>S??? ph??t h???c m???t ti???t: </label>
          <input
            type="number"
            value={timeHocMotTiet}
            onChange={thietLapSoPhutHocHandler}
          />
        </div>
      )}
      {/* Tr?????ng h???p d???y th??? */}
      {typeDd === "dayThe" && (
        <div className={classes.control}>
          <label>Ch???n l???i gi??o vi??n d???y th???: </label>
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
      {/* Tr?????ng h???p d???y b?? */}
      {typeDd === "dayBu" && (
        <Fragment>
          <div className={classes.control}>
            <label>Ch???n gi??o vi??n d???y b??: </label>
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
            <label>Ng??y ngh???: </label>
            <input
              type="date"
              value={convertInputDateFormat(ngayDiemDanh)}
              disabled
            />
          </div>

          <div className={classes.control}>
            <label>Ch???n ng??y d???y b??: </label>
            <input
              type="date"
              value={ngayDayBu}
              onChange={thietLapNgayBuHandler}
            />
          </div>
          <p className="ghichu">
            - V?? d??? sau khi th???c hi???n d???y b?? cho ng??y ngh???, ph???n th???ng k?? khi
            k??ch v??o ng??y xanh lam s??? kh??ng load l???i ???????c data d???y b?? ????? s???a.
            Khi ???? : ph???i s???a l???i ng??y ???? l?? ngh??? -- sau ???? s??a l???i ng??y ????
            th??nh d???y b?? m???t l???n n???a m???i c???p nh???t ???????c th??ng tin d???y b??.
          </p>
        </Fragment>
      )}
      {/* Tr?????ng h???p ngh??? */}
      {typeDd === "nghi" && (
        <Fragment>
          <div className={classes.control}>
            <label>H??? s??? ho??n ph?? </label>
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
            - Ch???n ch??? ????? d???y b?? n???u mu???n b?? cho ng??y ngh??? n??y. Ch?? ??: ch??? ??ang
            ??? ch??? ????? ngh??? n??y m???i ch???n ???????c d???y b??.
          </p>
          <p className="ghichu">
            - H??? s??? ho??n ti???n 1 : ngh??? c?? ph??p. H??? s??? ho??n ti???n 0.7: ho??n 70%
            ti??n
          </p>
        </Fragment>
      )}
      <div className={classes.actions}>
        <button type="submit" className="btn btn-submit">
          S???a
        </button>
        <button
          type="button"
          className="btn btn-submit"
          onClick={xoaHocSinhDiemDanhHandler.bind(0, hocSinhId)}
        >
          X??a
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
