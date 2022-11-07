import classes from "./HsPhuTrach.module.css";
import Layout28 from "../layout/layout-2-8";
import Card from "../UI/Card";
import PickGiaoVienBar from "../UI/PickGiaoVienBar";
import ListPerson from "../UI/ListPerson";
import { useState, useContext, useEffect } from "react";
import GiaoVienContext from "../../context/giaoVienContext";
import NotiContext from "../../context/notiContext";
import { useRouter } from "next/router";
import { sortArtByLastShortName } from "../../helper/uti";

const HocSinhPhuTrachPage = (props) => {
  const router = useRouter();
  const { arrGiaoVien, arrHocSinhCaNhan } = props;
  //Lấy ctx giáo viên
  const notiCtx = useContext(NotiContext);
  const giaoVienCtx = useContext(GiaoVienContext);
  const giaoVienDuocChonId = giaoVienCtx.giaoVienSelectedId;

  //State mảng học trò đã có của giáo viên được chọn trước đó, đây cũng là mảng chính load học trò của giáo viên
  const [arrHocTroDefault, setArrHocTroDefault] = useState([]);

  //Cb lấy mảng hs phụ trách
  const setArrHocSinhPhuTrachHandler = async (arr) => {
    //Arr truyền lên lúc này vẫn là arrFull học sinh, ta chỉ lọc lại học sinh được chọn đẻ fetch update magnr học trò cá nhân cho giáo viên
    const arrFilterHsDuocChon = arr.filter((hs) => hs.isSelected);
    const arrHocSinhDuocChon = arrFilterHsDuocChon.map((item) => {
      return { hocSinhId: item.id.toString() };
    });
    //Tổng hợp lại data submit
    const dataSubmit = {
      idGiaoVien: giaoVienDuocChonId,
      arrHocSinhChon: arrHocSinhDuocChon,
    };
    //Fetch lên db để cập nhật mảng hocTroCaNhan cho giáo viên
    const response = await fetch("/api/hocSinhPhuTrachChoGiaoVien", {
      method: "PUT",
      body: JSON.stringify(dataSubmit),
      headers: { "Content-Type": "application/json" },
    });
    const statusCode = response.status;
    const dataGot = await response.json();
    //Đẩy thông báo
    setTimeout(() => {
      notiCtx.clearNoti();
      if (statusCode === 200 || statusCode === 201) {
        //Đẩy ngay đến trang thêm lịch cho học trò
        const giaoVienDuocChonId = giaoVienCtx.giaoVienSelectedId;
        router.push(`/giao-vien/hs-phu-trach/${giaoVienDuocChonId}`);
      }
    }, process.env.DELAY_TIME_NOTI);
    window.scrollTo(0, 0);
    notiCtx.pushNoti({ status: statusCode, message: dataGot.thongbao });
  };

  //Dựa vào ctx giáo viên được chọn, load mảng học trò đã tồn tại cua giáo viên này
  useEffect(() => {
    if (giaoVienDuocChonId) {
      const giaoVienMatched = arrGiaoVien.find(
        (gv) => gv.id.toString() === giaoVienDuocChonId.toString()
      );
      if (giaoVienMatched) {
        //Chú ý phải map prop hocSinhId về thành id mới dùng được trong cpm ListPerson
        const arrConvert = giaoVienMatched.hocTroCaNhan.map((i) => {
          return { id: i.hocSinhId };
        });
        setArrHocTroDefault(arrConvert);
      }
    }
  }, [arrGiaoVien, giaoVienDuocChonId]);

  return (
    <Card>
      <Layout28>
        <section className={classes.smallArea}>
          <PickGiaoVienBar arrGiaoVien={arrGiaoVien} />
        </section>
        <section className={classes.bigArea}>
          {!giaoVienDuocChonId && <h3>Chọn giáo viên để thao tác tiếp.</h3>}
          {/* Vùng chọn học sinh cho giáo viên */}
          {giaoVienDuocChonId && (
            <div className={classes.control}>
              <h3>Chọn học sinh cá nhân</h3>
              <ListPerson
                arrPeopleSelected={arrHocTroDefault}
                arrPeople={arrHocSinhCaNhan}
                getArrResult={setArrHocSinhPhuTrachHandler}
                hintAction="Bấm chốt để đến bước tiếp theo --->"
              />
            </div>
          )}
        </section>
      </Layout28>
    </Card>
  );
};

export default HocSinhPhuTrachPage;
