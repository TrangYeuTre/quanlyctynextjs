import ConnectMongoDb from "../../../helper/connectMongodb";
import { ObjectId } from "mongodb";
// import HocSinhPhuTrachPage from "../../../components/giaovien/HsPhuTrach";
import GanLichChoHsPage from "../../../components/giaovien/GanLichChoHs";
import { useEffect, useState } from "react";

const GanLichChoHocTroCuaGiaoVienDuocChonRoute = (props) => {
  const { giaoVien, arrHocSinhCaNhan, arrHocTroCaNhan, arrLichDayCaNhan } =
    props;
  //State lư giáo viên
  const [gv, setGv] = useState({});
  //Side effect load
  useEffect(() => {
    let gvClone = { ...giaoVien };
    //Lọc lại mảng học trò cho giáo viên để thêm shortName
    let arrHocTroCaNhanRemake = [];
    const curHocTroCaNhan = arrHocTroCaNhan;
    if (curHocTroCaNhan.length > 0) {
      curHocTroCaNhan.forEach((i) => {
        const indexHsMatched = arrHocSinhCaNhan.findIndex(
          (hs) => hs.id === i.hocSinhId
        );
        if (indexHsMatched !== -1) {
          arrHocTroCaNhanRemake.push(arrHocSinhCaNhan[indexHsMatched]);
        }
      });
    }
    gvClone.hocTroCaNhan = arrHocTroCaNhanRemake;
    setGv(gvClone);
  }, [giaoVien, arrHocSinhCaNhan, arrHocTroCaNhan]);
  return (
    <GanLichChoHsPage
      giaoVien={gv}
      arrHocTroCaNhan={arrHocTroCaNhan}
      arrLichDayCaNhan={arrLichDayCaNhan}
    />
  );
};

//SSG lấy data học sinh cần sửa
export async function getStaticProps(context) {
  //Lấy phần id
  const giaoVienId = context.params.giaoVienId;
  let db, client;
  //Kết nối db
  try {
    const { clientGot, dbGot } = await ConnectMongoDb();
    db = dbGot;
    client = clientGot;
  } catch (err) {
    return {
      notFound: true,
    };
  }
  let arrHocSinhCaNhan = [];
  //Lấy về mảng học sinh cá nhân đê render phần chọn cho trang lịch học trò
  try {
    const arrHocSinhCaNhanGot = await db
      .collection("hocsinhs")
      .find({ lopHoc: { $in: ["canhan"] } })
      .toArray();

    arrHocSinhCaNhan = arrHocSinhCaNhanGot.map((hs) => {
      return { id: hs._id.toString(), shortName: hs.shortName };
    });
  } catch (err) {
    client.close();
    return {
      notFound: true,
    };
  }
  //Lấy về giáo viên theo id nào
  let giaoVien = new Object();
  let arrHocTroCaNhan = [];
  let arrLichDayCaNhan = [];
  //Xử lý lấy giáo viên và 2 mảng cần tương tác học trò cá nhân và lịch dạy cá nhân
  try {
    const giaoVienGot = await db
      .collection("giaoviens")
      .findOne({ _id: ObjectId(giaoVienId) });
    //Lấy về id và shortName của giáo viên xài thôi
    giaoVien.id = giaoVienGot._id.toString();
    giaoVien.shortName = giaoVienGot.shortName;
    //Lấy về mảng học trò cá nhan của giáo viên thôi
    arrHocTroCaNhan = giaoVienGot.hocTroCaNhan;
    //Xử lý mảng lịch cá nhân
    arrLichDayCaNhan = giaoVienGot.lichDayCaNhan;
    //Trả lại props
    return {
      props: {
        giaoVien,
        arrHocTroCaNhan,
        arrLichDayCaNhan,
        arrHocSinhCaNhan,
      },
      revalidate: 10,
    };
  } catch (err) {
    console.log(err);
    client.close();
    return {
      notFound: true,
    };
  }
}

// SSP lấy dah sách hs đẻ render satic
export async function getStaticPaths() {
  let db, client;
  //Kết nối db
  try {
    const { clientGot, dbGot } = await ConnectMongoDb();
    db = dbGot;
    client = clientGot;
  } catch (err) {
    return {
      notFound: true,
    };
  }
  //Đọc mảng giáo viên và lấy về mảng id giáo viên làm paths
  try {
    const arrGiaoVienGot = await db.collection("giaoviens").find().toArray();
    const arrGiaoVienIds = arrGiaoVienGot.map((gv) => gv._id.toString());
    const arrPaths = arrGiaoVienIds.map((id) => {
      return {
        params: {
          giaoVienId: id,
        },
      };
    });
    client.close();
    //Trả thôi
    return {
      paths: arrPaths,
      fallback: "blocking",
    };
  } catch (err) {
    client.close();
    return {
      paths: [],
      fallback: false,
    };
  }
}
export default GanLichChoHocTroCuaGiaoVienDuocChonRoute;
