import classes from "./DiemDanhCaNhan.module.css";
import Card from "../UI/Card";
import Layout28 from "../layout/layout-2-8";
import PickGiaoVienBar from "../UI/PickGiaoVienBar";
import { useContext, useState, useEffect } from "react";
import { removeDomItem } from "../../helper/uti";
import GiaoVienContext from "../../context/giaoVienContext";
import NotiContext from "../../context/notiContext";
import PickDateBar from "../UI/PickDateBar";
import ItemNgayDdcn from "./ItemNgayDdcn";
import SuaNgayDiemDanhCuaHocSinhPage from "./SuaNgayDdHocSinh";
import DiemDanhCaNhan from "../../classes/DiemDanhCaNhan";
import DataGiaoVien from "../../classes/DataGiaoVien";

const ThongKeGiaoVienPage = (props) => {
  //VARIABLES
  const arrGiaoVien = DataGiaoVien.arrGiaoVien;
  const {
    ngayThongKe,
    thietLapNgayThongKe,
    arrDdcnOfThisMonth,
    thietLapGiaoVienChonId,
  } = props;
  const [hocSinhSua, setHocSinhSua] = useState(null);
  const gvCtx = useContext(GiaoVienContext);
  const notiCtx = useContext(NotiContext);
  const giaoVienChonId = gvCtx.giaoVienSelectedId;
  const curTimeView = new Date(ngayThongKe).toLocaleString("en-GB", {
    month: "numeric",
    year: "numeric",
  });
  const arrDdcnByGvNThisMonth = arrDdcnOfThisMonth.sort((a, b) =>
    new Date(a.ngayDiemDanh) < new Date(b.ngayDiemDanh) ? -1 : 1
  );

  //CALLBACKS
  const renderTrangSuaHocSinhHandler = (data) => {
    setHocSinhSua(data);
  };
  const huyRenderTrangSuaHsHandler = () => {
    setHocSinhSua(null);
  };
  const layNgayHandler = (date) => {
    thietLapNgayThongKe(date);
  };

  //FUNCTIONS
  const xoaNgayDiemDanhHandler = async (ngayDiemDanhId) => {
    const { statusCode, dataGot } = await DiemDanhCaNhan.xoaNgayDiemDanhCaNhan(
      ngayDiemDanhId
    );
    dayThongBao(statusCode, dataGot, ngayDiemDanhId);
  };
  const dayThongBao = (statusCode, dataGot, ngayDiemDanhId) => {
    setTimeout(() => {
      notiCtx.clearNoti();
      if (statusCode === 200 || statusCode === 201) {
        removeDomItem(ngayDiemDanhId);
      }
    }, process.env.DELAY_TIME_NOTI);
    notiCtx.pushNoti({
      status: statusCode,
      message: dataGot.thongbao,
    });
  };

  //SIDE EFFECT
  useEffect(() => {
    thietLapGiaoVienChonId(giaoVienChonId);
  }, [giaoVienChonId, thietLapGiaoVienChonId]);

  return (
    <Card>
      <Layout28>
        {!giaoVienChonId && !hocSinhSua && (
          <div className="smallArea">
            <PickGiaoVienBar arrGiaoVien={arrGiaoVien} />
          </div>
        )}
        {giaoVienChonId && !hocSinhSua && (
          <div className="smallArea">
            <PickGiaoVienBar arrGiaoVien={arrGiaoVien} />
          </div>
        )}
        {giaoVienChonId && hocSinhSua && (
          <div className="smallArea">
            <PickGiaoVienBar arrGiaoVien={arrGiaoVien} disAll={true} />
          </div>
        )}

        {/* Giao di??n load trang l???ch th??ng k?? */}
        {giaoVienChonId && !hocSinhSua && (
          <div className="bigArea">
            <div className={classes.controls}>
              <PickDateBar
                getNgayDuocChon={layNgayHandler}
                hint="V?? d???: n???u ch???n ng??y 20/01/2022 th?? k???t qu??? th??ng k?? ??i???m danh s??? l?? c???a th??ng 1 n??m 2022."
                limitPreNThisMonth={true}
              />
            </div>
            <div className={classes.controls}>
              <div className={classes.container}>
                <h4>K???t qu??? ??i???m danh th??ng {curTimeView}</h4>
                <ul className={classes.ghiChuMau}>
                  <div className={classes.nodeItem}>
                    <p>D???y ch??nh</p>
                    <div className={classes.dayChinh}></div>
                  </div>
                  <div className={classes.nodeItem}>
                    <p>D???y th???</p>
                    <div className={classes.dayThe}></div>
                  </div>
                  <div className={classes.nodeItem}>
                    <p>D???y t??ng c?????ng</p>
                    <div className={classes.dayTangCuong}></div>
                  </div>
                  <div className={classes.nodeItem}>
                    <p>Ngh??? - ???? b??</p>
                    <div className={classes.dayBu}></div>
                  </div>
                  <div className={classes.nodeItem}>
                    <p>Ngh??? - Ch??a b??</p>
                    <div className={classes.nghi}></div>
                  </div>
                </ul>
                <ul className={classes.listLich}>
                  <p className="ghichu">
                    C?? Trang l??n c?? th??? click tr???c ti???p v??o th??? h???c sinh m??u b??n
                    d?????i ????? s???a th??ng tin.
                  </p>
                  {arrDdcnByGvNThisMonth.length > 0 &&
                    arrDdcnByGvNThisMonth.map((item) => {
                      const arrHocSinh = [];
                      for (let key in item) {
                        if (
                          key !== "_id" &&
                          key !== "shortName" &&
                          key !== "giaoVienId" &&
                          key !== "ngayDiemDanh"
                        ) {
                          arrHocSinh.push({ ...item[key], hocSinhId: key });
                        }
                      }
                      return (
                        <ItemNgayDdcn
                          key={item._id}
                          _id={item._id}
                          ngayDiemDanh={item.ngayDiemDanh}
                          arrHocSinh={arrHocSinh}
                          xoaNgayDiemDanh={xoaNgayDiemDanhHandler.bind(
                            0,
                            item._id
                          )}
                          chuyenGiaoDienSua={renderTrangSuaHocSinhHandler}
                        />
                      );
                    })}
                </ul>
              </div>
            </div>
          </div>
        )}
        {/* Giao di???n load trang s???a th??ng tin ??i???m danh ng??y c???a h???c sinh */}
        {giaoVienChonId && hocSinhSua && (
          <div className="bigArea">
            <SuaNgayDiemDanhCuaHocSinhPage
              data={hocSinhSua}
              arrGiaoVien={arrGiaoVien}
              tatTrangSua={huyRenderTrangSuaHsHandler}
            />
          </div>
        )}
        {!giaoVienChonId && (
          <div className="bigArea">
            <h3>Ch???n gi??o vi??n ????? thao t??c ti???p</h3>
          </div>
        )}
      </Layout28>{" "}
    </Card>
  );
};

export default ThongKeGiaoVienPage;
