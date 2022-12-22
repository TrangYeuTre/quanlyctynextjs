import ConnectMongoDb from "../../helper/connectMongodb";
import DanhSachHocSinhNhomPage from "../../components/hocsinh/DsHocSinhNhom";
import DataHocSinh from "../../classes/DataHocSinh";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import {
  redirectPageAndResetState,
  layMangChuyenDoiDataTuMongodb,
} from "../../helper/uti";
import Loading from "../../components/UI/Loading";

const DsHocSinhNhomRoute = (props) => {
  //VARIABLES
  const { arrHocSinh } = props;
  const [isLoggedIn, setLoggedIn] = useState(false);
  //SIDE EFFECT
  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
        redirectPageAndResetState("/auth/login");
      }
    });
  }, []);

  if (!isLoggedIn) {
    return <Loading />;
  }
  //Tạo class data hs
  DataHocSinh.loadArrHocSinhNhom(arrHocSinh);
  return <DanhSachHocSinhNhomPage />;
};

//SSG
export async function getStaticProps() {
  let client, db;
  try {
    const { clientGot, dbGot } = await ConnectMongoDb();
    client = clientGot;
    db = dbGot;
  } catch (err) {
    console.log(err);
    return { notFound: true };
  }

  try {
    const arrHocSinhGot = await db
      .collection("hocsinhs")
      .find({ lopHoc: { $in: ["nhom"] } })
      .toArray();
    const arrNeededProps = ["id", "shortName", "lopHoc", "gioiTinh"];
    const arrHocSinhConvertId = layMangChuyenDoiDataTuMongodb(
      arrHocSinhGot,
      arrNeededProps
    );
    client.close();
    return {
      props: {
        arrHocSinh: arrHocSinhConvertId,
      },
      revalidate: 10,
    };
  } catch (err) {
    client.close();
    return { notFound: true };
  }
}
export default DsHocSinhNhomRoute;
