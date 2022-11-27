import classes from "./ThongKeHocSinh.module.css";
import Card from "../UI/Card";
import ChonMotNguoi from "../UI/ChonMotNguoi";
import PickDateBar from "../UI/PickDateBar";
import Search from "../UI/Search";
import { locShortNameTheoKeyword } from "../../helper/uti";
import {
  getArrDataDdcnThangHocSinhRender,
  layShortNameGiaoVienDayThe,
} from "./ddcn_helper";
import { useState, useContext } from "react";
import ChonNguoiContext from "../../context/chonNguoiContext";

//Comp phụ render 1 thẻ ngày data
const DateDataBar = (props) => {
  const { ngayDiemDanh, gvShortName, type, soPhutHocMotTiet } = props;
  //Khởi tạo css
  let finalStyle = classes.hsItem;
  if (type === "dayChinh") {
    finalStyle = `${classes.hsItem} ${classes.dayChinh}`;
  }
  if (type === "dayThe") {
    finalStyle = `${classes.hsItem} ${classes.dayThe}`;
  }
  if (type === "dayTangCuong") {
    finalStyle = `${classes.hsItem} ${classes.dayTangCuong}`;
  }
  if (type === "nghi dayBu") {
    finalStyle = `${classes.hsItem} ${classes.dayBu}`;
  }
  if (type === "nghi") {
    finalStyle = `${classes.hsItem} ${classes.nghi}`;
  }
  return (
    <div
      key={ngayDiemDanh}
      className={finalStyle}
      style={{ cursor: "not-allowed" }}
    >
      <p>
        {new Date(ngayDiemDanh).getDate()} -- {gvShortName} --{" "}
        {`(${soPhutHocMotTiet || null})'`}
      </p>
    </div>
  );
};

const ThongKeHocSinhPage = (props) => {
  const { arrHocSinh, arrDdcn } = props;
  //Ctx chọn người
  const chonNguoiCtx = useContext(ChonNguoiContext);
  const hocSinhChonId = chonNguoiCtx.nguoiDuocChonId;
  //Lấy shortName hs chọn
  const hsChonShortName = layShortNameGiaoVienDayThe(arrHocSinh, hocSinhChonId);

  //State lấy key search học sinh
  const [keyword, setKeyword] = useState("");
  //State lấy ngày đẻ lọc kết quả
  const [ngayLoc, setNgayLoc] = useState(new Date());
  //Lấy tên tháng chọn
  const tenThangChon = new Date(ngayLoc).getMonth() + 1;
  //Cb lấy key word tử sẻach
  const getSearchKey = (key) => {
    setKeyword(key);
  };
  //Cb lấy ngày đẻ lọc
  const layNgayLocHandler = (date) => {
    setNgayLoc(date);
  };
  //Xử lý mảng hs cuối được render sau khi xử lý search
  let arrHocSinhRender = locShortNameTheoKeyword(arrHocSinh, keyword);
  //Xử lý mảng điểm danh cá nhân của học sinh trong tháng đẻ render
  const arrDiemDanhThangRender = getArrDataDdcnThangHocSinhRender(
    arrDdcn,
    ngayLoc,
    hocSinhChonId
  );
  return (
    <Card>
      <div className={classes.container}>
        <div className={classes.control}>
          <h4>Chọn học sinh để xem kết quả</h4>
          <Search
            getKeyword={getSearchKey}
            hint="Nhập một/nhiều kí tự trong tên tìm nhanh học sinh..."
          />
          <ChonMotNguoi arrPeople={arrHocSinhRender} />
        </div>
        <div className={classes.control}>
          <PickDateBar
            getNgayDuocChon={layNgayLocHandler}
            title="Chọn ngày để lọc kết quả"
            hint="Ví dụ: chọn ngày 21/03/2022 thì kết quả thống kê là theo tháng 3 năm
          2022"
          />
        </div>
        <div className={classes.control} style={{ borderBottom: "none" }}>
          <ul className={classes.ghiChuMau}>
            <div className={classes.nodeItem}>
              <p>Dạy chính</p>
              <div className={classes.dayChinhNode}></div>
            </div>
            <div className={classes.nodeItem}>
              <p>Dạy thế</p>
              <div className={classes.dayTheNode}></div>
            </div>
            <div className={classes.nodeItem}>
              <p>Dạy tăng cường</p>
              <div className={classes.dayTangCuongNode}></div>
            </div>
            <div className={classes.nodeItem}>
              <p>Nghỉ - Đã bù</p>
              <div className={classes.dayBuNode}></div>
            </div>
            <div className={classes.nodeItem}>
              <p>Nghỉ - Chưa bù</p>
              <div className={classes.nghiNode}></div>
            </div>
          </ul>
          {/* Phần render ds ngày */}
          <div className={classes.dataContainer}>
            <h4>
              Kết quả điểm danh học sinh:{" "}
              <span style={{ color: "var(--mauMh4--)" }}>
                {hsChonShortName}
              </span>{" "}
              tháng{" "}
              <span style={{ color: "var(--mauMh4--)" }}>{tenThangChon}</span>
            </h4>
            {arrDiemDanhThangRender.length === 0 && <p>Không có dữ liệu</p>}
            {arrDiemDanhThangRender.length > 0 &&
              arrDiemDanhThangRender.map((item) => (
                <DateDataBar
                  key={item.ngayDiemDanh}
                  ngayDiemDanh={item.ngayDiemDanh}
                  type={item.type}
                  gvShortName={item.gvShortName}
                  soPhutHocMotTiet={item.soPhutHocMotTiet || null}
                />
              ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ThongKeHocSinhPage;
