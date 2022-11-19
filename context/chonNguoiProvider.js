import ChonNguoiContext from "./chonNguoiContext";

import { useState } from "react";

const ChonNguoiProvider = (props) => {
  //State mảng giáo viên và học sinh
  const [arrGiaoVien, setArrGiaoVien] = useState([]);
  //State mảng giáo viên và học sinh
  const [arrHocSinh, setArrHocSinh] = useState([]);
  //Cb
  const chonGiaoVienHandler = (arr) => {
    setArrGiaoVien(arr);
  };
  const chonHocSinhHandler = (arr) => {
    setArrHocSinh(arr);
  };

  //Obj contenxt
  const valueObj = {
    arrGiaoVien: arrGiaoVien,
    arrHocSinh: arrHocSinh,
    chonGiaoVien: chonGiaoVienHandler,
    chonHocSinh: chonHocSinhHandler,
  };

  return (
    <ChonNguoiContext.Provider value={valueObj}>
      {props.children}
    </ChonNguoiContext.Provider>
  );
};

export default ChonNguoiProvider;
