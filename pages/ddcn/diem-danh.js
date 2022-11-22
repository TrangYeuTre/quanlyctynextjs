import DiemDanhCaNhanPage from "../../components/ddcn/DiemDanhCaNhan";
import ConnectMongo from "../../helper/connectMongodb";

const DiemDanhCaNhanRoute = (props) => {
  const { arrGiaoVien } = props;
  return <DiemDanhCaNhanPage arrGiaoVien={arrGiaoVien} />;
};

//SSG
export async function getStaticProps() {
  //Kết nối db trước
  let client, db;
  try {
    const { clientGot, dbGot } = await ConnectMongo();
    client = clientGot;
    db = dbGot;
  } catch (err) {
    return {
      notFound: true,
    };
  }
  //Lấy mảng giáo viên về
  let arrGiaoVien = [];
  let arrHocSinhCaNhan = [];
  try {
    const arrGiaoVienGot = await db.collection("giaoviens").find().toArray();
    //Map lại mảng giáo viên với _id thành id string
    //Chú ý: chỉ map lại mảng có các prop cần thiết
    const arrGiaoVienConvert = arrGiaoVienGot.map((gv) => {
      return {
        id: gv._id.toString(),
        shortName: gv.shortName,
        gioiTinh: gv.gioiTinh,
      };
    });
    arrGiaoVien = arrGiaoVienConvert;
  } catch (err) {
    client.close();
    return {
      notFound: true,
    };
  } //end try-catch lấy ds giáo viên
  //Trả cuối
  return {
    props: {
      arrGiaoVien,
    },
  };
}
export default DiemDanhCaNhanRoute;
