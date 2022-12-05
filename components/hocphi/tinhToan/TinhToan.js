import classes from "./TinhToan.module.css";
import Card from "../../UI/Card";
import { useState, useEffect } from "react";
import {
  layHocPhiCaNhanNhomCuaHocSinh,
  layThongTinHocSinhTuId,
} from "../hocphi_helper";
import Lich from "../lich/Lich";
import ChonNhieuNgay from "../chonNhieuNgay/ChonNhieuNGay";
import SuaNgayTrongLich from "../lich/SuaNgay";
import TinhTienTam from "../TinhTienTam";
import { convertInputDateFormat } from "../../../helper/uti";

const TinhToanHocPhiPage = (props) => {
  const { arrHocSinh, hocSinhId: hocSinhChonId, thangTinh } = props;
  const hocSinhShortName = layThongTinHocSinhTuId(
    arrHocSinh,
    hocSinhChonId
  ).shortName;
  //Lấy thong tin học phí cùa học sinh để tính tiền
  const { hpCaNhan, hpNhom } = layHocPhiCaNhanNhomCuaHocSinh(
    arrHocSinh,
    hocSinhChonId
  );
  //State lấy ngày được chọn
  const [ngayChon, setNgayChon] = useState(new Date());
  //Side effect lấy tháng tính truyền xuống
  useEffect(() => {
    setNgayChon(new Date(`01/${thangTinh}`));
  }, [thangTinh]);
  //State data điểm danh cá nhân tháng trước của học sinh để load tính phí tăng cường, nghỉ bù
  const [arrDdcnThangTruoc, setArrDdcnThangTruoc] = useState([]);
  console.log(arrDdcnThangTruoc);
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
  //Lọc lại mảng hs theo key để render
  // const arrHocSinhRender = arrHocSinh;
  //Side effect lần đầu load trang thì fetch get data ddcn của học sinh
  useEffect(() => {
    //Muốn viết async code trong useEffect phải tạo và call riêng như sau
    const fetchGetDdcnThangTruoc = async () => {
      //Lấy data submit cái
      const dataSubmit = {
        hocSinhId: hocSinhChonId,
        ngayTinhPhi: convertInputDateFormat(ngayChon),
      };
      //Fetch
      const response = await fetch("/api/hocphi/layDdcnThangTruoc", {
        method: "POST",
        body: JSON.stringify(dataSubmit),
        headers: { "Content-Type": "application/json" },
      });
      const statusCode = response.status;
      const dataGot = await response.json();
      const arrDdcnThangTruoc = dataGot.data;
      setArrDdcnThangTruoc(arrDdcnThangTruoc);
    };
    fetchGetDdcnThangTruoc();
  }, []);
  return (
    <Card>
      <h3 style={{ textAlign: "center" }}>
        Tính phí cho học sinh{" "}
        <span style={{ color: "var(--mauMh4--)" }}>{hocSinhShortName}</span>,
        tháng <span style={{ color: "var(--mauMh4--)" }}>{thangTinh}</span>
      </h3>
      {/* ___________________________________________________ */}
      <div className={classes.container}>
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
        <Lich
          ngayChon={ngayChon}
          arrDataNgaySua={arrDataNgaySua}
          dataNhieuNgayChon={dataNhieuNgayChon}
          showNgaySua={showSuaNgayChonHandler}
          layDataThongKe={getDataThongKeLich}
        />
        <h4>Kết quả tính tạm</h4>
        <TinhTienTam
          thongKeLich={thongKeLich}
          hpCaNhan={hpCaNhan}
          hpNhom={hpNhom}
        />
      </div>
    </Card>
  );
};

export default TinhToanHocPhiPage;
