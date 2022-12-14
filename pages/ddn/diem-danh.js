import DiemDanhNhomPage from "../../components/ddn/DiemDanhNhom";
import ConnectMongo from "../../helper/connectMongodb";
import ChonNguoiProvider from "../../context/chonNguoiProvider";
import DataGiaoVien from "../../classes/DataGiaoVien";
import DataLopNhom from "../../classes/DataLopNhom";

const DiemDanhNhomRoute = (props) => {
  const { arrLopNhom, arrGiaoVien } = props;
  DataLopNhom.loadArrLopNhom(arrLopNhom);
  DataGiaoVien.loadArrGiaoVien(arrGiaoVien);
  return (
    <ChonNguoiProvider>
      <DiemDanhNhomPage />
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
  //Lấy mảng lớp nhóm
  let arrLopNhom = [];
  //Lấy mảng giáo viên để chọn thêm nếu cần
  let arrGiaoVien = [];
  try {
    const arrLopNhomGot = await db.collection("lopnhoms").find().toArray();
    const arrLopNHomConvert = arrLopNhomGot.map((item) => {
      return {
        id: item._id.toString(),
        tenLopNhom: item.tenLopNhom,
        giaoVienLopNhom: item.giaoVienLopNhom,
      };
    });
    arrLopNhom = arrLopNHomConvert;
  } catch (err) {
    client.close();
    return {
      notFound: true,
    };
  } //end try-catch lấy ds lớpn nhom
  try {
    const arrGvGot = await db.collection("giaoviens").find().toArray();
    const arrGvConvert = arrGvGot.map((item) => {
      return {
        id: item._id.toString(),
        shortName: item.shortName,
        luongNhom: item.luongNhom,
      };
    });
    arrGiaoVien = arrGvConvert;
  } catch (err) {
    client.close();
    return {
      notFound: true,
    };
  } //end try-catch lấy ds giáo viên

  //Trả cuối
  return {
    props: {
      arrLopNhom,
      arrGiaoVien,
    },
    revalidate: 10,
  };
}

export default DiemDanhNhomRoute;
