import ConnectMongoDb from "../../../helper/connectMongodb";
import { ObjectId } from "mongodb";
import GanLichChoHsPage from "../../../components/giaovien/GanLichChoHs";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import DataGiaoVien from "../../../classes/DataGiaoVien";
import {
  redirectPageAndResetState,
  layObjChuyenDoiDataTuMongodb,
  layMangChuyenDoiDataTuMongodb,
} from "../../../helper/uti";
import Loading from "../../../components/UI/Loading";

const GanLichChoHocTroCuaGiaoVienDuocChonRoute = (props) => {
  //VARIABLE
  const [isLoggedIn, setLoggedIn] = useState(false);
  const { giaoVien } = props;
  const { hocTroCaNhan } = giaoVien;
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
    return !isLoggedIn || !giaoVien || Object.keys(giaoVien).length === 0;
  };
  if (isProcessing()) {
    return <Loading />;
  }

  return <GanLichChoHsPage arrHocTroCaNhan={hocTroCaNhan} />;
};

//SSG
export async function getStaticProps(context) {
  const giaoVienId = context.params.giaoVienId;

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
    const arrNeededProps = ["id", "shortName", "hocTroCaNhan"];
    const giaoVienConvertedId = layObjChuyenDoiDataTuMongodb(
      giaoVienGot,
      arrNeededProps
    );
    return {
      props: {
        giaoVien: giaoVienConvertedId,
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
    const arrGiaoVienIdConverted = layMangChuyenDoiDataTuMongodb(
      arrGiaoVienGot,
      ["id"]
    );
    const arrPaths = arrGiaoVienIdConverted.map((id) => {
      return {
        params: {
          giaoVienId: id.id,
        },
      };
    });
    client.close();
    //Trả thôi
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
export default GanLichChoHocTroCuaGiaoVienDuocChonRoute;
