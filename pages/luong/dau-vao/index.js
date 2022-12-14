import ConnectMongoDb from "../../../helper/connectMongodb";
import ChonNguoiProvider from "../../../context/chonNguoiProvider";
import LuongDauVaoPage from "../../../components/luong/dauVao/LuongDauVao";
import DataGiaoVien from "../../../classes/DataGiaoVien";

const LuongDauVaoRoute = (props) => {
  const { arrGiaoVien } = props;
  DataGiaoVien.loadArrGiaoVien(arrGiaoVien);
  return (
    <ChonNguoiProvider>
      <LuongDauVaoPage />
    </ChonNguoiProvider>
  );
};

//SSG lây mảng học sinh cá nhân ở để tính
export async function getStaticProps() {
  //Fetch trực tiếp lên mongodb đẻ lấy mảng học sinh luôn, không cần thông api nội bộ làm gì
  let client, db;
  //Kết nối db trước
  try {
    const { clientGot, dbGot } = await ConnectMongoDb();
    client = clientGot;
    db = dbGot;
  } catch (err) {
    return { notFound: true };
  }
  // Lấy về mảng học sinh
  try {
    const arrGiaoVienGot = await db.collection("giaoviens").find().toArray();
    const arrGiaoVienConvertId = arrGiaoVienGot.map((item) => {
      return {
        id: item._id.toString(),
        tenGiaoVien: item.tenGiaoVien,
        shortName: item.shortName,
        luongCaNhan: item.luongCaNhan,
        luongNhom: item.luongNhom,
      };
    });
    //Đóng client
    client.close();
    //Trả
    return {
      props: {
        arrGiaoVien: arrGiaoVienConvertId,
      },
      revalidate: 10,
    };
  } catch (err) {
    client.close();
    return { notFound: true };
  }
}
export default LuongDauVaoRoute;
