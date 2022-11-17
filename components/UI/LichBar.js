import classes from "./LichBar.module.css";
import { BsFillCalendarCheckFill } from "react-icons/bs";
import { FaChild } from "react-icons/fa";
import { convertThuLabelRaTen } from "../../helper/uti";
import { useEffect, useState } from "react";

const LichBar = (props) => {
  const { data, doXoaLich } = props;
  //Cb xóa
  const xoaLichHandler = (id) => {
    doXoaLich(id)
  };
  //Trả
  return (
    data && (
      <div className={classes.container}>
        {data.arrThu.length > 0 && (
          <div className={classes.dates}>
            <BsFillCalendarCheckFill
              size="1.6rem"
              style={{ color: "var(--mauMh1--)" }}
            />
            {data.arrThu.map((thu) => (
              <p key={thu.thu}>{convertThuLabelRaTen(thu.thu)}</p>
            ))}
          </div>
        )}
        {data.arrHocSinh.length > 0 && (
          <div className={classes.students}>
            <FaChild size="1.6rem" style={{ color: "var(--mauMh1--)" }} />
            {data.arrHocSinh.map((hs) => (
              <p key={hs.hocSinhId}>{hs.shortName}</p>
            ))}
          </div>
        )}
        <div className={classes.actions} onClick={xoaLichHandler.bind(0,data.lichId)}>
          <h3>Xóa</h3>
        </div>
      </div>
    )
  );
};

export default LichBar;
