import DanhSachGiaoVienPage from "../../components/giaovien/DsGiaoVien";
import ConnectMongoDb from "../../helper/connectMongodb";
import DataGiaoVien from "../../classes/DataGiaoVien";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { layMangChuyenDoiDataTuMongodb } from "../../helper/uti";
import Loading from "../../components/UI/Loading";

const DsHocSinhCaNhanRoute = (props) => {
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
        window.location.href = "/auth/login";
      }
    });
  }, []);

  const isProcessing = () => {
    return !isLoggedIn || !arrGiaoVien;
  };
  if (isProcessing()) {
    return <Loading />;
  }

  return <DanhSachGiaoVienPage />;
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
    const arrNeededProps = ["id", "shortName", "gioiTinh"];
    const arrGiaoVienConvertedId = layMangChuyenDoiDataTuMongodb(
      arrGiaoVienGot,
      arrNeededProps
    );
    client.close();
    return {
      props: { arrGiaoVien: arrGiaoVienConvertedId },
      revalidate: 10,
    };
  } catch (err) {
    client.close();
    return {
      notFound: true,
    };
  }
}

export default DsHocSinhCaNhanRoute;
