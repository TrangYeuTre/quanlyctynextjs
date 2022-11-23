import classes from "./ChonNguoi.module.css";
import { sortArtByLastShortName } from "../../helper/uti";
import { useState, useEffect, useContext } from "react";
import ChonNguoiContext from "../../context/chonNguoiContext";

const ChonNguoi = (props) => {
  const chonNguoiCtx = useContext(ChonNguoiContext);
  //Đợi mảng giáo viên / học sinh truyền xuống
  //Cấu trúc mảng chỉ cần id , shortName và isSelected
  const { arrPeople, type } = props;

  //State mảng render
  const [arrPeopleRender, setArrPeopleRender] = useState([]);
  //Cb chọn người
  const chonNguoiHandler = (id) => {
    //Clone lại mảng người render hiện tại
    const curArrPpRender = [...arrPeopleRender];
    //Tìm và đánh isSelected true
    const indexMatched = curArrPpRender.findIndex((i) => i.id === id);
    //Đánh isSelected
    if (indexMatched !== -1) {
      curArrPpRender[indexMatched].isSelected =
        !curArrPpRender[indexMatched].isSelected;
    }
    //Set lại mảng render
    setArrPeopleRender(sortArtByLastShortName(curArrPpRender));
    //Lưu mảng render này lên ctx
    if (type === "hocsinh") {
      chonNguoiCtx.chonHocSinh(arrPeopleRender);
    }
    if (type === "giaovien") {
      chonNguoiCtx.chonGiaoVien(arrPeopleRender);
    }
  };
  //Side effect load mảng người để render
  useEffect(() => {
    setArrPeopleRender(sortArtByLastShortName(arrPeople));
  }, [arrPeople, chonNguoiCtx, type]);
  //Trả
  if (arrPeople.length > 0) {
    return (
      <div className={classes.container}>
        <ul className={classes.tags}>
          {arrPeopleRender.map((person) => {
            let finalStyle = classes.tag;
            if (person.isSelected) {
              finalStyle = `${classes.tag} ${classes.tagActive}`;
            }
            return (
              <li
                className={finalStyle}
                key={person.id}
                onClick={chonNguoiHandler.bind(0, person.id)}
              >
                {person.shortName}
              </li>
            );
          })}
        </ul>
      </div>
    );
  } else {
    return (
      <div className={classes.container}>
        <h3>Danh sách trống</h3>
      </div>
    );
  }
};

export default ChonNguoi;
