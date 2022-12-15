import ConnectMongo from "../../helper/connectMongodb";
import DiemDanhDayThePage from "../../components/ddcn/DiemDanhDayThe";
import GiaoVienProvider from "../../context/giaoVienProvider";
import ChonNguoiProvider from "../../context/chonNguoiProvider";
import DataGiaoVien from "../../classes/DataGiaoVien";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";

const DiemDanhDayTheRoute = (props) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
        window.location.href = "/auth/login";
      }
    });
  }, []);
  if (!isLoggedIn) {
    return <h1>Đang xử lý ...</h1>;
  }

  const { arrGiaoVien } = props;
  DataGiaoVien.loadArrGiaoVien(arrGiaoVien);
  return (
    <GiaoVienProvider>
      <ChonNguoiProvider>
        <DiemDanhDayThePage />
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
export default DiemDanhDayTheRoute;
