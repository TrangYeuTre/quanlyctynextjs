import classes from "./HsPhuTrach.module.css";
import Layout28 from "../layout/layout-2-8";
import Card from "../UI/Card";
import PickGiaoVienBar from "../UI/PickGiaoVienBar";
import ListPerson from "../UI/ListPerson";
import ActionBar from "../UI/ActionBar";
import { useState, useContext, useEffect, Fragment } from "react";
import GiaoVienContext from "../../context/giaoVienContext";
import NotiContext from "../../context/notiContext";
import { useRouter } from "next/router";
import { arrThu } from "../../data/static";
import { sortArtByLastShortName } from "../../helper/uti";

//Tạo một cái comp mini để render nội dung phần chọn lịch cho học trò
// const ChonItemPage = (props) => {
//   const { arrItems, getArrResult, type } = props;
//   //State mảng trả lại
//   const [arrResult, setArrResult] = useState([]);
//   //Cb xử lý chọn
//   const chonItemHandler = (id) => {
//     //Clone lại mảng arrItems
//     const arrItemsClone = [...arrItems];
//     //Tìm kiếm trong mảng item cần đổi isSelected
//     const indexItemMatched = arrItemsClone.findIndex((i) => i.id === id);
//     if (indexItemMatched !== -1) {
//       arrItemsClone[indexItemMatched].isSelected =
//         !arrItemsClone[indexItemMatched].isSelected;
//       setArrResult(arrItemsClone);
//     }
//   };

//   //Side effect thiết lập mảng render
//   useEffect(() => {
//     setArrResult(arrItems);
//     getArrResult(arrResult);
//   }, [arrItems, arrResult, getArrResult]);
//   //Tách lấy mảng học trò của giáo viên
//   return (
//     <div className={classes.lichContainer}>
//       <h3>{type === "thu" ? "Chọn thứ" : "Chọn học sinh cho thứ đã chọn"}</h3>
//       <ul className={classes.tags}>
//         {arrResult.length > 0 &&
//           arrResult.map((item) => {
//             let finalStyle = classes.tag;
//             if (item.isSelected) {
//               finalStyle = `${classes.tag} ${classes.tagActive}`;
//             }
//             return (
//               <li
//                 className={finalStyle}
//                 key={item.id}
//                 onClick={chonItemHandler.bind(0, item.id)}
//               >
//                 {type === "thu" ? item.name : item.shortName}
//               </li>
//             );
//           })}
//       </ul>
//     </div>
//   );
// };

//Comp chính
const HocSinhPhuTrachPage = (props) => {
  const router = useRouter();
  //Ghi chú: arrGiaoVien,arrHocSinhCaNhan cho chế độ chọn hs cá nhân, giaoVien cho chế độ chọn lịch cho học sinh
  const { arrGiaoVien, arrHocSinhCaNhan, giaoVien } = props;
  //Lấy ctx giáo viên
  const notiCtx = useContext(NotiContext);
  const giaoVienCtx = useContext(GiaoVienContext);
  const giaoVienDuocChonId = giaoVienCtx.giaoVienSelectedId;
  console.log(giaoVienDuocChonId)

  //State mảng học trò đã có của giáo viên được chọn trước đó, đây cũng là mảng chính load học trò của giáo viên
  const [arrHocTroDefault, setArrHocTroDefault] = useState([]);

  //Cb lấy mảng hs phụ trách, cập nhật học trò cho giáo viên luôn
  const setArrHocSinhPhuTrachHandler = async (arr) => {
    console.log(arr);
    //Arr truyền lên lúc này vẫn là arrFull học sinh, ta chỉ lọc lại học sinh được chọn đẻ fetch update magnr học trò cá nhân cho giáo viên
    const arrFilterHsDuocChon = arr.filter((hs) => hs.isSelected);
    const arrHocSinhDuocChon = arrFilterHsDuocChon.map((item) => {
      return { hocSinhId: item.id.toString(), shortName: item.shortName };
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
