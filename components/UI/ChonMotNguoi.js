import classes from "./ChonNguoi.module.css";
import { sortArtByLastShortName } from "../../helper/uti";
import { useState, useEffect, useContext } from "react";
import ChonNguoiContext from "../../context/chonNguoiContext";

const ChonMotNguoi = (props) => {
  const chonNguoiCtx = useContext(ChonNguoiContext);
  const nguoiDuocChonId = chonNguoiCtx.nguoiDuocChonId;
  //Cấu trúc mảng chỉ cần id , shortName và isSelected
  const { arrPeople } = props;

  //State mảng render
  const [arrPeopleRender, setArrPeopleRender] = useState([]);
  //Cb chọn người
  const chonNguoiHandler = (id) => {
    chonNguoiCtx.chonMotNguoi(id);
  };
  //Side effect load mảng người để render
  useEffect(() => {
    //Clone lại arr truyrn xuống
    const arrClone = [...arrPeople];
    //Map lại mảng chỉ cần id, shortName và isSelected
    let arrConvert = arrClone.map((person) => {
      return {
        id: person.id,
        shortName: person.shortName,
        isSelected: false,
      };
    });
    //Chỉ đánh true người được chọn theo ctx lấy về
    const indexMatched = arrConvert.findIndex(
      (person) => person.id === nguoiDuocChonId
    );
    if (indexMatched !== -1) {
      arrConvert[indexMatched].isSelected = true;
    }
    setArrPeopleRender(sortArtByLastShortName(arrConvert));
  }, [arrPeople, nguoiDuocChonId]);
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
        <p style={{ padding: "1rem" }}>Danh sách trống</p>
      </div>
    );
  }
};

export default ChonMotNguoi;
