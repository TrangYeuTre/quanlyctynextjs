import ConnectMongoDb from "../../../helper/connectMongodb";
import { ObjectId } from "mongodb";

const GanLichChoHocTroCuaGiaoVienDuocChonRoute = (props) => {
  const { giaoVien } = props;
  console.log(giaoVien);
  return <h1>Trang gán lịch học trò</h1>;
};

//SSG lấy data học sinh cần sửa
export async function getStaticProps(context) {
  //Lấy phần id
  const giaoVienId = context.params.giaoVienId;
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
      //Đổi id về string
      if (prop.toString() === "_id") {
        //xử lý phần id
        giaoVienConvert.id = giaoVienGot[prop].toString();
      }
      //Xử lý đổi mảng hocTroCaNhan có id về string luôn
      if (prop.toString() === "hocTroCaNhan") {
        const curHocTroCaNhan = giaoVienGot[prop];
        let arrHocTroCaNhanConvert = [];
        if (curHocTroCaNhan.length > 0) {
          arrHocTroCaNhanConvert = curHocTroCaNhan.map((item) => {
            return { hocSinhId: item.hocSinhId.toString() };
          });
        }
        giaoVienConvert[prop] = arrHocTroCaNhanConvert;
      }
      //Xử lý đổi mảng lịch dạy cá nâhn có các phần id về string dumgf
      if (prop.toString() === "lichDayCaNhan") {
        const curLichDayCaNhan = giaoVienGot[prop];
        let arrLichDayCaNhanConvert = [];
        if (curLichDayCaNhan.length > 0) {
          console.log("run ?");
          arrLichDayCaNhanConvert = curLichDayCaNhan.map((item) => {
            const curArrThu = item.arrThu;
            const curArrHocSinh = item.arrHocSinh;
            const curId = item._id;
            const arrThuConvert = curArrThu.map((i) => {
              return { thu: i.thu };
            });
            const arrHocSinhConvert = curArrHocSinh.map((i) => {
              return { hocSinhId: i.hocSinhId.toString() };
            });
            return {
              id: curId.toString(),
              arrThu: arrThuConvert,
              arrHocSinh: arrHocSinhConvert,
            };
          });
        }
        //Gán cuối
        giaoVienConvert[prop] = arrLichDayCaNhanConvert;
      }
      // xử lý phần prop còn lại
      if (
        prop.toString() !== "_id" &&
        prop.toString() !== "hocTroCaNhan" &&
        prop.toString() !== "lichDayCaNhan"
      ) {
        //xử lý phần id
        giaoVienConvert[prop] = giaoVienGot[prop];
      }
    }
    console.log(giaoVienConvert);
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
          giaoVienId: id,
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
export default GanLichChoHocTroCuaGiaoVienDuocChonRoute;
