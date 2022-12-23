import ConnectMongoDb from "../../../helper/connectMongodb";
import ChonNguoiProvider from "../../../context/chonNguoiProvider";
import LuongDauVaoPage from "../../../components/luong/dauVao/LuongDauVao";
import DataGiaoVien from "../../../classes/DataGiaoVien";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import {
  redirectPageAndResetState,
  layMangChuyenDoiDataTuMongodb,
} from "../../../helper/uti";
import Loading from "../../../components/UI/Loading";

const LuongDauVaoRoute = (props) => {
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
        redirectPageAndResetState("/auth/login");
      }
    });
  }, []);

  const isProcessing = () => {
    return !isLoggedIn || !arrGiaoVien;
  };
  if (isProcessing()) {
    return <Loading />;
  }

  return (
    <ChonNguoiProvider>
      <LuongDauVaoPage />
    </ChonNguoiProvider>
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
    return { notFound: true };
  }
  try {
    const arrGiaoVienGot = await db.collection("giaoviens").find().toArray();
    const arrNeededProps = [
      "id",
      "tenGiaoVien",
      "shortName",
      "luongCaNhan",
      "luongNhom",
    ];
    const arrGiaoVien = layMangChuyenDoiDataTuMongodb(
      arrGiaoVienGot,
      arrNeededProps
    );
    client.close();
    return {
      props: {
        arrGiaoVien,
      },
      revalidate: 10,
    };
  } catch (err) {
    client.close();
    return { notFound: true };
  }
}
export default LuongDauVaoRoute;
