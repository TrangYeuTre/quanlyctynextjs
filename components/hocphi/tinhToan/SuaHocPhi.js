import classes from "./TinhToan.module.css";
import Card from "../../UI/Card";
import CTA from "../../UI/CTA";
import Loading from "../../UI/Loading";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import {
  xuLyLayThongTinDdcnThangTruoc,
  chuyenThangViewThanhNgay,
} from "../hocphi_helper";
import NotiContext from "../../../context/notiContext";
import LichSua from "../lich/LichSua";
import Lich from "../lich/Lich";
import ChonNhieuNgay from "../chonNhieuNgay/ChonNhieuNGay";
import SuaNgayTrongLich from "../lich/SuaNgay";
import TinhTienTam from "../TinhTienTam";
import {
  convertInputDateFormat,
  redirectPageAndResetState,
} from "../../../helper/uti";
import HocPhiHocSinh from "../../../classes/HocPhiHocSinh";
import DataHocSinh from "../../../classes/DataHocSinh";

const SuaHocPhiPage = (props) => {
  //VARIABLES
  const { hocSinhId: hocSinhChonId, thangTinh } = props;
  const API_GET_DDCN_THANGTRUOC_ROUTE = "/api/hocphi/layDdcnThangTruoc";
  const API_GET_HOCPHISUA_ROUTE = "/api/hocphi/layHocPhiSua";
  const notiCtx = useContext(NotiContext);
  const hocSinhShortName = DataHocSinh.traHsCaNhanData(hocSinhChonId)
    ? DataHocSinh.traHsCaNhanData(hocSinhChonId).shortName
    : "";
  const hpCaNhan = DataHocSinh.traHsCaNhanData(hocSinhChonId)
    ? +DataHocSinh.traHsCaNhanData(hocSinhChonId).hocPhiCaNhan
    : 0;
  const hpNhom = DataHocSinh.traHsCaNhanData(hocSinhChonId)
    ? +DataHocSinh.traHsCaNhanData(hocSinhChonId).hocPhiNhom
    : 0;
  const [isFetching, setIsFetching] = useState(false);
  const [ngayChon, setNgayChon] = useState(new Date());
  const [arrDdcnThangTruoc, setArrDdcnThangTruoc] = useState([]);
  const [dataNgayChon, setDataNgayChon] = useState({});
  const [arrDataNgaySua, setArrDataNgaySua] = useState([]);
  const [thongKeLich, setThongkeLich] = useState({});
  const [showChonNhieuNgay, changeShowNhieuNgay] = useState(true);
  const [dataNhieuNgayChon, setNhieuNgayChon] = useState({
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
    Sat: [],
    Sun: [],
  });
  const [lichDaChonNgay, setLichChonNgay] = useState([]);

  //CALLBACKS
  const startFetching = () => {
    setIsFetching(true);
  };
  const endFetching = () => {
    setIsFetching(false);
  };

  const getDataThongKeLich = (data) => {
    setThongkeLich(data);
  };
  const setLichChonNgayHandler = (arr) => {
    setLichChonNgay(arr);
  };

  const showChonNhieuNgayHandler = () => {
    changeShowNhieuNgay(true);
    setDataNgayChon({});
    scrollToIdView("chonnhieungay");
  };
  const showSuaNgayChonHandler = (dataDate) => {
    changeShowNhieuNgay(false);
    setDataNgayChon(dataDate);
    scrollToIdView("suangayduocchon");
  };
  const scrollToIdView = (id) => {
    setTimeout(() => {
      document.getElementById(id).scrollIntoView();
    }, 200);
  };

  //Cb reset lịch, xóa nhiều ngày chọn, thêm nhiều ngày chọn
  const layDataNhieuNgayHandler = (data) => {
    const { type, arrThuChon, loaiLop, heso } = data;
    const preDataNhieuNgayChon = { ...dataNhieuNgayChon };
    if (type === "reset") {
      resetDataToanBoNgayTrongLich();
    }
    if (type === "xoa") {
      xoaDataNhieuNgayChonTrongLich(arrThuChon, preDataNhieuNgayChon);
    }
    if (type === "them") {
      themDataNhieuNgayChonTrongLich(
        arrThuChon,
        preDataNhieuNgayChon,
        loaiLop,
        heso
      );
    }
  };
  const resetDataToanBoNgayTrongLich = () => {
    setNhieuNgayChon({
      Mon: [],
      Tue: [],
      Wed: [],
      Thu: [],
      Fri: [],
      Sat: [],
      Sun: [],
    });
  };
  const xoaDataNhieuNgayChonTrongLich = (arrThuChon, preDataNhieuNgayChon) => {
    arrThuChon.forEach((item) => (preDataNhieuNgayChon[item.value] = []));
    setNhieuNgayChon(preDataNhieuNgayChon);
  };
  const themDataNhieuNgayChonTrongLich = (
    arrThuChon,
    preDataNhieuNgayChon,
    loaiLop,
    heso
  ) => {
    arrThuChon.forEach((item) => {
      const curThu = item.value;
      //Ghi chú: preDataNhieuNgayChon[curThu] ~ {Mon:[...],Tue:[...], .... }
      const arrCurPropsWeekday = preDataNhieuNgayChon[curThu]; // tức dạng Mon:[...] ~ array
      if (arrCurPropsWeekday.length > 0) {
        const indexItemExisted = timIndexLoaiLopTrongArrThuocPropsWeekday(
          arrCurPropsWeekday,
          loaiLop
        );
        if (indexItemExisted === -1) {
          themMoiDataLoaiLop(arrCurPropsWeekday, loaiLop, heso);
        } else {
          updateDataLoaiLop(arrCurPropsWeekday, indexItemExisted, heso);
        }
      }
      if (arrCurPropsWeekday.length === 0) {
        themMoiDataLoaiLop(arrCurPropsWeekday, loaiLop, heso);
      }
      setNhieuNgayChon(preDataNhieuNgayChon);
    });
  };
  const timIndexLoaiLopTrongArrThuocPropsWeekday = (
    arrCurPropsWeekday,
    loaiLop
  ) => {
    const indexItemExisted = arrCurPropsWeekday.findIndex(
      (item) => item.loaiLop === loaiLop
    );
    return indexItemExisted;
  };
  const themMoiDataLoaiLop = (arrCurPropsWeekday, loaiLop, heso) => {
    arrCurPropsWeekday.push({ loaiLop: loaiLop, heso: heso });
  };
  const updateDataLoaiLop = (arrCurPropsWeekday, indexItemExisted, heso) => {
    arrCurPropsWeekday[indexItemExisted].heso = heso;
  };

  //CB lấy data ngày được sửa
  const getDataNgaySuaHandler = (data) => {
    if (!data) {
      return;
    }
    const preArrDataNgaySua = [...arrDataNgaySua];
    //Data {idCell, ngay , nhom:1, canha:2}
    if (arrDataNgaySua.length === 0) {
      themMoiDataNgaySua(preArrDataNgaySua, data);
    } else {
      const indexCellNgaySua = timIndexCellNgaySua(preArrDataNgaySua, data);
      if (indexCellNgaySua === -1) {
        themMoiDataNgaySua(preArrDataNgaySua, data);
      } else {
        updateDataNgaySua(preArrDataNgaySua, indexCellNgaySua, data);
      }
    }
    setArrDataNgaySua(preArrDataNgaySua);
  };
  const timIndexCellNgaySua = (preArrDataNgaySua, data) => {
    const indexCellNgaySua = preArrDataNgaySua.findIndex(
      (item) => item.idCell === data.idCell
    );
    return indexCellNgaySua;
  };
  const themMoiDataNgaySua = (preArrDataNgaySua, data) => {
    preArrDataNgaySua.push(data);
    return preArrDataNgaySua;
  };
  const updateDataNgaySua = (preArrDataNgaySua, indexCellNgaySua, data) => {
    preArrDataNgaySua.splice(indexCellNgaySua, 1);
    preArrDataNgaySua.push(data);
    return preArrDataNgaySua;
  };

  //CB chính submit sửa phí tháng đã tồn tại
  const suaPhiThangTonTaiHandler = async () => {
    const hocPhiThangUpdate = new HocPhiHocSinh({
      hocSinhId: hocSinhChonId,
      ngayTinhPhi: convertInputDateFormat(ngayChon),
      lichDaChonNgay: lichDaChonNgay,
    });
    const { statusCode, dataGot } = await hocPhiThangUpdate.themHocPhiHocSinh();
    dayThongBao(statusCode, dataGot);
  };
  const dayThongBao = (statusCode, dataGot) => {
    setTimeout(() => {
      notiCtx.clearNoti();
      if (statusCode === 200 || statusCode === 201) {
        redirectPageAndResetState("/hoc-phi/dau-vao");
      }
    }, process.env.DELAY_TIME_NOTI);
    window.scrollTo(0, 0);
    notiCtx.pushNoti({ status: statusCode, message: dataGot.thongbao });
  };

  //SIDE EFFECT
  useEffect(() => {
    setNgayChon(chuyenThangViewThanhNgay(thangTinh));
  }, [thangTinh]);
  useEffect(() => {
    if (!isAllowFetching(hocSinhChonId, thangTinh)) {
      return;
    }
    const fetchGetDdcnThangTruoc = async () => {
      startFetching();
      const dataSubmit = {
        hocSinhId: hocSinhChonId,
        ngayTinhPhi: chuyenThangViewThanhNgay(thangTinh),
      };
      const response = await fetch(API_GET_DDCN_THANGTRUOC_ROUTE, {
        method: "POST",
        body: JSON.stringify(dataSubmit),
        headers: { "Content-Type": "application/json" },
      });
      const dataGot = await response.json();
      const arrDdcnThangTruoc = dataGot.data;
      setArrDdcnThangTruoc(arrDdcnThangTruoc);
      endFetching();
    };
    fetchGetDdcnThangTruoc();
  }, [hocSinhChonId, thangTinh]);
  useEffect(() => {
    if (!isAllowFetching(hocSinhChonId, thangTinh)) {
      return;
    }
    const fetchGetDataHocPhiSua = async () => {
      startFetching();
      const response = await fetch(API_GET_HOCPHISUA_ROUTE, {
        method: "POST",
        body: JSON.stringify({
          hocSinhId: hocSinhChonId,
          ngayTinhPhi: chuyenThangViewThanhNgay(thangTinh),
        }),
        headers: { "Content-Type": "application/json" },
      });
      const dataGot = await response.json();
      const lichDaChonNgay = dataGot.data.lichDaChonNgay;
      if (lichDaChonNgay) {
        setLichChonNgay(lichDaChonNgay);
      }
      endFetching();
    };
    fetchGetDataHocPhiSua();
  }, [hocSinhChonId, thangTinh]);
  const isAllowFetching = (hocSinhChonId, thangTinh) => {
    return (
      hocSinhChonId && hocSinhChonId !== "" && thangTinh && thangTinh !== ""
    );
  };

  //XỬ LÝ LẤY DATA DDCN THÁNG TRƯƠCS ĐỂ THÔGNS KÊ HP NGHỈ VÀ TĂNG CƯỜNG
  const {
    arrNghiKhongBuCoPhep,
    arrNghiKhongBuKoPhep,
    arrNghiCoBu,
    arrTangCuong,
    tongNgayNghiCoBu,
    tongNgayTangCuong,
    tienNghiCoBu,
    tienNghiKhongBuCoPhep,
    tienNghiKhongBuKoPhep,
    tienTangCuong,
  } = xuLyLayThongTinDdcnThangTruoc(arrDdcnThangTruoc, hocSinhChonId, hpCaNhan);

  if (isFetching) {
    return <Loading />;
  }

  return (
    <Card isSubBg={true}>
      <h3 style={{ textAlign: "center" }}>
        Sửa học phí cho học sinh{" "}
        <span style={{ color: "var(--mauMh4--)" }}>{hocSinhShortName}</span>,
        tháng <span style={{ color: "var(--mauMh4--)" }}>{thangTinh}</span>
      </h3>
      {/* ___________________________________________________ */}
      <div className={classes.container}>
        <p className="ghichu">
          Lịch bên dưới là lịch của tháng đã tính. Dùng để tham khảo khi muốn
          tính lại học phí.{" "}
        </p>
        <LichSua ngayChon={ngayChon} lichDaChonNgay={lichDaChonNgay} />
        <div
          style={{
            borderBottom: "5px solid var(--mauNen--)",
            marginBottom: "1rem",
          }}
        ></div>
        {showChonNhieuNgay && <h4 id="chonnhieungay">Thêm nhanh nhiều ngày</h4>}
        {showChonNhieuNgay && (
          <ChonNhieuNgay layData={layDataNhieuNgayHandler} />
        )}
        {!showChonNhieuNgay && (
          <h4 id="suangayduocchon">
            Sửa ngày được chọn{" "}
            <span
              style={{
                color: "var(--mauNen--)",
                padding: "2px .5rem",
                backgroundColor: "var(--mauMh1--)",
                borderRadius: "5px",
                marginLeft: "5px",
              }}
            >
              {dataNgayChon.ngay}
            </span>
          </h4>
        )}
        {!showChonNhieuNgay && (
          <SuaNgayTrongLich
            huySua={showChonNhieuNgayHandler}
            dataNgayChon={dataNgayChon}
            getDataNgaySua={getDataNgaySuaHandler}
          />
        )}
        {/* Chú ý comp Lich bên dưới load theo đúng ngày truyền xuống - đo đó muốn load tháng sau hải chọn ngày đã công jtheem 1 thagns rồi truyền xuôgns nhé */}
        <p className="ghichu">
          Lịch bên dưới là lịch để thao tác tính lại học phí cho học sinh.{" "}
        </p>
        <Lich
          ngayChon={ngayChon}
          arrDataNgaySua={arrDataNgaySua}
          dataNhieuNgayChon={dataNhieuNgayChon}
          showNgaySua={showSuaNgayChonHandler}
          layDataThongKe={getDataThongKeLich}
          layLichSubmit={setLichChonNgayHandler}
        />
        <h4>Kết quả tính tạm</h4>
        <TinhTienTam
          thongKeLich={thongKeLich}
          hpCaNhan={hpCaNhan}
          hpNhom={hpNhom}
          arrNghiKhongBuCoPhep={arrNghiKhongBuCoPhep}
          arrNghiKhongBuKoPhep={arrNghiKhongBuKoPhep}
          arrNghiCoBu={arrNghiCoBu}
          arrTangCuong={arrTangCuong}
          tongNgayNghiCoBu={tongNgayNghiCoBu}
          tongNgayTangCuong={tongNgayTangCuong}
          tienNghiCoBu={tienNghiCoBu}
          tienNghiKhongBuCoPhep={tienNghiKhongBuCoPhep}
          tienNghiKhongBuKoPhep={tienNghiKhongBuKoPhep}
          tienTangCuong={tienTangCuong}
        />
      </div>
      <CTA>
        <button
          type="button"
          onClick={suaPhiThangTonTaiHandler}
          className="btn btn-submit"
        >
          Chốt sửa học phí
        </button>
      </CTA>
    </Card>
  );
};

export default SuaHocPhiPage;
