import classes from "./LichBar.module.css";
import { BsFillCalendarCheckFill } from "react-icons/bs";
import { FaChild, FaChalkboardTeacher } from "react-icons/fa";
import { convertThuLabelRaTen } from "../../helper/uti";
import { useEffect, useState } from "react";
import { viewSplitMoney } from "../../helper/uti";

const LopNhomBar = (props) => {
  const { data, doXoaLopNhom, doSuaLopNhom, id } = props;
  //Cb xóa
  const xoaLopNhomHandler = (id) => {
    doXoaLopNhom(id);
  };
  //Cb sửa
  const suaLopNhomHandler = (id) => {
    doSuaLopNhom(id);
  };
  //Trả
  return (
    data && (
      <div className={classes.container} id={id}>
        <div className={classes.dates}>
          <h3>{data.tenLopNhom}</h3>
        </div>
        {/* Load danh sách giáo viên */}
        <div className={classes.students}>
          <FaChalkboardTeacher
            size="1.6rem"
            style={{ color: "var(--mauMh1--)" }}
          />
          {data.giaoVienLopNhom.length > 0 &&
            data.giaoVienLopNhom.map((giaovien) => (
              <p key={giaovien.giaoVienId}>{`${
                giaovien.shortName
              } (${viewSplitMoney(giaovien.luongNhom)})`}</p>
            ))}
        </div>
        {/* Load danh sách học sinh lớp nhóm */}
        <div className={classes.students}>
          <FaChild size="1.6rem" style={{ color: "var(--mauMh1--)" }} />
          {data.hocSinhLopNhom.length > 0 &&
            data.hocSinhLopNhom.map((hocsinh) => (
              <p key={hocsinh.hocSinhId}>{hocsinh.shortName}</p>
            ))}
        </div>
        {/* Khu actions */}
        <div className={classes.actionsContainer}>
          <div
            className={`${classes.subBtn} ${classes.editBtn}`}
            onClick={suaLopNhomHandler.bind(0, data.id)}
          >
            <h3>Sửa</h3>
          </div>

          <div
            className={`${classes.subBtn} ${classes.delBtn}`}
            onClick={xoaLopNhomHandler.bind(0, data.id)}
          >
            <h3>Xóa</h3>
          </div>
        </div>
      </div>
    )
  );
};

export default LopNhomBar;
