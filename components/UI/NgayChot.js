import classes from "./NgayChot.module.css";
import { Fragment } from "react";
import { layTenThuTuNgay } from "../../helper/uti";

const NgayChot = (props) => {
  const { ngayDiemDanh, title } = props;
  return (
    <Fragment>
      <h4>{title ? title : "Ngày đã chốt điểm danh"}</h4>
      <p className={classes.warning}>
        Thứ: <span>{layTenThuTuNgay(ngayDiemDanh)}</span> --- Ngày:{" "}
        <span>
          {new Date(ngayDiemDanh).toLocaleString("en-GB", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
          })}
        </span>
      </p>
    </Fragment>
  );
};

export default NgayChot;
