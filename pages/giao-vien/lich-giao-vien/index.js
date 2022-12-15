import LichGiaoVienPage from "../../../components/giaovien/LichGiaoVien";
import ConnectMongoDb from "../../../helper/connectMongodb";
import GiaoVienProvider from "../../../context/giaoVienProvider";
import DataGiaoVien from "../../../classes/DataGiaoVien";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";

const LichGiaoVienRoute = (props) => {
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
      <LichGiaoVienPage />
    </GiaoVienProvider>
  );
};

//SSG lấy mảng giáo viên về nào
export async function getStaticProps() {
  let client, db;
  //Kết nối đến db nào
  try {
    const { clientGot, dbGot } = await ConnectMongoDb();
    client = clientGot;
    db = dbGot;
  } catch (err) {
    return {
      notFound: true,
    };
  } // End t-c kết nối db
  //Tiến hành load ds giáo viên thôi
  try {
    const arrGiaoVienGot = await db.collection("giaoviens").find().toArray();
    //Map lại mảng giáo viên với _id thành id string
    //Chú ý: chỉ map lại mảng có các prop cần thiết
    const arrGiaoVienConvert = arrGiaoVienGot.map((gv) => {
      return {
        id: gv._id.toString(),
        shortName: gv.shortName,
        lichDayCaNhan: gv.lichDayCaNhan,
      };
    });
    //Ok xong thì trả lại thôi
    client.close();
    return {
      props: { arrGiaoVien: arrGiaoVienConvert },
      revalidate: 10,
    };
  } catch (err) {
    client.close();
    return {
      notFound: true,
    };
  }
}

export default LichGiaoVienRoute;
