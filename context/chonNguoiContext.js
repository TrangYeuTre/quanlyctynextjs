import React from "react";

const ChonNguoiContext = React.createContext({
  arrGiaoVien: [],
  arrHocSinh: [],
  nguoiDuocChonId: null,
  chonGiaoVien: () => {},
  chonHocSinh: () => {},
  chonMotNguoi: () => {},
});

export default ChonNguoiContext;
