import ThemHsPage from "../../../components/hocsinh/ThemHs";
import ConnectMongoDb from "../../../helper/connectMongodb";
import { ObjectId } from "mongodb";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import {
  redirectPageAndResetState,
  layObjChuyenDoiDataTuMongodb,
  layMangChuyenDoiDataTuMongodb,
} from "../../../helper/uti";

const SuaHocSinhRoute = (props) => {
  //VARIABLES
  const { dataHocSinhSua } = props;
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
    return <h1>Đang xử lý ...</h1>;
  }

  return <ThemHsPage renderMode="sua" dataHocSinh={dataHocSinhSua} />;
};

//SSG
export async function getStaticProps(context) {
  const idHocSinhSua = context.params.suaHocSinhId;

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

  try {
    const hocSinhTonTai = await db
      .collection("hocsinhs")
      .findOne({ _id: ObjectId(idHocSinhSua) });
    const arrNeededProps = [
      "id",
      "tenHocSinh",
      "shortName",
      "lopHoc",
      "gioiTinh",
      "soPhutHocMotTiet",
      "hocPhiCaNhan",
      "hocPhiNhom",
      "ngaySinh",
      "tenPhuHuynh",
      "soDienThoai",
      "diaChi",
      "thongTinCoBan",
    ];
    const hocSinhConverted = layObjChuyenDoiDataTuMongodb(
      hocSinhTonTai,
      arrNeededProps
    );

    client.close();
    return {
      props: {
        dataHocSinhSua: hocSinhConverted,
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

//SSP
export async function getStaticPaths() {
  let client, db;
  try {
    const { clientGot, dbGot } = await ConnectMongoDb();
    client = clientGot;
    db = dbGot;
  } catch (err) {
    return {
      paths: [],
      fallback: false,
    };
  }

  try {
    const arrHocSinh = await db.collection("hocsinhs").find().toArray();
    const arrHocSinhId = layMangChuyenDoiDataTuMongodb(arrHocSinh, [
      "hocSinhId",
    ]);
    const arrPaths = arrHocSinhId.map((id) => {
      return {
        params: { suaHocSinhId: id.hocSinhId },
      };
    });
    client.close();
    return {
      paths: arrPaths,
      fallback: "blocking",
    };
  } catch (err) {
    client.close();
    return {
      paths: [],
      fallback: false,
    };
  }
}

export default SuaHocSinhRoute;
