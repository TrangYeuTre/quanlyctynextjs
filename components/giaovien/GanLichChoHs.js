import Card from "../UI/Card";
import Layout28 from "../layout/layout-2-8";
import { Fragment, useState, useEffect, useContext } from "react";
import classes from "./HsPhuTrach.module.css";
import ActionBar from "../UI/ActionBar";
import { arrThu } from "../../data/static";
import { sortArtByLastShortName } from "../../helper/uti";
import NotiContext from "../../context/notiContext";
import { useRouter } from "next/router";
import GiaoVien from "../../classes/GiaoVien";
import DataGiaoVien from "../../classes/DataGiaoVien";

//Comp mini
const ChonItemPage = (props) => {
  //VARIABLES
  const { arrItems, getArrResult, type } = props;
  const [arrResult, setArrResult] = useState([]);
  //FUNCTIONS
  const chonItemHandler = (id) => {
    const arrItemsClone = [...arrItems];
    const indexItemMatched = timItemTrongMang(arrItemsClone, id);
    daoGiaTriIsSelected(arrItemsClone, indexItemMatched);
    setArrResult(arrItemsClone);
  };
  const timItemTrongMang = (arrItemsClone, id) => {
    const indexItemMatched = arrItemsClone.findIndex((i) => i.id === id);
    return indexItemMatched;
  };
  const daoGiaTriIsSelected = (arrItemsClone, indexItemMatched) => {
    if (indexItemMatched !== -1) {
      arrItemsClone[indexItemMatched].isSelected =
        !arrItemsClone[indexItemMatched].isSelected;
    }
  };
  const chotItemsHandler = () => {
    getArrResult(arrResult);
  };
  //SIDE EFFECT
  useEffect(() => {
    setArrResult(arrItems);
  }, [arrItems]);
  return (
    <div className={classes.lichContainer}>
      <h3>{type === "thu" ? "Chọn thứ" : "Chọn học sinh cho thứ đã chọn"}</h3>
      <ul className={classes.tags}>
        {arrResult.length > 0 &&
          arrResult.map((item) => {
            let finalStyle = classes.tag;
            if (item.isSelected) {
              finalStyle = `${classes.tag} ${classes.tagActive}`;
            }
            return (
              <li
                className={finalStyle}
                key={item.id}
                onClick={chonItemHandler.bind(0, item.id)}
              >
                {type === "thu" ? item.name : item.shortName}
              </li>
            );
          })}
      </ul>
      <ActionBar
        description={
          type === "thu" ? "Chốt thứ đã chọn" : "Chốt học sinh đã chọn"
        }
        action1={type === "thu" ? "Chốt thứ" : "Chốt học sinh"}
        doAction1={chotItemsHandler}
      />
    </div>
  );
};

const GanLichChoHsPage = (props) => {
  //VARIABLES
  const router = useRouter();
  const notiCtx = useContext(NotiContext);
  const { arrHocTroCaNhan } = props;
  const giaoVien = DataGiaoVien.giaoVienChonData;
  const arrThuGot = arrThu();
  let arrHocTro = [];
  const [arrHsDuocChon, setArrHsDuocChon] = useState([]);
  const [arrThuDuocChon, setArrThuDuocChon] = useState([]);

  //CALLBACKS
  //Cb lấy mảng thứ và mảng học sinh được chọn từ comp phụ
  const getThuDuocChon = (arr) => {
    if (arr.length > 0) {
      const arrFilter = arr.filter((i) => i.isSelected);
      setArrThuDuocChon(arrFilter);
    }
  };
  const getHocSinhDuocChon = (arr) => {
    if (arr.length > 0) {
      const arrFilter = arr.filter((i) => i.isSelected);
      const arrFilterReconvert = arrFilter.map((i) => {
        return {
          hocSinhId: i.id,
          shortName: i.shortName,
          soPhutHocMotTiet: i.soPhutHocMotTiet,
          isSelected: i.isSelected,
        };
      });
      sortArtByLastShortName(arrFilterReconvert);
      setArrHsDuocChon(arrFilterReconvert);
    }
  };

  //FUNCTIONS
  //Xử lý lấy arrThu và arrHocSInh để chọn cho phần gán lịch
  const isValidGiaoVienData = () => {
    return giaoVien && arrHocTroCaNhan && arrHocTroCaNhan.length > 0;
  };
  const layArrHocTroDeChon = () => {
    const arrHandler = arrHocTroCaNhan.map((hocsinh) => {
      return {
        id: hocsinh.hocSinhId,
        shortName: hocsinh.shortName,
        soPhutHocMotTiet: hocsinh.soPhutHocMotTiet,
        isSelected: false,
      };
    });
    sortArtByLastShortName(arrHandler);
    return arrHandler;
  };
  if (isValidGiaoVienData()) {
    arrHocTro = layArrHocTroDeChon();
  }
  //fetch thêm lịch cho học sinh
  const themLichHocSinhHandler = async () => {
    const dataSubmit = tongHopDataSubmit();
    const { statusCode, dataGot } = await GiaoVien.updateLichGiaoVien(
      dataSubmit
    );
    dayThongBao(statusCode, dataGot);
  };
  const tongHopDataSubmit = () => {
    const dataSubmit = {
      giaoVienId: giaoVien.id,
      arrThu: arrThuDuocChon.map((i) => {
        return { thu: i.id };
      }),
      arrHocSinh: arrHsDuocChon.map((i) => {
        return {
          hocSinhId: i.hocSinhId,
          shortName: i.shortName,
          soPhutHocMotTiet: i.soPhutHocMotTiet,
        };
      }),
    };
    return dataSubmit;
  };
  const dayThongBao = (statusCode, dataGot) => {
    setTimeout(() => {
      notiCtx.clearNoti();
      clearArrHocSinhChon();
      clearArrThuChon();
    }, process.env.DELAY_TIME_NOTI);
    window.scrollTo(0, 0);
    notiCtx.pushNoti({ status: statusCode, message: dataGot.thongbao });
  };
  const clearArrHocSinhChon = () => {
    setArrHsDuocChon([]);
  };
  const clearArrThuChon = () => {
    setArrThuDuocChon([]);
  };
  const huyThemLichHocSinhHandler = () => {
    router.replace("/giao-vien/lich-giao-vien");
  };

  //Xử lý mảng thứ cuối để truyền xuống render
  const layMangThuTruyenXuongRender = () => {
    //Xử lý mảng nào sẽ được truyễn xuống render
    let arrThuRender = arrThuGot;
    if (arrThuDuocChon.length > 0) {
      arrThuDuocChon.forEach((thu) => {
        timIndexThuTheoIdVaDanhIsSelectedTrue(arrThuRender, thu);
      });
    }
    return arrThuRender;
  };
  const timIndexThuTheoIdVaDanhIsSelectedTrue = (arrThuRender, thu) => {
    const indexMatched = arrThuRender.findIndex((i) => i.id === thu.id);
    if (indexMatched !== -1) {
      arrThuRender[indexMatched].isSelected = true;
    }
  };
  const arrThuRender = layMangThuTruyenXuongRender();

  const layMangHocSinhTruyenXuongRender = () => {
    let arrHocTroRender = arrHocTro;
    if (arrHsDuocChon.length > 0) {
      arrHsDuocChon.forEach((hs) => {
        timIndexHocSinhTheoIdVaDanhIsSelectedTrue(arrHocTroRender, hs);
      });
    }
    //Phải làm cái này vì trượg hop dâta truyền ngược lại từ comp phụ id sẽ có props hocSInhid chứ không phải id
    const arrHocTroConvertRender = arrHocTroRender.map((i) => {
      return {
        id: i.hocSinhId ? i.hocSinhId : i.id,
        shortName: i.shortName,
        isSelected: i.isSelected,
        soPhutHocMotTiet: +i.soPhutHocMotTiet,
      };
    });
    return arrHocTroConvertRender;
  };
  const timIndexHocSinhTheoIdVaDanhIsSelectedTrue = (arrHocTroRender, hs) => {
    const indexMatched = arrHocTroRender.findIndex(
      (i) => i.hocSinhId === hs.hocSinhId
    );
    if (indexMatched !== -1) {
      arrHocTroRender[indexMatched].isSelected = true;
    }
  };
  const arrHocTroRender = layMangHocSinhTruyenXuongRender();


  return (
    <Card>
      <Layout28>
        {/* Chế độ chọn lịch cho học trò  */}
        {giaoVien && (
          <Fragment>
            <section className={classes.smallArea}>
              <h3 style={{ paddingTop: "1rem" }}>{giaoVien.shortName}</h3>
            </section>{" "}
            <section className={classes.bigArea}>
              <div className={classes.lichArea}>
                <ChonItemPage
                  arrItems={arrThuRender}
                  getArrResult={getThuDuocChon}
                  type="thu"
                />
                <ChonItemPage
                  arrItems={arrHocTroRender}
                  getArrResult={getHocSinhDuocChon}
                  type="hocsinh"
                />
                {arrThuDuocChon.length > 0 && arrHsDuocChon.length > 0 && (
                  <div className={classes.lichContainer}>
                    <p>Thứ đã chọn: </p>
                    <ul className={classes.tags}>
                      {arrThuDuocChon.map((item) => (
                        <li
                          className={`${classes.tag} ${classes.tagActive}`}
                          key={item.id}
                        >
                          {item.name}
                        </li>
                      ))}
                    </ul>
                    <p>Học sinh đã chọn cho thứ: </p>
                    <ul className={classes.tags}>
                      {arrHsDuocChon.map((item) => (
                        <li
                          className={`${classes.tag} ${classes.tagActive}`}
                          key={item.hocSinhId}
                        >
                          {item.shortName}
                        </li>
                      ))}
                    </ul>
                    <ActionBar
                      action1="Chốt lịch"
                      action2="Xem lịch"
                      description="'Chốt lịch' được nhiều lần, 'Xem lịch' để đến trang xem"
                      doAction1={themLichHocSinhHandler}
                      doAction2={huyThemLichHocSinhHandler}
                    />{" "}
                  </div>
                )}
              </div>
            </section>
          </Fragment>
        )}
      </Layout28>
    </Card>
  );
};

export default GanLichChoHsPage;
