import classes from "./HocPhiTinh.module.css";
import Card from "../UI/Card";
import ChonMotNguoi from "../UI/ChonMotNguoi";
import Search from "../UI/Search";
import PickDateBar from "../UI/PickDateBar";
import ChonNguoiContext from "../../context/chonNguoiContext";
import { useState, useContext } from "react";
import { layArrHocSinhRender } from "./hocphi_helper";
import Lich from "./lich/Lich";
import ChonNhieuNgay from "./chonNhieuNgay/ChonNhieuNGay";
import SuaNgayTrongLich from "./lich/SuaNgay";
import { xuLyGopLoaiLop } from "../../helper/uti";

const HocPhiTinhPage = (props) => {
  const { arrHocSinh } = props;
  //Láy ctx chọn người đẻ lấy học sinh được chọn
  const chonNguoiCtx = useContext(ChonNguoiContext);
  const hocSinhChonId = chonNguoiCtx.nguoiDuocChonId;
  //State lấy keyword từ search để lọc
  const [keySearch, setKeySearch] = useState();
  //State lấy ngày được chọn
  const [ngayChon, setNgayChon] = useState(new Date());
  //State lấy data của ngày được chọn
  const [dataNgayChon, setDataNgayChon] = useState({});
  //State lấy data ngày sửa để sửa lại lịch
  const [arrDataNgaySua, setArrDataNgaySua] = useState([]);
  //State ẩn / hiện phần chọn cho đỡ rối
  const [hideChonHs, setShowChonHs] = useState(false);
  const toggleAnHienChonHs = () => {
    setShowChonHs(!hideChonHs);
  };
  //State ẩn / hiện phần chọn ngày cho đỡ rối
  const [hideChonNgay, setShowChonNgay] = useState(false);
  const toggleAnHienChonNgay = () => {
    setShowChonNgay(!hideChonNgay);
  };
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
  //Cb lấy key từ comp Search
  const layKeySearchHandler = (value) => {
    setKeySearch(value);
  };
  //Cb lấy ngày được chọn
  const layNgayChonHandler = (date) => {
    setNgayChon(date);
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
  //Lọc lại mảng hs theo key để render
  const arrHocSinhRender = layArrHocSinhRender(keySearch, arrHocSinh);

  return (
    <Card>
      <h4>
        Chọn học sinh để tính phí tháng mới{" "}
        <span
          onClick={toggleAnHienChonHs}
          style={{ color: "var(--mauMh1--)", cursor: "pointer" }}
        >
          {" "}
          {hideChonHs ? " -- Show chọn" : " -- Ẩn chọn"}{" "}
        </span>
      </h4>
      {!hideChonHs && (
        <div className={classes.container}>
          <Search
            getKeyword={layKeySearchHandler}
            hint="Nhập chữ cái tên học sinh để tìm ..."
          />
          <ChonMotNguoi arrPeople={arrHocSinhRender} />
        </div>
      )}
      {/* ___________________________________________________ */}
      <h4 style={{ paddingTop: "2rem" }}>
        Chọn ngày để tính phí{" "}
        <span
          onClick={toggleAnHienChonNgay}
          style={{ color: "var(--mauMh1--)", cursor: "pointer" }}
        >
          {" "}
          {hideChonNgay ? " -- Show chọn" : " -- Ẩn chọn"}{" "}
        </span>
      </h4>
      {!hideChonNgay && (
        <div className={classes.container}>
          <PickDateBar
            getNgayDuocChon={layNgayChonHandler}
            hint="Bị khóa chỉ chọn được ngày trong tháng hiện tại nhé.Ví dụ: chọn ngày 20/11/2022 có nghĩa là tính học phí cho tháng 12/2022"
            // limitCurMonth={true}
          />
        </div>
      )}
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
                backgroundColor: "var(--mauMh4--)",
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
        />
      </div>
    </Card>
  );
};

export default HocPhiTinhPage;
