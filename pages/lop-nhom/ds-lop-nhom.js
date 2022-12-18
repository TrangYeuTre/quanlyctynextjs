import DanhSachLopNhomPage from "../../components/lopnhom/DanhSachLopNhom";
import ConnectMongodb from "../../helper/connectMongodb";
import DataLopNhom from "../../classes/DataLopNhom";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import {
  redirectPageAndResetState,
  layMangChuyenDoiDataTuMongodb,
} from "../../helper/uti";

const DanhSachLopNhomRoute = (props) => {
  //VARIABLES
  const [isLoggedIn, setLoggedIn] = useState(false);
  const { arrLopNhom } = props;
  DataLopNhom.loadArrLopNhom(arrLopNhom);

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

  const isProcessing = () => {
    return !isLoggedIn || !arrLopNhom;
  };
  if (isProcessing()) {
    return <h1>Đang xử lý ...</h1>;
  }

  return <DanhSachLopNhomPage />;
};

//SSG
export async function getStaticProps() {
  let client, db;
  try {
    const { clientGot, dbGot } = await ConnectMongodb();
    client = clientGot;
    db = dbGot;
  } catch (err) {
    return {
      notFound: true,
    };
  }
  try {
    const arrLopNhomGot = await db.collection("lopnhoms").find().toArray();
    const arrNeededProps = [
      "id",
      "tenLopNhom",
      "giaoVienLopNhom",
      "hocSinhLopNhom",
    ];
    const arrLopNhom = layMangChuyenDoiDataTuMongodb(
      arrLopNhomGot,
      arrNeededProps
    );
    client.close();
    return {
      props: {
        arrLopNhom,
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

export default DanhSachLopNhomRoute;
