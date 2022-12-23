import ConnectMongoDb from "../../../helper/connectMongodb";
import ChonNguoiProvider from "../../../context/chonNguoiProvider";
import HocPhiDauVaoPage from "../../../components/hocphi/dauVao/HocPhiDauVao";
import DataHocSinh from "../../../classes/DataHocSinh";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import {
  redirectPageAndResetState,
  layMangChuyenDoiDataTuMongodb,
} from "../../../helper/uti";
import Loading from "../../../components/UI/Loading";

const HocPhiDauVaoRoute = (props) => {
  //VARIABLES
  const [isLoggedIn, setLoggedIn] = useState(false);
  const { arrHocSinh } = props;
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

  const isProcessing = () => {
    return !isLoggedIn || !arrHocSinh;
  };
  if (isProcessing()) {
    return <Loading />;
  }

  return (
    <ChonNguoiProvider>
      <HocPhiDauVaoPage />
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
    const arrHocSinhGot = await db
      .collection("hocsinhs")
      .find({ lopHoc: { $in: ["canhan"] } })
      .toArray();
    const arrNeededProps = [
      "id",
      "tenHocSinh",
      "shortName",
      "lopHoc",
      "gioiTinh",
      "soPhutHocMotTiet",
      "hocPhiNhom",
      "hocPhiCaNhan",
      "ngaySinh",
      "tenPhuHuynh",
      "soDienThoai",
      "diaChi",
    ];
    const arrHocSinh = layMangChuyenDoiDataTuMongodb(
      arrHocSinhGot,
      arrNeededProps
    );
    client.close();
    return {
      props: {
        arrHocSinh,
      },
      revalidate: 10,
    };
  } catch (err) {
    client.close();
    return { notFound: true };
  }
}
export default HocPhiDauVaoRoute;
