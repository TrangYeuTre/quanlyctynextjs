import classes from "./ItemNgayDdcn.module.css";

const ItemNgayDdcn = (props) => {
  const xoaLichHandler = () => {};
  return (
    <li className={classes.container}>
      <div className={classes.dates}>Ngày</div>
      <div className={classes.students}>ds học sinh</div>
      <div
        className={`${classes.subBtn} ${classes.delBtn}`}
        onClick={xoaLichHandler}
      >
        <h3>Xóa</h3>
      </div>
    </li>
  );
};

export default ItemNgayDdcn;
