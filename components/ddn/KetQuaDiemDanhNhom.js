import classes from "./DiemDanhNhom.module.css";
import Card from "../UI/Card";
import Layout28 from "../layout/layout-2-8";
import PickLopNhomBar from "../UI/PickLopNhomBar";
import PickDateBar from "../UI/PickDateBar";
import { useState, Fragment, useContext } from "react";
import { layTenLopNhom, layMangDdnRender } from "./ddn_helper";
import NotiContext from "../../context/notiContext";
import { useRouter } from "next/router";
import KetQuaDdnBar from "../UI/KetQuaDdnBar";

const KetQuaDiemDanhNhomPage = (props) => {
  const API_DDN_ROUTE = "/api/ddn/diemDanhNhom";
  const { arrLopNhom, arrDdnFitler } = props;

  const router = useRouter();
  const notiCtx = useContext(NotiContext);

  //State kiểm soát id lớp nhóm được chọn
  const [lopNhomChonId, setLopNhomChonId] = useState();
  //Lấy tên lớp nhóm chọn
  const tenLopNhomChon = layTenLopNhom(arrLopNhom, lopNhomChonId);
  //State kiểm soát ngày được chọn để view kết quả
  const [ngayChon, setNgayChon] = useState(new Date());
  //View mont và year
  const thangView = new Date(ngayChon).getMonth() + 1;
  const namView = new Date(ngayChon).getFullYear();
  //Cb lấy ngày được chọn
  const layNgayDiemDanhNhomHandler = (date) => {
    setNgayChon(date);
  };
  //cb lấy lớp nhóm được chọn
  const layLopNhomChonIdHandler = (idLopNhom) => {
    setLopNhomChonId(idLopNhom);
  };

  //Lọc lại mảng điểm danh nhóm theo ngày và theo id lớp nhóm được chọn
  const arrDdnRender = layMangDdnRender(arrDdnFitler, lopNhomChonId, ngayChon);

  //Cb xóa ngày đỉem danh nhóm
  const xoaNgayDdnHandler = async (id) => {
    const response = await fetch(API_DDN_ROUTE, {
      method: "DELETE",
      body: JSON.stringify(id),
      headers: { "Content-Type": "application/json" },
    });
    const statusCode = response.status;
    const dataGot = await response.json();
    setTimeout(() => {
      notiCtx.clearNoti();
      if ((statusCode === 200) | (statusCode === 201)) {
        router.reload();
      }
    }, process.env.DELAY_TIME_NOTI);
    window.scrollTo(0, 0);
    notiCtx.pushNoti({ status: statusCode, message: dataGot.thongbao });
  };

  return (
    <Card>
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
                  <span style={{ color: "var(--mauMh4--)" }}>{thangView}</span>{" "}
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
                      data={item}
                      xoaNgayDiemDanhNhom={xoaNgayDdnHandler}
                    />
                  ))}
              </div>
            </Fragment>
          )}
        </div>
      </Layout28>
    </Card>
  );
};

export default KetQuaDiemDanhNhomPage;
