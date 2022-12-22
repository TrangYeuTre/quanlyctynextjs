import ConnectMongo from "../../helper/connectMongodb";
import KetQuaDiemDanhNhomPage from "../../components/ddn/KetQuaDiemDanhNhom";
import ChonNguoiProvider from "../../context/chonNguoiProvider";
import DataLopNhom from "../../classes/DataLopNhom";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import Loading from "../../components/UI/Loading";
import {
  redirectPageAndResetState,
  layMangChuyenDoiDataTuMongodb,
} from "../../helper/uti";

const KetQuaDiemDanhNhomRoute = (props) => {
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
    return <Loading />;
  }

  return (
    <ChonNguoiProvider>
      <KetQuaDiemDanhNhomPage />
    </ChonNguoiProvider>
  );
};

//SSG
export async function getStaticProps() {
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

  try {
    const arrLopNhomGot = await db.collection("lopnhoms").find().toArray();
    const arrNeededProps = ["id", "tenLopNhom"];
    const arrLopNhom = layMangChuyenDoiDataTuMongodb(
      arrLopNhomGot,
      arrNeededProps
    );
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

export default KetQuaDiemDanhNhomRoute;
