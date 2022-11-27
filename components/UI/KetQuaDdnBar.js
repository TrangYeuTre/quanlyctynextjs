import classes from "./KetQuaDdnBar.module.css";
import { BsFillCalendarCheckFill } from "react-icons/bs";
import { FaChalkboardTeacher } from "react-icons/fa";

const KetQuaDdnBar = (props) => {
  const { data, xoaNgayDiemDanhNhom, id } = props;
  const { ngayDiemDanh } = data;
  //View lại ngày điể mdanh
  const ngayView = new Date(ngayDiemDanh).getDate() || null;
  //Tạo mảng giáo viên được điẻm danh
  let arrGiaoVienDay = [];
  for (const key in data) {
    console.log(key);
    if (key.toString().length === 24) {
      arrGiaoVienDay.push({
        giaoVienId: key,
        shortName: data[key].shortName,
      });
    }
  }
  //Cb xóa ngày ddn
  const xoaNgayHandler = (id) => {
    xoaNgayDiemDanhNhom(id);
  };
  return (
    <div className={classes.container} id={id}>
      {/* Phần thông tin */}
      <div className={classes.infos}>
        <div className={classes.sexNam}>
          {" "}
          <BsFillCalendarCheckFill size="1.8rem" />
          <p>{ngayView}</p>
        </div>
        <div className={classes.lop}>
          <FaChalkboardTeacher />
        </div>
        {arrGiaoVienDay.length > 0 &&
          arrGiaoVienDay.map((giaovien) => (
            <div className={classes.lop} key={giaovien.giaoVienId}>
              {giaovien.shortName}
            </div>
          ))}
      </div>
      {/* Phần nút actions */}
      <div className={classes.actions}>
        <div
          className={classes.delBtn}
          onClick={xoaNgayHandler.bind(0, data.id)}
        >
          <p>Xóa</p>
        </div>
      </div>
    </div>
  );
};

export default KetQuaDdnBar;
