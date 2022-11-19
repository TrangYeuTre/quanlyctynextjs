import React from "react";

const ChonNguoiContext = React.createContext({
  arrGiaoVien: [],
  arrHocSinh: [],
  chonGiaoVien: () => {},
  chonHocSinh: () => {},
});

export default ChonNguoiContext;
