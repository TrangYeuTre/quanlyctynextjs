import classes from "./ThongKeHocSinh.module.css";
import Card from "../UI/Card";
import ChonMotNguoi from "../UI/ChonMotNguoi";
import PickDateBar from "../UI/PickDateBar";
import Search from "../UI/Search";
import { getArrDataDdcnThangHocSinhRender } from "./ddcn_helper";
import { useState, useContext, useEffect } from "react";
import ChonNguoiContext from "../../context/chonNguoiContext";
import DataHocSinh from "../../classes/DataHocSinh";
import DataDiemDanhCaNhan from "../../classes/DataDiemDanhCaNhan";
import { convertInputDateFormat } from "../../helper/uti";
import Loading from "../UI/Loading";

//Comp phụ render 1 thẻ ngày data
const DateDataBar = (props) => {
  const { ngayDiemDanh, gvShortName, type, soPhutHocMotTiet } = props;

  const xuLyStyleChoLoaiNgayDiemDanh = () => {
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
    return finalStyle;
  };
  const finalStyle = xuLyStyleChoLoaiNgayDiemDanh();

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
  //VARIABLES
  const [arrDdcn, setArrDdcn] = useState([]);
  const chonNguoiCtx = useContext(ChonNguoiContext);
  const hocSinhChonId = chonNguoiCtx.nguoiDuocChonId;
  const hsChonShortName = DataHocSinh.traHsCaNhanData(hocSinhChonId)
    ? DataHocSinh.traHsCaNhanData(hocSinhChonId).shortName
    : "";
  const [isFetching, setIsFetching] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [ngayLoc, setNgayLoc] = useState(new Date());
  const tenThangChon = new Date(ngayLoc).getMonth() + 1;
  const arrHocSinhRender = DataHocSinh.timKiemHsCaNhanTheoShortName(keyword);
  const arrDiemDanhThangRender = getArrDataDdcnThangHocSinhRender(
    arrDdcn,
    hocSinhChonId
  );

  //CALLBACKS
  const getSearchKey = (key) => {
    setKeyword(key);
  };
  const startFetching = () => {
    setIsFetching(true);
  };
  const endFetching = () => {
    setIsFetching(false);
  };
  const layNgayLocHandler = (date) => {
    setNgayLoc(date);
  };

  //SIDE EFFECT
  useEffect(() => {
    const isAllowFetching = () => {
      return ngayLoc && hocSinhChonId && hocSinhChonId !== "";
    };
    if (!isAllowFetching) {
      return;
    }
    const createDataSubmit = (hocSinhChonId, ngayLoc) => {
      return {
        hocSinhId: hocSinhChonId || null,
        ngayThongKe: convertInputDateFormat(ngayLoc) || "",
      };
    };
    const dataSubmit = createDataSubmit(hocSinhChonId, ngayLoc);
    const fetchLoadDataDdcnByNgayVaHocSinhId = async () => {
      startFetching();
      const { statusCode, dataGot } =
        await DataDiemDanhCaNhan.loadArrDdcnByNgayVaHocSinhId(dataSubmit);
      if (statusCode === 201) {
        setArrDdcn(dataGot.data);
      } else {
        setArrDdcn([]);
      }
      endFetching();
    };
    fetchLoadDataDdcnByNgayVaHocSinhId();
  }, [hocSinhChonId, ngayLoc]);

  return (
    <Card>
      {!isFetching && (
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
              {arrDiemDanhThangRender &&
                arrDiemDanhThangRender.length === 0 && <p>Không có dữ liệu</p>}
              {arrDiemDanhThangRender &&
                arrDiemDanhThangRender.length > 0 &&
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
      )}
      {isFetching && <Loading />}
    </Card>
  );
};

export default ThongKeHocSinhPage;
