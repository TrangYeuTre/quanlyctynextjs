import classes from "./HsPhuTrach.module.css";
import Layout28 from "../layout/layout-2-8";
import Card from "../UI/Card";
import PickGiaoVienBar from "../UI/PickGiaoVienBar";
import ListPerson from "../UI/ListPerson";
import { useState, useContext } from "react";
import GiaoVienContext from "../../context/giaoVienContext";

const HocSinhPhuTrachPage = (props) => {
  //Lấy ctx giáo viên
  const giaoVienCtx = useContext(GiaoVienContext);
  const giaoVienDuocChonId = giaoVienCtx.giaoVienSelectedId;
  //Nhưng arr dummy này pảh load từ ssg rồi truyền xuôgns props này
  const ARR_GIAOVIEN_DUMMY = [
    { id: "gv1", shortName: "Boss Trang", isSelected: false },
    { id: "gv2", shortName: "Thy Thy", isSelected: false },
    { id: "gv3", shortName: "Trâm Trâm", isSelected: false },
    { id: "gv4", shortName: "Lan Lan", isSelected: false },
  ];
  const ARR_HOCSINH_DUMMY = [
    { id: "hs1", shortName: "Châu Chấu", isSelected: false },
    { id: "hs2", shortName: "Bò Bò", isSelected: false },
    { id: "hs3", shortName: "Gà Gà", isSelected: false },
    { id: "hs4", shortName: "Heo Heo", isSelected: false },
    { id: "hs5", shortName: "Chó Chó", isSelected: false },
    { id: "hs6", shortName: "Vịt Vịt", isSelected: false },
    { id: "hs7", shortName: "Chim Chim", isSelected: false },
  ];

  //State lấy mảng học sinh được chọn
  const [arrHocSinhPhuTrach, setArrHocSinhPhuTrach] = useState([]);

  //Cb lấy mảng hs phụ trách
  const setArrHocSinhPhuTrachHandler = (arr) => {
    setArrHocSinhPhuTrach(arr);
  };

  console.log(arrHocSinhPhuTrach);

  return (
    <Card>
      <Layout28>
        <section className={classes.smallArea}>
          <PickGiaoVienBar arrGiaoVien={ARR_GIAOVIEN_DUMMY} />
        </section>
        <section className={classes.bigArea}>
          {!giaoVienDuocChonId && <h3>Chọn giáo viên để thao tác tiếp.</h3>}
          {giaoVienDuocChonId && (
            <div className={classes.control}>
              <h3>Chọn học sinh cá nhân</h3>
              <ListPerson
                arrPeople={ARR_HOCSINH_DUMMY}
                getArrResult={setArrHocSinhPhuTrachHandler}
              />
            </div>
          )}
        </section>
      </Layout28>
    </Card>
  );
};

export default HocSinhPhuTrachPage;
