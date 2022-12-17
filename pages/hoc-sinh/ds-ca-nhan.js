import DanhSachHocSinhCaNhanPage from "../../components/hocsinh/DsHocSinhCn";
import ConnectMongoDb from "../../helper/connectMongodb";
import { useEffect, useState } from "react";
import DataHocSinh from "../../classes/DataHocSinh";
import { getSession } from "next-auth/react";
import {
  redirectPageAndResetState,
  layMangChuyenDoiDataTuMongodb,
} from "../../helper/uti";

const DsHocSinhCaNhanRoute = (props) => {
  //VARIABLES
  const { arrHocSinh } = props;
  const [isLoggedIn, setLoggedIn] = useState(false);
  DataHocSinh.loadArrHocSinhCaNhan(arrHocSinh);
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
    return <h1>Đang xử lý ...</h1>;
  }
  return <DanhSachHocSinhCaNhanPage />;
};

//SSG
export async function getStaticProps() {
  let client, db;
  try {
    const { clientGot, dbGot } = await ConnectMongoDb();
    client = clientGot;
    db = dbGot;
  } catch (err) {
    return { notFound: true };
  }

  try {
    const arrHocSinhGot = await db
      .collection("hocsinhs")
      .find({ lopHoc: { $in: ["canhan"] } })
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

export default DsHocSinhCaNhanRoute;
