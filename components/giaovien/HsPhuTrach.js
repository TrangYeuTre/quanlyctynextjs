import classes from "./HsPhuTrach.module.css";
import Layout28 from "../layout/layout-2-8";
import Card from "../UI/Card";
import PickGiaoVienBar from "../UI/PickGiaoVienBar";
import ListPerson from "../UI/ListPerson";
import { useState, useContext, useEffect, Fragment } from "react";
import GiaoVienContext from "../../context/giaoVienContext";
import NotiContext from "../../context/notiContext";
import { useRouter } from "next/router";
import GiaoVien from "../../classes/GiaoVien";
import DataHocSinh from "../../classes/DataHocSinh";
import DataGiaoVien from "../../classes/DataGiaoVien";

const HocSinhPhuTrachPage = (props) => {
  //VARIALBLES
  const router = useRouter();
  const { giaoVien } = props;
  const arrHocSinhCaNhan = DataHocSinh.arrHocSinhCaNhan;
  const arrGiaoVien = DataGiaoVien.arrGiaoVien;
  const notiCtx = useContext(NotiContext);
  const giaoVienCtx = useContext(GiaoVienContext);
  const giaoVienDuocChonId = giaoVienCtx.giaoVienSelectedId;
  const [arrHocTroDefault, setArrHocTroDefault] = useState([]);

  //FUNCTIONS
  //Cập nhật mảng hs phụ trách
  const updateArrHocSinhPhuTrachHandler = async (arr) => {
    const arrHocSinhDuocChon = tongHopArrHocSinhDuocChon(arr);
    const { statusCode, dataGot } = await GiaoVien.updateHocSinhPhuTrach(
      giaoVienDuocChonId,
      arrHocSinhDuocChon
    );
    dayThongBao(statusCode, dataGot);
  };
  const tongHopArrHocSinhDuocChon = (arr) => {
    const arrFilterHsDuocChon = arr.filter((hs) => hs.isSelected);
    const arrHocSinhDuocChon = arrFilterHsDuocChon.map((item) => {
      return {
        hocSinhId: item.id.toString(),
        shortName: item.shortName,
        soPhutHocMotTiet: item.soPhutHocMotTiet,
      };
    });
    return arrHocSinhDuocChon;
  };
  const dayThongBao = (statusCode, dataGot) => {
    setTimeout(() => {
      notiCtx.clearNoti();
      if (statusCode === 200 || statusCode === 201) {
        denTrangChonThuVaHocSinhChoLich(giaoVienDuocChonId);
      }
    }, process.env.DELAY_TIME_NOTI);
    window.scrollTo(0, 0);
    notiCtx.pushNoti({ status: statusCode, message: dataGot.thongbao });
  };
  const denTrangChonThuVaHocSinhChoLich = (giaoVienDuocChonId) => {
    router.push(`/giao-vien/hs-phu-trach/${giaoVienDuocChonId}`);
  };

  //SIDE EFFECT
  useEffect(() => {
    const isGiaoVienDuocChonId = () => {
      if (!giaoVienDuocChonId) {
        setArrHocTroDefault([]);
        return;
      }
    };
    isGiaoVienDuocChonId();
    const giaoVienMatched =
      DataGiaoVien.timKiemGiaoVienTheoId(giaoVienDuocChonId);
    const isGiaoVienDataMatched = () => {
      if (!giaoVienMatched) {
        setArrHocTroDefault([]);
        return;
      }
    };
    isGiaoVienDataMatched();
    const chuyenArrHocTroThanhMangHocSinhMacDinh = (giaoVienMatched) => {
      if (!giaoVienMatched) {
        return;
      }
      const arrConvert = giaoVienMatched.hocTroCaNhan.map((i) => {
        return { id: i.hocSinhId };
      });
      setArrHocTroDefault(arrConvert);
    };
    chuyenArrHocTroThanhMangHocSinhMacDinh(giaoVienMatched);
  }, [giaoVienDuocChonId]);

  return (
    <Card>
      <Layout28>
        {/* Chế độ chọn giáo viên và chọn học trò cho giáo viên */}
        {!giaoVien && (
          <Fragment>
            {" "}
            <section className={classes.smallArea}>
              <PickGiaoVienBar arrGiaoVien={arrGiaoVien} />
            </section>
            <section className={classes.bigArea}>
              {!giaoVienDuocChonId && <h3>Chọn giáo viên để thao tác tiếp.</h3>}
              {/* Vùng chọn học sinh cho giáo viên */}
              {giaoVienDuocChonId && (
                <div className={classes.control}>
                  <h3>Chọn học sinh cá nhân</h3>
                  <ListPerson
                    arrPeopleSelected={arrHocTroDefault}
                    arrPeople={arrHocSinhCaNhan}
                    getArrResult={updateArrHocSinhPhuTrachHandler}
                    doSubAction={denTrangChonThuVaHocSinhChoLich.bind(
                      0,
                      giaoVienDuocChonId
                    )}
                    hintAction="Không đổi thì Té, có thì Chốt"
                  />
                </div>
              )}
            </section>
          </Fragment>
        )}
      </Layout28>
    </Card>
  );
};

export default HocSinhPhuTrachPage;
