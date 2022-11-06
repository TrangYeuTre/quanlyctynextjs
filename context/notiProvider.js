import NotiContext from "./notiContext";
import { useState } from "react";

const NotiProvider = (props) => {
  const [noti, setNoti] = useState({ status: null, message: null });
  const pushNotiHandler = (data) => {
    setNoti(data);
  };
  const clearNotiHandler = () => {
    setNoti({ status: null, message: null });
  };
  const valueContext = {
    noti: noti,
    pushNoti: pushNotiHandler,
    clearNoti: clearNotiHandler,
  };
  return (
    <NotiContext.Provider value={valueContext}>
      {props.children}
    </NotiContext.Provider>
  );
};

export default NotiProvider;
