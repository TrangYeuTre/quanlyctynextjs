import React from "react";

const NotiContext = React.createContext({
  noti: {},
  pushNoti: () => {},
  clearNoti: () => {},
});

export default NotiContext;
