import ThemGvPage from "../../../components/giaovien/ThemGv";
import ConnectMongoDb from "../../../helper/connectMongodb";
import { ObjectId } from "mongodb";
import DataGiaoVien from "../../../classes/DataGiaoVien";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import {
  redirectPageAndResetState,
  layObjChuyenDoiDataTuMongodb,
  layMangChuyenDoiDataTuMongodb,
} from "../../../helper/uti";

const SuaGiaoVienRoute = (props) => {
  //VARIABLES
  const [isLoggedIn, setLoggedIn] = useState(false);
  const { giaoVien } = props;
  DataGiaoVien.loadDataGiaoVienDuocChon(giaoVien);

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
    return !isLoggedIn || !giaoVien;
  };
  if (isProcessing()) {
    return <h1>Đang xử lý ...</h1>;
  }

  return <ThemGvPage renderMode="sua" />;
};

//SSG
export async function getStaticProps(context) {
  const giaoVienId = context.params.suaGiaoVienId;

  let db, client;
  try {
    const { clientGot, dbGot } = await ConnectMongoDb();
    db = dbGot;
    client = clientGot;
  } catch (err) {
    return {
      notFound: true,
    };
  }

  try {
    const giaoVienGot = await db
      .collection("giaoviens")
      .findOne({ _id: ObjectId(giaoVienId) });
    const arrNeededProps = [
      "id",
      "tenGiaoVien",
      "shortName",
      "gioiTinh",
      "ngaySinh",
      "luongCaNhan",
      "luongNhom",
      "soDienThoai",
      "diaChi",
      "thongTinCoBan",
    ];
    const giaoVienConvert = layObjChuyenDoiDataTuMongodb(
      giaoVienGot,
      arrNeededProps
    );
    client.close();
    return {
      props: {
        giaoVien: giaoVienConvert,
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

// SSP
export async function getStaticPaths() {
  let db, client;
  try {
    const { clientGot, dbGot } = await ConnectMongoDb();
    db = dbGot;
    client = clientGot;
  } catch (err) {
    return {
      notFound: true,
    };
  }

  try {
    const arrGiaoVienGot = await db.collection("giaoviens").find().toArray();
    const arrGiaoVienIds = layMangChuyenDoiDataTuMongodb(arrGiaoVienGot, [
      "id",
    ]);
    const arrPaths = arrGiaoVienIds.map((id) => {
      return {
        params: {
          suaGiaoVienId: id.id,
        },
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

export default SuaGiaoVienRoute;
