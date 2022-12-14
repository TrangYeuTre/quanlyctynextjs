import classes from "./HsPhuTrach.module.css";
import Layout28 from "../layout/layout-2-8";
import Card from "../UI/Card";
import PickGiaoVienBar from "../UI/PickGiaoVienBar";
import ListPerson from "../UI/ListPerson";
import { useState, useContext, useEffect, Fragment } from "react";
import GiaoVienContext from "../../context/giaoVienContext";
import NotiContext from "../../context/notiContext";
import { useRouter } from "next/router";
import GiaoVien from "../../classes/GiaoVien";
import DataHocSinh from "../../classes/DataHocSinh";
import DataGiaoVien from "../../classes/DataGiaoVien";
//Comp chính
const HocSinhPhuTrachPage = (props) => {
  const router = useRouter();
  //Ghi chú: arrGiaoVien,arrHocSinhCaNhan cho chế độ chọn hs cá nhân, giaoVien cho chế độ chọn lịch cho học sinh
  const { giaoVien } = props;
  const arrHocSinhCaNhan = DataHocSinh.arrHocSinhCaNhan;
  const arrGiaoVien = DataGiaoVien.arrGiaoVien;
  //Lấy ctx giáo viên
  const notiCtx = useContext(NotiContext);
  const giaoVienCtx = useContext(GiaoVienContext);
  const giaoVienDuocChonId = giaoVienCtx.giaoVienSelectedId;

  //State mảng học trò đã có của giáo viên được chọn trước đó, đây cũng là mảng chính load học trò của giáo viên
  const [arrHocTroDefault, setArrHocTroDefault] = useState([]);

  //Cb lấy mảng hs phụ trách, cập nhật học trò cho giáo viên luôn
  const setArrHocSinhPhuTrachHandler = async (arr) => {
    //Arr truyền lên lúc này vẫn là arrFull học sinh, ta chỉ lọc lại học sinh được chọn đẻ fetch update magnr học trò cá nhân cho giáo viên
    const arrFilterHsDuocChon = arr.filter((hs) => hs.isSelected);
    const arrHocSinhDuocChon = arrFilterHsDuocChon.map((item) => {
      return {
        hocSinhId: item.id.toString(),
        shortName: item.shortName,
        soPhutHocMotTiet: item.soPhutHocMotTiet,
      };
    });
    //Fetch update học sinh phụ trách của giáo viên
    const { statusCode, dataGot } = await GiaoVien.updateHocSinhPhuTrach(
      giaoVienDuocChonId,
      arrHocSinhDuocChon
    );
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

  //Cb không cập nhật ds học trò, next đến trang cập nhật lịch cho học trò
  const toLichChoHocTro = () => {
    router.push(`/giao-vien/hs-phu-trach/${giaoVienDuocChonId}`);
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
        {/* Chế độ chọn giáo viên và chọn học trò cho giáo viên */}
        {!giaoVien && (
          <Fragment>
            {" "}
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
                    doSubAction={toLichChoHocTro}
                    hintAction="Không đổi thì Té, có thì Chốt"
                  />
                </div>
              )}
            </section>
          </Fragment>
        )}
      </Layout28>
    </Card>
  );
};

export default HocSinhPhuTrachPage;
