import React from "react";

const GiaoVienContext = React.createContext({
  giaoVienSelectedId: null,
  hocSinhPhuTrach: {},
  setHocSinhPhuTrach: () => {},
  chonGiaoVien: () => {},
});

export default GiaoVienContext;
