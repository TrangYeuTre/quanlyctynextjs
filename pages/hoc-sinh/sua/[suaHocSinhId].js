import ThemHsPage from "../../../components/hocsinh/ThemHs";
import ConnectMongoDb from "../../../helper/connectMongodb";
import { ObjectId } from "mongodb";

const SuaHocSinhRoute = (props) => {
  //Lấy vè data sửa
  const { dataHocSinhSua } = props;
  //Trả
  return <ThemHsPage renderMode="sua" dataHocSinh={dataHocSinhSua} />;
};

//SSG lấy data học sinh cần sửa
export async function getStaticProps(context) {
  //Lấy về id học sinh từ context
  const idHocSinhSua = context.params.suaHocSinhId;
  //Xử lý connect đến db đẻ lấy data
  let client, db;
  try {
    //Connect đến db đẻ lấy ds học sinh
    const { clientGot, dbGot } = await ConnectMongoDb();
    client = clientGot;
    db = dbGot;
  } catch (err) {
    return {
      notFound: true,
    };
  }
  //Xử lý lấy về mảng hs từ db nào
  try {
    //Lấy về ds học sinh
    const hocSinhMatched = await db
      .collection("hocsinhs")
      .findOne({ _id: ObjectId(idHocSinhSua) });
    //Chuyển id lại strign
    const hocSinhConverted = {
      id: hocSinhMatched._id.toString(),
      tenHocSinh: hocSinhMatched.tenHocSinh,
      shortName: hocSinhMatched.shortName,
      lopHoc: hocSinhMatched.lopHoc,
      gioiTinh: hocSinhMatched.gioiTinh,
      soPhutHocMotTiet: hocSinhMatched.soPhutHocMotTiet,
      hocPhiCaNhan: hocSinhMatched.hocPhiCaNhan,
      hocPhiNhom: hocSinhMatched.hocPhiNhom,
      ngaySinh: hocSinhMatched.ngaySinh,
      tenPhuHuynh: hocSinhMatched.tenPhuHuynh,
      soDienThoai: hocSinhMatched.soDienThoai,
      diaChi: hocSinhMatched.diaChi,
      thongTinCoBan: hocSinhMatched.thongTinCoBan || "Thông tin cơ bản",
    };
    //Trả lại thôi
    client.close();
    return {
      props: {
        dataHocSinhSua: hocSinhConverted,
      },
      revalidate: 10,
    };
  } catch (err) {
    client.close();
    return {
      notFound: true,
    };
  } //End try-catch lấy về data hs
}

//SSP lấy dah sách hs đẻ render satic
export async function getStaticPaths() {
  let client, db;
  try {
    //Connect đến db đẻ lấy ds học sinh
    const { clientGot, dbGot } = await ConnectMongoDb();
    client = clientGot;
    db = dbGot;
  } catch (err) {
    return {
      paths: [],
      fallback: false,
    };
  }
  try {
    //Lấy về ds học sinh
    const arrHocSinh = await db.collection("hocsinhs").find().toArray();
    //Lấy lại mảng id học sinh để tạo path
    const arrHocSinhId = arrHocSinh.map((item) => {
      return { hocSinhId: item._id.toString() };
    });
    //Mảng paths nè
    const arrPaths = arrHocSinhId.map((id) => {
      return {
        params: { suaHocSinhId: id.hocSinhId },
      };
    });
    //Trả
    client.close();
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

export default SuaHocSinhRoute;
