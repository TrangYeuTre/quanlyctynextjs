import DiemDanhCaNhanPage from "../../components/ddcn/DiemDanhCaNhan";
import ConnectMongo from "../../helper/connectMongodb";
import GiaoVienProvider from "../../context/giaoVienProvider";
import ChonNguoiProvider from "../../context/chonNguoiProvider";
import { useEffect, useState } from "react";
import DataGiaoVien from "../../classes/DataGiaoVien";

const DiemDanhCaNhanRoute = (props) => {
  const { arrGiaoVien } = props;
  DataGiaoVien.loadArrGiaoVien(arrGiaoVien);
  //State loading
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (arrGiaoVien) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [arrGiaoVien]);
  return (
    <GiaoVienProvider>
      <ChonNguoiProvider>
        {loading && <h1>Đang load ...</h1>}
        {!loading && <DiemDanhCaNhanPage />}
      </ChonNguoiProvider>
    </GiaoVienProvider>
  );
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
  try {
    const arrGiaoVienGot = await db.collection("giaoviens").find().toArray();
    //Map lại mảng giáo viên với _id thành id string
    //Chú ý: chỉ map lại mảng có các prop cần thiết
    const arrGiaoVienConvert = arrGiaoVienGot.map((gv) => {
      return {
        id: gv._id.toString(),
        shortName: gv.shortName,
        hocTroCaNhan: gv.hocTroCaNhan,
        lichDayCaNhan: gv.lichDayCaNhan,
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
