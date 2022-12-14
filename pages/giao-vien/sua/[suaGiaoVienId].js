import ThemGvPage from "../../../components/giaovien/ThemGv";
import ConnectMongoDb from "../../../helper/connectMongodb";
import { ObjectId } from "mongodb";
import DataGiaoVien from "../../../classes/DataGiaoVien";

const SuaGiaoVienRoute = (props) => {
  const { giaoVien } = props;
  DataGiaoVien.loadDataGiaoVienDuocChon(giaoVien);
  //Trả
  return <ThemGvPage renderMode="sua" />;
};

//SSG lấy data học sinh cần sửa
export async function getStaticProps(context) {
  //Lấy phần id
  const giaoVienId = context.params.suaGiaoVienId;
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
  //Lấy về giáo viên theo id nào
  try {
    const giaoVienGot = await db
      .collection("giaoviens")
      .findOne({ _id: ObjectId(giaoVienId) });
    //Chuyển id thành string
    let giaoVienConvert = new Object();
    for (let prop in giaoVienGot) {
      if (prop.toString() === "_id") {
        //xử lý phần id
        giaoVienConvert.id = giaoVienGot[prop].toString();
      } else if (
        prop.toString() !== "hocTroCaNhan" &&
        prop.toString() !== "lichDayCaNhan"
      ) {
        // xử lý phần prop còn lại
        giaoVienConvert[prop] = giaoVienGot[prop];
      }
    }
    client.close();
    //Trả thôi
    return {
      props: {
        giaoVien: giaoVienConvert,
      },
      revalidate: 10,
    };
  } catch (err) {
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
          suaGiaoVienId: id,
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

export default SuaGiaoVienRoute;
