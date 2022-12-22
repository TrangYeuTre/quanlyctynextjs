import ConnectMongoDb from "../../helper/connectMongodb";
import ThongKeHocSinhPage from "../../components/ddcn/ThongKeHocSinh";
import ChonNguoiProvider from "../../context/chonNguoiProvider";
import {
  layMangChuyenDoiDataTuMongodb,
  redirectPageAndResetState,
} from "../../helper/uti";
import DataHocSinh from "../../classes/DataHocSinh";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import Loading from "../../components/UI/Loading";

const ThongKeHocSinhRoute = (props) => {
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
      {" "}
      <ThongKeHocSinhPage />
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
      "lopHoc",
      "gioiTinh",
      "tenHocSinh",
      "shortName",
      "ngaySinh",
      "soPhutHocMotTiet",
      "hocPhiCaNhan",
      "hocPhiNhom",
      "tenPhuHuynh",
      "soDienThoai",
      "diaChi",
      "thongTinCoBan",
    ];
    const arrHocSinh = layMangChuyenDoiDataTuMongodb(
      arrHocSinhGot,
      arrNeededProps
    );
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

export default ThongKeHocSinhRoute;
