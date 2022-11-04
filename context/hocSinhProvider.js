import HocSinhContext from "./hocSinhContext";
import { useState } from "react";

const HocSinhProvider = (props) => {
  //Giáo viên có dạng
  const [arrHocSinhDuocChon, setArrHocSinhDuocChon] = useState([]);

  //CB chọn giáo viên để active, lưu id giáo viên được chọn vào context thôi
  const setArrHocSinhDuocChonHandler = (arrHs) => {
    setArrHocSinhDuocChon(arrHs);
  };

  const valueContext = {
    arrHocSinhDuocChon: arrHocSinhDuocChon,
    setArrHocSinhDuocChon: setArrHocSinhDuocChonHandler,
  };
  return (
    <HocSinhContext.Provider value={valueContext}>
      {props.children}
    </HocSinhContext.Provider>
  );
};

export default HocSinhProvider;
