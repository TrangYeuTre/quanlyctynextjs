import classes from "./NotiBar.module.css";
import ReactDom from "react-dom";

const NotiBar = (props) => {
  //Cần thông tin sau
  const { status, message } = props;
  //Lấy style màu
  let finalStyle = classes.success;
  if (
    status === 401 ||
    status === 400 ||
    status === 422 ||
    status === 500 ||
    status === 403
  ) {
    finalStyle = classes.error;
  }
  if (typeof window === "object") {
    return ReactDom.createPortal(
      <section className={finalStyle}>{message}</section>,
      document.getElementById("overlay")
    );
  } else {
    return null;
  }
};

export default NotiBar;
