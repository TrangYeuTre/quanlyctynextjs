import DanhSachLopNhomPage from "../../components/lopnhom/DanhSachLopNhom";
import ConnectMongodb from "../../helper/connectMongodb";
import DataLopNhom from "../../classes/DataLopNhom";

const DanhSachLopNhomRoute = (props) => {
  const { arrLopNhom } = props;
  DataLopNhom.loadArrLopNhom(arrLopNhom);
  return <DanhSachLopNhomPage />;
};

//SSG đẻ load ds lớp nhóm
export async function getStaticProps() {
  //Kết nối db
  let client, db;
  try {
    const { clientGot, dbGot } = await ConnectMongodb();
    client = clientGot;
    db = dbGot;
  } catch (err) {
    return {
      notFound: true,
    };
  }
  //Lấy ds lớp nhóm nào
  try {
    const arrLopNhomGot = await db.collection("lopnhoms").find().toArray();
    const arrLopNhom = arrLopNhomGot.map((lopnhom) => {
      return {
        id: lopnhom._id.toString(),
        tenLopNhom: lopnhom.tenLopNhom,
        giaoVienLopNhom: lopnhom.giaoVienLopNhom,
        hocSinhLopNhom: lopnhom.hocSinhLopNhom,
      };
    });
    //Trả
    client.close();
    return {
      props: {
        arrLopNhom,
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

export default DanhSachLopNhomRoute;
