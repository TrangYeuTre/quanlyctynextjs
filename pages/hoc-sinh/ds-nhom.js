import ConnectMongoDb from "../../helper/connectMongodb";
import DanhSachHocSinhNhomPage from "../../components/hocsinh/DsHocSinhNhom";
import DataHocSinh from "../../classes/DataHocSinh";

const DsHocSinhNhomRoute = (props) => {
  const { arrHocSinh } = props;
  //Tạo class data hs
  DataHocSinh.loadArrHocSinhNhom(arrHocSinh);
  return <DanhSachHocSinhNhomPage />;
};

//SSG lấy mảng hs cá nhân từ db
export async function getStaticProps() {
  //Fetch trực tiếp lên mongodb đẻ lấy mảng học sinh luôn, không cần thông api nội bộ làm gì
  let client, db;
  //Kết nối db trước
  try {
    const { clientGot, dbGot } = await ConnectMongoDb();
    client = clientGot;
    db = dbGot;
  } catch (err) {
    console.log(err);
    return { notFound: true };
  }
  // Lấy về mảng học sinh
  try {
    const arrHocSinhGot = await db
      .collection("hocsinhs")
      .find({ lopHoc: { $in: ["nhom"] } })
      .toArray();
    const arrHocSinhConvertId = arrHocSinhGot.map((item) => {
      return {
        id: item._id.toString(),
        tenHocSinh: item.tenHocSinh,
        shortName: item.shortName,
        lopHoc: item.lopHoc,
        gioiTinh: item.gioiTinh,
        soPhutHocMotTiet: item.soPhutHocMotTiet,
        hocPhiCaNhan: item.hocPhiCaNhan,
        hocPhiNhom: item.hocPhiNhom,
        ngaySinh: item.ngaySinh,
        tenPhuHuynh: item.tenPhuHuynh,
        soDienThoai: item.soDienThoai,
        diaChi: item.diaChi,
      };
    });
    //Đóng client
    client.close();
    //Trả
    return {
      props: {
        arrHocSinh: arrHocSinhConvertId,
      },
      revalidate: 10,
    };
  } catch (err) {
    console.log(err);
    client.close();
    return { notFound: true };
  }
}
export default DsHocSinhNhomRoute;
