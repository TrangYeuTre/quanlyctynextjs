import ChonNguoiContext from "./chonNguoiContext";

import { useState } from "react";

const ChonNguoiProvider = (props) => {
  //State mảng giáo viên và học sinh
  const [arrGiaoVien, setArrGiaoVien] = useState([]);
  //State mảng giáo viên và học sinh
  const [arrHocSinh, setArrHocSinh] = useState([]);
  //State lưu id của một người được chọn
  const [nguoiDuocChonId, setNguoiDuocChon] = useState(null);
  //Cb
  const chonGiaoVienHandler = (arr) => {
    setArrGiaoVien(arr);
  };
  const chonHocSinhHandler = (arr) => {
    setArrHocSinh(arr);
  };
  const chonMotNguoiHandler = (id) => {
    if (nguoiDuocChonId === id) {
      setNguoiDuocChon(null);
    } else {
      setNguoiDuocChon(id);
    }
  };

  //Obj contenxt
  const valueObj = {
    arrGiaoVien: arrGiaoVien,
    arrHocSinh: arrHocSinh,
    nguoiDuocChonId: nguoiDuocChonId,
    chonGiaoVien: chonGiaoVienHandler,
    chonHocSinh: chonHocSinhHandler,
    chonMotNguoi: chonMotNguoiHandler,
  };

  return (
    <ChonNguoiContext.Provider value={valueObj}>
      {props.children}
    </ChonNguoiContext.Provider>
  );
};

export default ChonNguoiProvider;
