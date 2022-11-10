import Card from "../UI/Card";
import Layout28 from "../layout/layout-2-8";
import { Fragment, useState, useEffect } from "react";
import classes from "./HsPhuTrach.module.css";
import ActionBar from "../UI/ActionBar";
import { arrThu } from "../../data/static";
import { sortArtByLastShortName } from "../../helper/uti";

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
    console.log(arrResult);
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
  const { giaoVien } = props;
  //Xử lý lấy arrThu và arrHocSInh để chọn cho phần gán lịch
  const arrThuGot = arrThu();
  let arrHocTro = [];
  if (giaoVien && giaoVien.hocTroCaNhan && giaoVien.hocTroCaNhan.length > 0) {
    const arrPlus = giaoVien.hocTroCaNhan.map((gv) => {
      return {
        ...gv,
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
      setArrHsDuocChon(arrFilter);
    }
  };
  //Cb chốt thêm lịch cho học sinh, fetch cập nhật
  const themLichHocSinhHandler = async () => {};
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
      const indexMatched = arrHocTroRender.findIndex((i) => i.id === hs.id);
      arrHocTroRender[indexMatched].isSelected = true;
    });
  }
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
                  arrItems={arrHocTro}
                  getArrResult={getHocSinhDuocChon}
                  type="hocsinh"
                />
                <ActionBar
                  action1="Chốt"
                  action2="Té"
                  description="Ok thì Chốt, hủy thì Té"
                  doAction1={themLichHocSinhHandler}
                  doAction2={huyThemLichHocSinhHandler}
                />
              </div>
            </section>
          </Fragment>
        )}
      </Layout28>
    </Card>
  );
};

export default GanLichChoHsPage;
