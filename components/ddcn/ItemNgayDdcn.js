import classes from "./ItemNgayDdcn.module.css";

const ItemNgayDdcn = (props) => {
  //VARIABLES
  const { _id, ngayDiemDanh, arrHocSinh, xoaNgayDiemDanh, chuyenGiaoDienSua } =
    props;

  //FUNCTIONS
  const xoaLichHandler = (id) => {
    xoaNgayDiemDanh(id);
  };
  const suaNgayHocCuaHsHandler = (data) => {
    chuyenGiaoDienSua(data);
  };
  const xuLyStyleChoNgayDiemDanh = (hocsinh) => {
    let finalStyle = classes.hsItem;
    if (hocsinh.type === "dayChinh") {
      finalStyle = `${classes.hsItem} ${classes.dayChinh}`;
    }
    if (hocsinh.type === "dayThe") {
      finalStyle = `${classes.hsItem} ${classes.dayThe}`;
    }
    if (hocsinh.type === "dayTangCuong") {
      finalStyle = `${classes.hsItem} ${classes.dayTangCuong}`;
    }
    if (hocsinh.type === "nghi dayBu") {
      finalStyle = `${classes.hsItem} ${classes.dayBu}`;
    }
    if (hocsinh.type === "nghi") {
      finalStyle = `${classes.hsItem} ${classes.nghi}`;
    }
    return finalStyle;
  };

  return (
    <li className={classes.container} id={_id}>
      <div className={classes.head}>
        <div className={`${classes.headItem} ${classes.date}`}>
          {ngayDiemDanh}
        </div>
        <div
          className={`${classes.headItem} ${classes.subBtn} ${classes.delBtn}`}
          onClick={xoaLichHandler.bind(0, _id)}
        >
          <h3>Xóa</h3>
        </div>
      </div>
      <div className={classes.students}>
        {arrHocSinh.map((hocsinh) => {
          const finalStyle = xuLyStyleChoNgayDiemDanh(hocsinh);
          return (
            <div
              key={hocsinh.hocSinhId}
              className={finalStyle}
              onClick={suaNgayHocCuaHsHandler.bind(0, {
                ...hocsinh,
                ngayDiemDanhId: _id,
                ngayDiemDanh: ngayDiemDanh,
              })}
            >
              {hocsinh.shortName}{" "}
              <span>{`(${
                hocsinh.soPhutHocMotTiet ? hocsinh.soPhutHocMotTiet : 0
              })`}</span>
            </div>
          );
        })}
      </div>
    </li>
  );
};

export default ItemNgayDdcn;
