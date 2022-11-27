import Card from "../UI/Card";
import Layout28 from "../layout/layout-2-8";
import { Fragment, useState, useEffect, useContext } from "react";
import classes from "./HsPhuTrach.module.css";
import ActionBar from "../UI/ActionBar";
import { arrThu } from "../../data/static";
import { sortArtByLastShortName } from "../../helper/uti";
import NotiContext from "../../context/notiContext";
import { useRouter } from "next/router";

//Tạo một cái comp mini để render nội dung phần chọn lịch cho học trò
const ChonItemPage = (props) => {
  const { arrItems, getArrResult, type } = props;
  //State mảng trả lại
  const [arrResult, setArrResult] = useState([]);
  //Cb xử lý chọn
  const chonItemHandler = (id) => {
    //Clone lại mảng arrItems
    const arrItemsClone = [...arrItems];
    //Tìm kiếm trong mảng item cần đổi isSelected
    const indexItemMatched = arrItemsClone.findIndex((i) => i.id === id);
    if (indexItemMatched !== -1) {
      arrItemsClone[indexItemMatched].isSelected =
        !arrItemsClone[indexItemMatched].isSelected;
      setArrResult(arrItemsClone);
    }
  };
  //Cb chính xác nhận item chọn truyền lên props chính
  const chotItemsHandler = () => {
    getArrResult(arrResult);
  };
  //Side effect thiết lập mảng render
  useEffect(() => {
    setArrResult(arrItems);
  }, [arrItems]);
  //Tách lấy mảng học trò của giáo viên
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
  const notiCtx = useContext(NotiContext);
  // const router = useRouter();
  const { giaoVien, arrHocTroCaNhan, arrLichDayCaNhan } = props;
  //Xử lý lấy arrThu và arrHocSInh để chọn cho phần gán lịch
  const arrThuGot = arrThu();
  let arrHocTro = [];
  if (giaoVien && arrHocTroCaNhan && arrHocTroCaNhan.length > 0) {
    const arrPlus = arrHocTroCaNhan.map((hocsinh) => {
      return {
        id: hocsinh.hocSinhId,
        shortName: hocsinh.shortName,
        soPhutHocMotTiet: hocsinh.soPhutHocMotTiet,
        isSelected: false,
      };
    });
    arrHocTro = sortArtByLastShortName(arrPlus);
  }
  //State 2 mảng chứa
  const [arrHsDuocChon, setArrHsDuocChon] = useState([]);
  const [arrThuDuocChon, setArrThuDuocChon] = useState([]);
  //Cb lấy mảng thứ được chọn từ ChonItemPage ở trên
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
      setArrHsDuocChon(arrFilterReconvert);
    }
  };
  //Cb chốt thêm lịch cho học sinh, fetch cập nhật
  const themLichHocSinhHandler = async () => {
    //Tổng hợp lại obj data submit
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
    //Tiến hành fetch nào
    const response = await fetch("/api/giaovien/lichChoHocSinhCuaGiaoVien", {
      method: "POST",
      body: JSON.stringify(dataSubmit),
      headers: { "Content-Type": "application/json" },
    });
    const statusCode = response.status;
    const dataGot = await response.json();
    //Đẩy thông báo
    setTimeout(() => {
      notiCtx.clearNoti();
      setArrHsDuocChon([]);
      setArrThuDuocChon([]);
      // router.reload();
    }, process.env.DELAY_TIME_NOTI);
    window.scrollTo(0, 0);
    notiCtx.pushNoti({ status: statusCode, message: dataGot.thongbao });
  };
  //Cb hủy thêm lịch học sinh
  const huyThemLichHocSinhHandler = () => {};
  //Xử lý mảng nào sẽ được truyễn xuống render
  let arrThuRender = arrThuGot;
  if (arrThuDuocChon.length > 0) {
    arrThuDuocChon.forEach((thu) => {
      const indexMatched = arrThuRender.findIndex((i) => i.id === thu.id);
      arrThuRender[indexMatched].isSelected = true;
    });
  }
  let arrHocTroRender = arrHocTro;
  if (arrHsDuocChon.length > 0) {
    arrHsDuocChon.forEach((hs) => {
      const indexMatched = arrHocTroRender.findIndex(
        (i) => i.hocSinhId === hs.hocSinhId
      );
      if (indexMatched !== -1) {
        arrHocTroRender[indexMatched].isSelected = true;
      }
    });
  }
  //Cuối cùng phải convert lài hocSinhId thành id để truyền xuống com ChonItemPage
  const arrHocTroConvertRender = arrHocTroRender.map((i) => {
    return {
      id: i.hocSinhId ? i.hocSinhId : i.id,
      shortName: i.shortName,
      isSelected: i.isSelected,
      soPhutHocMotTiet: i.soPhutHocMotTiet,
    };
  });
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
                  arrItems={arrThuGot}
                  getArrResult={getThuDuocChon}
                  type="thu"
                />
                <ChonItemPage
                  arrItems={arrHocTroConvertRender}
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
