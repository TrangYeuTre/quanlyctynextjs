import DiemDanhNhomPage from "../../components/ddn/DiemDanhNhom";
import ConnectMongo from "../../helper/connectMongodb";
import ChonNguoiProvider from "../../context/chonNguoiProvider";
import DataGiaoVien from "../../classes/DataGiaoVien";
import DataLopNhom from "../../classes/DataLopNhom";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import Loading from "../../components/UI/Loading";
import {
  redirectPageAndResetState,
  layMangChuyenDoiDataTuMongodb,
} from "../../helper/uti";

const DiemDanhNhomRoute = (props) => {
  //VARIABLES
  const [isLoggedIn, setLoggedIn] = useState(false);
  const { arrLopNhom, arrGiaoVien } = props;
  DataLopNhom.loadArrLopNhom(arrLopNhom);
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
    return !isLoggedIn || !arrLopNhom || !arrGiaoVien;
  };
  if (isProcessing()) {
    return <Loading />;
  }

  return (
    <ChonNguoiProvider>
      <DiemDanhNhomPage />
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

  let arrLopNhom = [];
  let arrGiaoVien = [];
  try {
    const arrLopNhomGot = await db.collection("lopnhoms").find().toArray();
    const arrNeededProps = ["id", "tenLopNhom", "giaoVienLopNhom"];
    arrLopNhom = layMangChuyenDoiDataTuMongodb(arrLopNhomGot, arrNeededProps);
  } catch (err) {
    client.close();
    return {
      notFound: true,
    };
  }
  try {
    const arrGvGot = await db.collection("giaoviens").find().toArray();
    const arrNeededProps = ["id", "shortName", "luongNhom"];
    arrGiaoVien = layMangChuyenDoiDataTuMongodb(arrGvGot, arrNeededProps);
  } catch (err) {
    client.close();
    return {
      notFound: true,
    };
  }

  return {
    props: {
      arrLopNhom,
      arrGiaoVien,
    },
    revalidate: 10,
  };
}

export default DiemDanhNhomRoute;
