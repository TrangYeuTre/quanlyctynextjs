import classes from "./PickGiaoVienBar.module.css";
import { sortArtByLastShortName } from "../../helper/uti";
import { useContext, useEffect, useState } from "react";
import GiaoVienContext from "../../context/giaoVienContext";
import { layArrLopNhomRender } from "../../components/ddn/ddn_helper";

const PickLopNhomBar = (props) => {
  //Như vậy cần dùng useContext để tương tác lưu giáo viên được pick từ próp truyền xuống
  const { arrLopNhom, layLopNhomId, disAll } = props;
  //State lấy lớp nhóm id được chọn
  const [lopNhomIdChon, setLnIdChon] = useState(null);
  //Callback xử lý chọn giáo viên
  const pickLopNhomHandler = (id) => {
    setLnIdChon(id);
    //Truyền id lên cop trên xài
    layLopNhomId(id);
  };
  //Từ mảng lớp nhóm và id được chọn để lọc rả mảng render
  const arrLopNhomRender = layArrLopNhomRender(arrLopNhom, lopNhomIdChon);

  //Trả về thôi
  return (
    <div className={classes.container}>
      <h3>Chọn lớp nhóm</h3>
      {arrLopNhomRender.length > 0 &&
        arrLopNhomRender.map((lopNhom) => {
          //Xử lý css lopNhom đã được chọn
          let finalStyle = classes.tag;
          if (disAll) {
            finalStyle = `${classes.tag} ${classes.tagDis}`;
          }

          if (lopNhom.isSelected) {
            finalStyle = `${classes.tag} ${classes.tagSelected}`;
          }
          return (
            <div
              key={lopNhom.id}
              className={finalStyle}
              onClick={!disAll ? pickLopNhomHandler.bind(0, lopNhom.id) : null}
            >
              <p>{lopNhom.tenLopNhom}</p>
            </div>
          );
        })}
    </div>
  );
};

export default PickLopNhomBar;
