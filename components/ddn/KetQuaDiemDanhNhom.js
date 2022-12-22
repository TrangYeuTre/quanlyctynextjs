import classes from "./DiemDanhNhom.module.css";
import Card from "../UI/Card";
import Loading from "../UI/Loading";
import Layout28 from "../layout/layout-2-8";
import PickLopNhomBar from "../UI/PickLopNhomBar";
import PickDateBar from "../UI/PickDateBar";
import { useState, Fragment, useContext, useEffect } from "react";
import { layMangDdnRender } from "./ddn_helper";
import { removeDomItem } from "../../helper/uti";
import NotiContext from "../../context/notiContext";
import KetQuaDdnBar from "../UI/KetQuaDdnBar";
import DiemDanhNhom from "../../classes/DiemDanhNhom";
import DataLopNhom from "../../classes/DataLopNhom";
import DataDiemDanhNhom from "../../classes/DataDiemDanhNhom";
import { convertInputDateFormat } from "../../helper/uti";

const KetQuaDiemDanhNhomPage = (props) => {
  //VARIABLES
  const arrLopNhom = DataLopNhom.arrLopNhom;
  const notiCtx = useContext(NotiContext);
  const [arrDdnFitler, setArrDdnFilter] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [lopNhomChonId, setLopNhomChonId] = useState();
  const tenLopNhomChon = DataLopNhom.traTenLopNhomChon(lopNhomChonId);
  const [ngayChon, setNgayChon] = useState(new Date());
  const thangView = new Date(ngayChon).getMonth() + 1;
  const namView = new Date(ngayChon).getFullYear();
  const arrDdnRender = layMangDdnRender(arrDdnFitler, lopNhomChonId, ngayChon);

  //CALLBACKS
  const layNgayDiemDanhNhomHandler = (date) => {
    setNgayChon(date);
  };
  const layLopNhomChonIdHandler = (idLopNhom) => {
    setLopNhomChonId(idLopNhom);
  };
  const startFetching = () => {
    setIsFetching(true);
  };
  const endFetching = () => {
    setIsFetching(false);
  };

  //FUNCTIONS
  const xoaNgayDdnHandler = async (ngayId) => {
    const { statusCode, dataGot } = await DiemDanhNhom.xoaNgayDiemDanhNhom(
      ngayId
    );
    dayThongBao(statusCode, dataGot, ngayId);
  };
  const dayThongBao = (statusCode, dataGot, ngayId) => {
    setTimeout(() => {
      notiCtx.clearNoti();
      if ((statusCode === 200) | (statusCode === 201)) {
        removeDomItem(ngayId);
      }
    }, process.env.DELAY_TIME_NOTI);
    notiCtx.pushNoti({ status: statusCode, message: dataGot.thongbao });
  };

  //SIDE EFFECT
  useEffect(() => {
    const ngayThongKeFormat = convertInputDateFormat(ngayChon);
    const isAllowFetching = (lopNhomChonId, ngayThongKe) => {
      return (
        lopNhomChonId &&
        ngayThongKe &&
        lopNhomChonId !== "" &&
        ngayThongKe !== ""
      );
    };
    if (!isAllowFetching(lopNhomChonId, ngayThongKeFormat)) {
      return;
    }
    const loadDataDiemDanhNhom = async (lopNhomChonId, ngayThongKe) => {
      startFetching();
      const { statusCode, dataGot } =
        await DataDiemDanhNhom.loadDataDiemDanhNhom(lopNhomChonId, ngayThongKe);
      if (statusCode === 201) {
        setArrDdnFilter(dataGot.data);
      } else {
        setArrDdnFilter([]);
      }
      endFetching();
    };
    loadDataDiemDanhNhom(lopNhomChonId, ngayThongKeFormat);
  }, [lopNhomChonId, ngayChon]);

  return (
    <Card>
      {!isFetching && (
        <Layout28>
          <div className="smallArea">
            <PickLopNhomBar
              arrLopNhom={arrLopNhom}
              layLopNhomId={layLopNhomChonIdHandler}
            />
          </div>
          <div className="bigArea">
            {!lopNhomChonId && <h3>Chọn lớp nhóm để thao tác</h3>}
            {lopNhomChonId && (
              <Fragment>
                <div className={classes.controls}>
                  <PickDateBar
                    title="Chọn ngày để xem kết quả"
                    getNgayDuocChon={layNgayDiemDanhNhomHandler}
                  />
                </div>
                <div className={classes.controls}>
                  <h4>
                    Kết quả điểm danh nhóm tháng{" "}
                    <span style={{ color: "var(--mauMh4--)" }}>
                      {thangView}
                    </span>{" "}
                    năm
                    <span style={{ color: "var(--mauMh4--)" }}>
                      {" "}
                      {namView}
                    </span>{" "}
                    của lớp:{" "}
                    <span style={{ color: "var(--mauMh4--)" }}>
                      {" "}
                      {tenLopNhomChon}
                    </span>
                  </h4>
                  {/* Map mảng data xuống bar */}
                  {arrDdnRender.length > 0 &&
                    arrDdnRender.map((item) => (
                      <KetQuaDdnBar
                        key={item.id}
                        id={item.id}
                        data={item}
                        xoaNgayDiemDanhNhom={xoaNgayDdnHandler}
                      />
                    ))}
                </div>
              </Fragment>
            )}
          </div>
        </Layout28>
      )}
      {isFetching && <Loading />}
    </Card>
  );
};

export default KetQuaDiemDanhNhomPage;
