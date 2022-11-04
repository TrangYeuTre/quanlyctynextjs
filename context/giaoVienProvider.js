import GiaoVienContext from "./giaoVienContext";
import { useState } from "react";

const GiaoVienProvider = (props) => {
  //Giáo viên được chọn
  const [giaoVienSelectedId, setGiaoVienSelectedId] = useState(null);

  //Data học sinh phu trach được chọn cho giáo viên
  const [hocSinhPhuTrach, setHocSinhPhuTrach] = useState({
    giaoVienId: null,
    arrHocSinhPhuTrach: [],
  });

  //CB chọn giáo viên để active, lưu id giáo viên được chọn vào context thôi
  const chonGiaoVienHandler = (id) => {
    setGiaoVienSelectedId(id);
  };
  //CB set học sinh phụ trách cho giáo viên
  const setHocSinhPhuTrachHandler = (data) => {
    setHocSinhPhuTrach(data);
  };

  const valueContext = {
    giaoVienSelectedId: giaoVienSelectedId,
    hocSinhPhuTrach: hocSinhPhuTrach,
    chonGiaoVien: chonGiaoVienHandler,
    setHocSinhPhuTrach: setHocSinhPhuTrachHandler,
  };
  return (
    <GiaoVienContext.Provider value={valueContext}>
      {props.children}
    </GiaoVienContext.Provider>
  );
};

export default GiaoVienProvider;
