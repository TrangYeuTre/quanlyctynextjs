import ConnectMongoDb from "../../helper/connectMongodb";
import ThongKeHocSinhPage from "../../components/ddcn/ThongKeHocSinh";
import ChonNguoiProvider from "../../context/chonNguoiProvider";
import {
  getFirstLastDateOfPrevMonth,
  getFirstLastDateOfThisMonth,
} from "../../helper/uti";

const ThongKeHocSinhRoute = (props) => {
  const { arrHocSinh, arrDiemDanhCaNhanFilter } = props;
  return (
    <ChonNguoiProvider>
      {" "}
      <ThongKeHocSinhPage arrHocSinh={arrHocSinh} arrDdcn={arrDiemDanhCaNhanFilter}/>
    </ChonNguoiProvider>
  );
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
    return { notFound: true };
  }
  //Tạo mảng chưa kq
  let arrHocSinh = [];
  let arrDiemDanhCaNhanFilter = [];
  // Lấy về mảng học sinh
  try {
    const arrHocSinhGot = await db
      .collection("hocsinhs")
      .find({ lopHoc: { $in: ["canhan"] } })
      .toArray();
    const arrHocSinhConvert = arrHocSinhGot.map((hocsinh) => {
      return {
        id: hocsinh._id.toString(),
        lopHoc: hocsinh.lopHoc,
        gioiTinh: hocsinh.gioiTinh,
        tenHocSinh: hocsinh.tenHocSinh,
        shortName: hocsinh.shortName,
        ngaySinh: hocsinh.ngaySinh,
        soPhutHocMotTiet: +hocsinh.soPhutHocMotTiet,
        hocPhiCaNhan: +hocsinh.hocPhiCaNhan,
        hocPhiNhom: +hocsinh.hocPhiNhom,
        tenPhuHuynh: hocsinh.tenPhuHuynh || "",
        soDienThoai: hocsinh.soDienThoai || "",
        diaChi: hocsinh.diaChi || "",
        thongTinCoBan: hocsinh.thongTinCoBan || "",
      };
    });
    arrHocSinh = arrHocSinhConvert;
  } catch (err) {
    client.close();
    return { notFound: true };
  } // end try catch lấy mảng học sinh cá nhân
  //Tạo biến ngày hiện tại để lọc data
  const now = new Date();
  //Từ biến now này lấy ngày đầu của tháng trước và ngày cuối của tháng này để làm biên lọc data mongodb
  const { firstDateOfThisMonth, lastDateOfThisMonth } =
    getFirstLastDateOfThisMonth(now);
  const { firstDateOfPrevMonth, lastDateOfPrevMonth } =
    getFirstLastDateOfPrevMonth(now);

  // Lấy về mảng điểm danh cá nhân short thêo 2 tháng
  try {
    const arrDdcn = await db
      .collection("diemdanhcanhans")
      .find({
        ngayDiemDanh: {
          $gte: firstDateOfPrevMonth,
          $lte: lastDateOfThisMonth,
        },
      })
      .toArray();
    //Convert id
    arrDdcn.forEach((item) => (item._id = item._id.toString()));
    arrDiemDanhCaNhanFilter = arrDdcn;
  } catch (err) {
    client.close();
    return { notFound: true };
  } // end try catch lấy mảng học sinh cá nhân
  //Cuối trả
  client.close();
  return {
    props: {
      arrHocSinh,
      arrDiemDanhCaNhanFilter,
    },
    revalidate: 10,
  };
}

export default ThongKeHocSinhRoute;
