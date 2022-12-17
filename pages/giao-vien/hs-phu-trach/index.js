import HocSinhPhuTrachPage from "../../../components/giaovien/HsPhuTrach";
import GiaoVienProvider from "../../../context/giaoVienProvider";
import ConnectMongoDb from "../../../helper/connectMongodb";
import DataHocSinh from "../../../classes/DataHocSinh";
import DataGiaoVien from "../../../classes/DataGiaoVien";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { layMangChuyenDoiDataTuMongodb } from "../../../helper/uti";

const HocSinhPhuTrachRoute = (props) => {
  //VARIABLES
  const [isLoggedIn, setLoggedIn] = useState(false);
  const { arrGiaoVien, arrHocSinhCaNhan } = props;
  DataHocSinh.loadArrHocSinhCaNhan(arrHocSinhCaNhan);
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
    return !isLoggedIn || !arrGiaoVien || !arrHocSinhCaNhan;
  };
  if (isProcessing()) {
    return <h1>Đang xử lý ...</h1>;
  }

  return (
    <GiaoVienProvider>
      <HocSinhPhuTrachPage />
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

  let arrGiaoVien = [];
  let arrHocSinhCaNhan = [];
  try {
    const arrGiaoVienGot = await db.collection("giaoviens").find().toArray();
    const arrNeededProps = ["id", "shortName", "hocTroCaNhan"];
    const arrGiaoVienConvertedId = layMangChuyenDoiDataTuMongodb(
      arrGiaoVienGot,
      arrNeededProps
    );
    arrGiaoVien = arrGiaoVienConvertedId;
  } catch (err) {
    return {
      notFound: true,
    };
  }
  try {
    const arrHocSinhGot = await db
      .collection("hocsinhs")
      .find({ lopHoc: { $in: ["canhan"] } })
      .toArray();
    const arrNeededProps = ["id", "shortName", "soPhutHocMotTiet"];
    const arrHocSinhConverted = layMangChuyenDoiDataTuMongodb(
      arrHocSinhGot,
      arrNeededProps
    );
    const arrHsAddIsSelected = arrHocSinhConverted.map((item) => {
      return { ...item, isSelected: false };
    });
    arrHocSinhCaNhan = arrHsAddIsSelected;
  } catch (err) {
    return {
      notFound: true,
    };
  }
  //Trả cuối thôi
  return {
    props: {
      arrGiaoVien,
      arrHocSinhCaNhan,
    },
  };
}

export default HocSinhPhuTrachRoute;
