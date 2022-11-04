import React from "react";

const HocSinhContext = React.createContext({
  arrHocSinhDuocChon: [],
  setArrHocSinhDuocChon: () => {},
});

export default HocSinhContext;
