import classes from "./TinhToan.module.css";
import Card from "../../UI/Card";
import CTA from "../../UI/CTA";
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
import { convertInputDateFormat } from "../../../helper/uti";
import HocPhiHocSinh from "../../../classes/HocPhiHocSinh";
import DataHocSinh from "../../../classes/DataHocSinh";

const SuaHocPhiPage = (props) => {
  const { hocSinhId: hocSinhChonId, thangTinh } = props;
  const notiCtx = useContext(NotiContext);
  const router = useRouter();
  const arrHocSinh = DataHocSinh.arrHocSinhCaNhan;
  //Tra thông tin hoc sinh
  const hocSinhShortName = DataHocSinh.traHsCaNhanData(hocSinhChonId)
    ? DataHocSinh.traHsCaNhanData(hocSinhChonId).shortName
    : "";
  const hpCaNhan = DataHocSinh.traHsCaNhanData(hocSinhChonId)
    ? +DataHocSinh.traHsCaNhanData(hocSinhChonId).hocPhiCaNhan
    : 0;
  const hpNhom = DataHocSinh.traHsCaNhanData(hocSinhChonId)
    ? +DataHocSinh.traHsCaNhanData(hocSinhChonId).hocPhiNhom
    : 0;
  //State lấy ngày được chọn
  const [ngayChon, setNgayChon] = useState(new Date());
  //Side effect lấy tháng tính truyền xuống
  useEffect(() => {
    setNgayChon(chuyenThangViewThanhNgay(thangTinh));
  }, [thangTinh]);
  //State data điểm danh cá nhân tháng trước của học sinh để load tính phí tăng cường, nghỉ bù
  const [arrDdcnThangTruoc, setArrDdcnThangTruoc] = useState([]);
  //State lấy data của ngày được chọn
  const [dataNgayChon, setDataNgayChon] = useState({});
  //State lấy data ngày sửa để sửa lại lịch
  const [arrDataNgaySua, setArrDataNgaySua] = useState([]);
  //State lấy data thống kê lịch cuối cùng
  const [thongKeLich, setThongkeLich] = useState({});
  //State toggle ẩn hiển phần chọn nhiều ngày / sửa ngày được chọn
  const [showChonNhieuNgay, changeShowNhieuNgay] = useState(true);
  const showChonNhieuNgayHandler = () => {
    changeShowNhieuNgay(true);
    setDataNgayChon({});
    setTimeout(() => {
      document.getElementById("chonnhieungay").scrollIntoView();
    }, 200);
  };
  const showSuaNgayChonHandler = (dataDate) => {
    changeShowNhieuNgay(false);
    //Chú set data ngay chọn bên dưới là để load ban đầu cho giao diện sửa ngày
    setDataNgayChon(dataDate);
    setTimeout(() => {
      document.getElementById("suangayduocchon").scrollIntoView();
    }, 200);
  };
  //State lấy nhiều ngày được chọnh
  const [dataNhieuNgayChon, setNhieuNgayChon] = useState({
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
    Sat: [],
    Sun: [],
  });
  //State lấy mảng lịch với ngày đã chọn để submit
  const [lichDaChonNgay, setLichChonNgay] = useState([]);
  const setLichChonNgayHandler = (arr) => {
    setLichChonNgay(arr);
  };
  //Cb lấy data từ lấy nhiều ngày
  const layDataNhieuNgayHandler = (data) => {
    const { type, arrThuChon, loaiLop, heso } = data;
    //Clone lại preState để xử lý
    const preDataNhieuNgayChon = { ...dataNhieuNgayChon };
    //Reset
    if (type === "reset") {
      setNhieuNgayChon({
        Mon: [],
        Tue: [],
        Wed: [],
        Thu: [],
        Fri: [],
        Sat: [],
        Sun: [],
      });
    }
    //Xóa nhiều
    if (type === "xoa") {
      //Chạy lặp xử lý xóa
      arrThuChon.forEach((item) => (preDataNhieuNgayChon[item.value] = []));
      //Trả
      setNhieuNgayChon(preDataNhieuNgayChon);
    }
    //THêm nhiều
    if (type === "them") {
      //Chạy lặp arrThuChon submit lên để xử lý
      arrThuChon.forEach((item) => {
        const curThu = item.value;
        if (preDataNhieuNgayChon[curThu].length > 0) {
          //Tìm xem item đã tồn tại chưa
          const indexItemExisted = preDataNhieuNgayChon[curThu].findIndex(
            (item) => item.loaiLop === loaiLop
          );
          if (indexItemExisted === -1) {
            //Đẩy vào mảng thôi
            preDataNhieuNgayChon[curThu].push({ loaiLop: loaiLop, heso: heso });
          } else {
            //Tìm thấy thì chỉnh lại hệ số
            preDataNhieuNgayChon[curThu][indexItemExisted].heso = heso;
          }
        } // end if
        if (preDataNhieuNgayChon[curThu].length === 0) {
          //Đẩy vào thảng thôi
          preDataNhieuNgayChon[curThu].push({ loaiLop: loaiLop, heso: heso });
        }
        //Xử lý xong thì update lại
        setNhieuNgayChon(preDataNhieuNgayChon);
      });
    }
  };
  //CB lấy data đã sửa của ngày được sửa để chỉnh lại lịch
  const getDataNgaySuaHandler = (data) => {
    const preArrDataNgaySua = [...arrDataNgaySua];
    //Data {idCell, ngay , nhom:1, canha:2}
    if (arrDataNgaySua.length === 0) {
      preArrDataNgaySua.push(data);
    } else {
      const indexItemMatched = preArrDataNgaySua.findIndex(
        (item) => item.idCell === data.idCell
      );
      if (indexItemMatched === -1) {
        preArrDataNgaySua.push(data);
      } else {
        preArrDataNgaySua.splice(indexItemMatched, 1);
        preArrDataNgaySua.push(data);
      }
    } //end if xử lý chính
    //Cập nhật lại
    setArrDataNgaySua(preArrDataNgaySua);
  };
  //CB lấy data thống kê cuối cùng của lịch
  const getDataThongKeLich = (data) => {
    setThongkeLich(data);
  };
  //CB chính submit sửa phí tháng đã tồn tại
  const tinhPhiThangMoiHandler = async () => {
    const hocPhiThangUpdate = new HocPhiHocSinh({
      hocSinhId: hocSinhChonId,
      ngayTinhPhi: convertInputDateFormat(ngayChon),
      lichDaChonNgay: lichDaChonNgay,
    });
    const { statusCode, dataGot } = await hocPhiThangUpdate.themHocPhiHocSinh();
    //Đẩy thông báo
    setTimeout(() => {
      notiCtx.clearNoti();
      router.replace("/hoc-phi/dau-vao");
    }, process.env.DELAY_TIME_NOTI);
    window.scrollTo(0, 0);
    notiCtx.pushNoti({ status: statusCode, message: dataGot.thongbao });
  };
  //Side effect lần đầu load trang thì fetch get data ddcn của học sinh
  useEffect(() => {
    //Muốn viết async code trong useEffect phải tạo và call riêng như sau
    const fetchGetDdcnThangTruoc = async () => {
      //Lấy data submit cái
      const dataSubmit = {
        hocSinhId: hocSinhChonId,
        ngayTinhPhi: chuyenThangViewThanhNgay(thangTinh),
      };
      //Fetch
      const response = await fetch("/api/hocphi/layDdcnThangTruoc", {
        method: "POST",
        body: JSON.stringify(dataSubmit),
        headers: { "Content-Type": "application/json" },
      });
      // const statusCode = response.status;
      const dataGot = await response.json();
      const arrDdcnThangTruoc = dataGot.data;
      setArrDdcnThangTruoc(arrDdcnThangTruoc);
    };
    //Async lấy data ngày sửa học phí từ collections hocphis
    const fetchGetDataHocPhiSua = async () => {
      const response = await fetch("/api/hocphi/layHocPhiSua", {
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
    };
    fetchGetDdcnThangTruoc();
    fetchGetDataHocPhiSua();
  }, [hocSinhChonId, thangTinh]);
  //Từ mảng ddcn tháng trước của hs fetch về -> xử lý lại để lấy các thông số nghỉ, tăng cuòng
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

  //Trả trả trả nào
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
          onClick={tinhPhiThangMoiHandler}
          className="btn btn-submit"
        >
          Chốt sửa học phí
        </button>
      </CTA>
    </Card>
  );
};

export default SuaHocPhiPage;
