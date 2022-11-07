import HocSinhPhuTrachPage from "../../../components/giaovien/HsPhuTrach";
import GiaoVienProvider from "../../../context/giaoVienProvider";
import ConnectMongoDb from "../../../helper/connectMongodb";

const HocSinhPhuTrachRoute = (props) => {
  const { arrGiaoVien, arrHocSinhCaNhan } = props;
  //Bọc provider dùng nội bộ trong tính năng học sinh phụ trách này thôi
  return (
    <GiaoVienProvider>
      <HocSinhPhuTrachPage
        arrGiaoVien={arrGiaoVien}
        arrHocSinhCaNhan={arrHocSinhCaNhan}
      />
    </GiaoVienProvider>
  );
};

//SSG
export async function getStaticProps() {
  let client, db;
  //Kết nối đến db nào
  try {
    const { clientGot, dbGot } = await ConnectMongoDb();
    client = clientGot;
    db = dbGot;
  } catch (err) {
    return {
      notFound: true,
    };
  } // End t-c kết nối db
  //Tạo biến để chứa kết quả : mảng giáo viên và mảng học sinh
  let arrGiaoVien = [];
  let arrHocSinhCaNhan = [];
  //Feth lấy mảng giáo viên
  try {
    const arrGiaoVienGot = await db.collection("giaoviens").find().toArray();
    const arrGiaoVienConvertIdHocTroCaNhan = arrGiaoVienGot.map((gv) => {
      const arrHocTroCaNhan = gv.hocTroCaNhan;
      const arrHocTroCaNhanId = arrHocTroCaNhan.map((item) => {
        return { hocSinhId: item.hocSinhId.toString() };
      });
      return {
        id: gv._id.toString(),
        shortName: gv.shortName,
        hocTroCaNhan: arrHocTroCaNhanId,
      };
    });
    arrGiaoVien = arrGiaoVienConvertIdHocTroCaNhan;
  } catch (err) {
    return {
      notFound: true,
    };
  }
  //Fetch lấy mảng học sinh cá nhân nào
  try {
    const arrHocSinhGot = await db
      .collection("hocsinhs")
      .find({ lopHoc: { $in: ["canhan"] } })
      .toArray();
    const arrHocSinhConvert = arrHocSinhGot.map((gv) => {
      return {
        id: gv._id.toString(),
        shortName: gv.shortName,
        isSelected: false,
      };
    });
    arrHocSinhCaNhan = arrHocSinhConvert;
  } catch (err) {
    return {
      notFound: true,
    };
  }
  //Trả cuối thôi
  return {
    props: {
      arrGiaoVien,
      arrHocSinhCaNhan,
    },
  };
}

export default HocSinhPhuTrachRoute;
