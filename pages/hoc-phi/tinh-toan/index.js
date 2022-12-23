import TinhToanHocPhiPage from "../../../components/hocphi/tinhToan/TinhToan";
import { useRouter } from "next/router";
import ConnectMongoDb from "../../../helper/connectMongodb";
import DataHocSinh from "../../../classes/DataHocSinh";
import Loading from "../../../components/UI/Loading";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import {
  redirectPageAndResetState,
  layMangChuyenDoiDataTuMongodb,
} from "../../../helper/uti";

const TinhToanHocPhiRoute = (props) => {
  //VARIABLES
  const { arrHocSinh } = props;
  const router = useRouter();
  const hocSinhId = router.query.hocSinhId;
  const thangTinh = router.query.thangTinh;
  DataHocSinh.loadArrHocSinhCaNhan(arrHocSinh);
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

  const isProcessing = () => {
    return !isLoggedIn || !arrHocSinh || !hocSinhId || !thangTinh;
  };
  if (isProcessing()) {
    return <Loading />;
  }

  return <TinhToanHocPhiPage hocSinhId={hocSinhId} thangTinh={thangTinh} />;
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

export default TinhToanHocPhiRoute;
