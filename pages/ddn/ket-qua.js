import ConnectMongo from "../../helper/connectMongodb";
import KetQuaDiemDanhNhomPage from "../../components/ddn/KetQuaDiemDanhNhom";
import ChonNguoiProvider from "../../context/chonNguoiProvider";
import {
  getFirstLastDateOfThisMonth,
  getFirstLastDateOfPrevMonth,
} from "../../helper/uti";

const KetQuaDiemDanhNhomRoute = (props) => {
  const { arrDiemDanhNhomFilter, arrLopNhom } = props;
  return (
    <ChonNguoiProvider>
      <KetQuaDiemDanhNhomPage
        arrDdnFitler={arrDiemDanhNhomFilter}
        arrLopNhom={arrLopNhom}
      />
    </ChonNguoiProvider>
  );
};

//SSG lấy lớp nhóm
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

  //Tạo biến ngày hiện tại để lọc data
  const now = new Date();
  //Từ biến now này lấy ngày đầu của tháng trước và ngày cuối của tháng này để làm biên lọc data mongodb
  const { firstDateOfThisMonth, lastDateOfThisMonth } =
    getFirstLastDateOfThisMonth(now);
  const { firstDateOfPrevMonth, lastDateOfPrevMonth } =
    getFirstLastDateOfPrevMonth(now);
  //Ta có 2 biên lọc
  //   console.log(firstDateOfPrevMonth, lastDateOfThisMonth);
  let arrDiemDanhNhomFilter = [];
  //Lấy mảng điểm danh cá nhân
  try {
    const arrDdn = await db
      .collection("diemdanhnhoms")
      .find({
        ngayDiemDanh: {
          $gte: firstDateOfPrevMonth,
          $lte: lastDateOfThisMonth,
        },
      })
      .toArray();
    //Convert id
    arrDdn.forEach((item) => {
      item.id = item._id.toString();
      delete item._id;
    });
    arrDiemDanhNhomFilter = arrDdn;
  } catch (err) {
    client.close();
    return {
      notFound: true,
    };
  }
  //Lấy mảng lớp nhóm
  let arrLopNhom = [];
  try {
    const arrLopNhomGot = await db.collection("lopnhoms").find().toArray();
    const arrLopNHomConvert = arrLopNhomGot.map((item) => {
      return {
        id: item._id.toString(),
        tenLopNhom: item.tenLopNhom,
      };
    });
    arrLopNhom = arrLopNHomConvert;
  } catch (err) {
    client.close();
    return {
      notFound: true,
    };
  } //end try-catch lấy ds lớpn nhom

  //Trả cuối
  client.close();
  return {
    props: {
      arrDiemDanhNhomFilter,
      arrLopNhom,
    },
    revalidate: 10,
  };
}

export default KetQuaDiemDanhNhomRoute;
