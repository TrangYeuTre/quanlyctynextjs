import LichGiaoVienPage from "../../../components/giaovien/LichGiaoVien";
import ConnectMongoDb from "../../../helper/connectMongodb";
import GiaoVienProvider from "../../../context/giaoVienProvider";
import DataGiaoVien from "../../../classes/DataGiaoVien";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import {
  redirectPageAndResetStated,
  layMangChuyenDoiDataTuMongodb,
} from "../../../helper/uti";

const LichGiaoVienRoute = (props) => {
  //VARIABLES
  const [isLoggedIn, setLoggedIn] = useState(false);
  const { arrGiaoVien } = props;
  DataGiaoVien.loadArrGiaoVien(arrGiaoVien);

  //SIDE EFFECT
  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
        redirectPageAndResetStated("/auth/login");
      }
    });
  }, []);

  const isProcessing = () => {
    return !isLoggedIn || !arrGiaoVien;
  };
  if (isProcessing()) {
    return <h1>Đang xử lý ...</h1>;
  }

  return (
    <GiaoVienProvider>
      <LichGiaoVienPage />
    </GiaoVienProvider>
  );
};

//SSG
export async function getStaticProps() {
  let client, db;
  try {
    const { clientGot, dbGot } = await ConnectMongoDb();
    client = clientGot;
    db = dbGot;
  } catch (err) {
    return {
      notFound: true,
    };
  }

  try {
    const arrGiaoVienGot = await db.collection("giaoviens").find().toArray();
    const arrNeededProps = ["id", "shortName", "lichDayCaNhan"];
    const arrGiaoVienConvert = layMangChuyenDoiDataTuMongodb(
      arrGiaoVienGot,
      arrNeededProps
    );
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
