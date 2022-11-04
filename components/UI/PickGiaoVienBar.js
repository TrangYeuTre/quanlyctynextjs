import classes from "./PickGiaoVienBar.module.css";
import { sortArtByLastShortName } from "../../helper/uti";
import { useContext, useEffect, useState } from "react";
import GiaoVienContext from "../../context/giaoVienContext";

const PickGiaoVienBar = (props) => {
  const giaoVienCtx = useContext(GiaoVienContext);
  const giaoVienDuocChonId = giaoVienCtx.giaoVienSelectedId;
  //Cần mảng giáo viên cấu trúc như sau : {idGiaoVien,shortName, isSelected }
  //Như vậy cần dùng useContext để tương tác lưu giáo viên được pick từ próp truyền xuống
  const { arrGiaoVien } = props;
  //State quyết định mảng giáo viên render
  const [arrGiaoVienRender, setArrGiaoVienRender] = useState([]);
  //Callback xử lý chọn giáo viên
  const pickGiaoVienHandler = (id) => {
    //Push id lưu lên ctx
    giaoVienCtx.chonGiaoVien(id);
  };
  //Xử lý side effect xem giáo viên đang được chọn
  useEffect(() => {
    //Đầu tiên là clone lại cái mảng giáo viên từ props để xài
    const arrGvClone = [...arrGiaoVien];
    //Reset lại isSelected mõi lần chạy mới
    arrGvClone.forEach((item) => (item.isSelected = false));
    //Xử lý gv được selecte hay không
    if (giaoVienDuocChonId) {
      console.log("r1");
      const indexGvMatched = arrGvClone.findIndex(
        (gv) => gv.id.toString() === giaoVienDuocChonId.toString()
      );
      if (indexGvMatched !== -1) {
        arrGvClone[indexGvMatched].isSelected = true;
      }
      //Sort lại arr
      const arrSort = sortArtByLastShortName(arrGvClone);
      setArrGiaoVienRender(arrSort);
    } else {
      const arrSort = sortArtByLastShortName(arrGvClone);
      setArrGiaoVienRender(arrSort);
    }
  }, [arrGiaoVien, giaoVienDuocChonId]);
  //Trả về thôi
  return (
    <div className={classes.container}>
      <h3>Chọn giáo viên</h3>
      {arrGiaoVien.length > 0 &&
        arrGiaoVienRender.map((gv) => {
          //Xử lý css gv đã được chọn
          let finalStyle = classes.tag;
          if (gv.isSelected) {
            finalStyle = `${classes.tag} ${classes.tagSelected}`;
          }
          return (
            <div
              key={gv.id}
              className={finalStyle}
              onClick={pickGiaoVienHandler.bind(0, gv.id)}
            >
              {gv.shortName}
            </div>
          );
        })}
    </div>
  );
};

export default PickGiaoVienBar;
