import classes from "./TinhToan.module.css";
import Card from "../../UI/Card";
import CTA from "../../UI/CTA";
import Loading from "../../UI/Loading";
import { useState, useEffect, useContext } from "react";
import {
  xuLyLayThongTinDdcnThangTruoc,
  chuyenThangViewThanhNgay,
} from "../hocphi_helper";
import NotiContext from "../../../context/notiContext";
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

const TinhToanHocPhiPage = (props) => {
  //VARIABLES
  const { hocSinhId: hocSinhChonId, thangTinh } = props;
  const notiCtx = useContext(NotiContext);
  const API_GET_DDCN_THANGTRUOC_ROUTE = "/api/hocphi/layDdcnThangTruoc";
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
  const setLichChonNgayHandler = (arr) => {
    setLichChonNgay(arr);
  };
  const getDataThongKeLich = (data) => {
    setThongkeLich(data);
  };

  //Cb reset l???ch, x??a nhi???u ng??y ch???n, th??m nhi???u ng??y ch???n
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
      //Ghi ch??: preDataNhieuNgayChon[curThu] ~ {Mon:[...],Tue:[...], .... }
      const arrCurPropsWeekday = preDataNhieuNgayChon[curThu]; // t???c d???ng Mon:[...] ~ array
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

  //CB l???y data ng??y ???????c s???a
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

  //CB ch??nh submit t??nh ph?? th??ng m???i
  const tinhPhiThangMoiHandler = async () => {
    const hocPhiThangMoi = new HocPhiHocSinh({
      hocSinhId: hocSinhChonId,
      ngayTinhPhi: convertInputDateFormat(ngayChon),
      lichDaChonNgay: lichDaChonNgay,
    });
    const { statusCode, dataGot } = await hocPhiThangMoi.themHocPhiHocSinh();
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
        ngayTinhPhi: convertInputDateFormat(`01/${thangTinh}`),
      };
      const response = await fetch(API_GET_DDCN_THANGTRUOC_ROUTE, {
        method: "POST",
        body: JSON.stringify(dataSubmit),
        headers: { "Content-Type": "application/json" },
      });
      const dataGot = await response.json();
      const arrDdcnThangTruoc = dataGot.data;
      if (arrDdcnThangTruoc && arrDdcnThangTruoc.length > 0) {
        setArrDdcnThangTruoc(arrDdcnThangTruoc);
      } else {
        setArrDdcnThangTruoc([]);
      }
      endFetching();
    };
    fetchGetDdcnThangTruoc();
  }, [hocSinhChonId, thangTinh]);
  const isAllowFetching = (hocSinhChonId, thangTinh) => {
    return (
      hocSinhChonId && hocSinhChonId !== "" && thangTinh && thangTinh !== ""
    );
  };

  //X??? L?? L???Y DATA DDCN TH??NG TR????CS ????? TH??GNS K?? HP NGH??? V?? T??NG C?????NG
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
  //Tr???
  return (
    <Card>
      <h3 style={{ textAlign: "center" }}>
        T??nh ph?? cho h???c sinh{" "}
        <span style={{ color: "var(--mauMh4--)" }}>{hocSinhShortName}</span>,
        th??ng <span style={{ color: "var(--mauMh4--)" }}>{thangTinh}</span>
      </h3>
      {/* ___________________________________________________ */}
      <div className={classes.container}>
        {showChonNhieuNgay && <h4 id="chonnhieungay">Th??m nhanh nhi???u ng??y</h4>}
        {showChonNhieuNgay && (
          <ChonNhieuNgay layData={layDataNhieuNgayHandler} />
        )}
        {!showChonNhieuNgay && (
          <h4 id="suangayduocchon">
            S???a ng??y ???????c ch???n{" "}
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
        {/* Ch?? ?? comp Lich b??n d?????i load theo ????ng ng??y truy???n xu???ng - ??o ???? mu???n load th??ng sau h???i ch???n ng??y ???? c??ng jtheem 1 thagns r???i truy???n xu??gns nh?? */}
        <Lich
          ngayChon={ngayChon}
          arrDataNgaySua={arrDataNgaySua}
          dataNhieuNgayChon={dataNhieuNgayChon}
          showNgaySua={showSuaNgayChonHandler}
          layDataThongKe={getDataThongKeLich}
          layLichSubmit={setLichChonNgayHandler}
        />
        <h4>K???t qu??? t??nh t???m</h4>
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
          onClick={tinhPhiThangMoiHandler}
          className="btn btn-submit"
        >
          Ch???t t??nh ph?? th??ng m???i
        </button>
      </CTA>
    </Card>
  );
};

export default TinhToanHocPhiPage;
