import classes from "./PersonBar.module.css";
import Link from "next/link";
import { BsGenderMale, BsGenderFemale } from "react-icons/bs";
import { useRouter } from "next/router";

const PersonBar = (props) => {
  const router = useRouter();
  //Láy context animation
  //Cần những thứ sau truyền xuống :  name, id, gioiTinh, currentRoute dùng đẻ trở lại trang sau khi xóa
  const { shortName, id, gioiTinh, arrLoaiLop, doDelFetch } = props;
  //Tách phần mainRoute ra để dùng cho href bên dưới
  const arrPaths = router.asPath.split("/");
  const mainRoute = arrPaths[1];
  //Cb xóa
  const deletePersonHandler = (id) => {
    //Không fetch ở đây, đẩy lên trên để fetch xóa, như vậy mới tái sử dụng nhiều lần được nhé
    doDelFetch(id);
  };
  return (
    <div className={classes.container} id={id}>
      {/* Phần thông tin */}
      <div className={classes.infos}>
        <div className={gioiTinh == "nam" ? classes.sexNam : classes.sexNu}>
          {gioiTinh === "nam" && <BsGenderMale size="1.8rem" />}
          {gioiTinh === "nu" && <BsGenderFemale size="1.8rem" />}
        </div>
        {arrLoaiLop.length > 0 &&
          arrLoaiLop.map((item) => (
            <div key={Math.random()} className={classes.lop}>
              {item}
            </div>
          ))}
        <h3>{shortName}</h3>
      </div>
      {/* Phần nút actions */}
      <div className={classes.actions}>
        <div className={classes.editBtn}>
          <Link href={`/${mainRoute}/sua/${id}`}>
            <p>Sửa</p>
          </Link>
        </div>

        <div
          className={classes.delBtn}
          onClick={deletePersonHandler.bind(0, id)}
        >
          <p>Xóa</p>
        </div>
      </div>
    </div>
  );
};

export default PersonBar;
