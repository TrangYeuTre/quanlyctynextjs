import ConnectMongodb from "../../../helper/connectMongodb";
import { ObjectId } from "mongodb";
import SuaLopNhomPage from "../../../components/lopnhom/SuaLopNhom";
import DataHocSinh from "../../../classes/DataHocSinh";
import DataGiaoVien from "../../../classes/DataGiaoVien";
import DataLopNhom from "../../../classes/DataLopNhom";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import {
  redirectPageAndResetState,
  layObjChuyenDoiDataTuMongodb,
} from "../../../helper/uti";
import Loading from "../../../components/UI/Loading";

const SuaLopNhomRoute = (props) => {
  //VARIABLE
  const [isLoggedIn, setLoggedIn] = useState(false);
  const { lopNhom, arrHocSinhNhom, arrGiaoVien } = props;
  DataHocSinh.loadArrHocSinhNhom(arrHocSinhNhom);
  DataGiaoVien.loadArrGiaoVien(arrGiaoVien);
  DataLopNhom.loadLopNhomData(lopNhom);
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
    return !isLoggedIn || !lopNhom || !arrHocSinhNhom || !arrGiaoVien;
  };
  if (isProcessing()) {
    return <Loading />;
  }

  return <SuaLopNhomPage />;
};

//SSG
export async function getStaticProps(context) {
  const lopNhomId = context.params.lopNhomId;

  let client, db;
  try {
    const { clientGot, dbGot } = await ConnectMongodb();
    client = clientGot;
    db = dbGot;
  } catch (err) {
    return {
      notFound: true,
    };
  }

  let lopNhom;
  let arrGiaoVien = [];
  let arrHocSinhNhom = [];
  try {
    const lopNhomFound = await db
      .collection("lopnhoms")
      .findOne({ _id: ObjectId(lopNhomId) });
    const arrNeededProps = [
      "lopNhomId",
      "tenLopNhom",
      "giaoVienLopNhom",
      "hocSinhLopNhom",
    ];
    const lopNhomConvert = layObjChuyenDoiDataTuMongodb(
      lopNhomFound,
      arrNeededProps
    );
    lopNhom = lopNhomConvert;
  } catch (err) {
    client.close();
    return {
      notFound: true,
    };
  }
  try {
    const arrHsNhomGot = await db
      .collection("hocsinhs")
      .find({ lopHoc: { $in: ["nhom"] } })
      .toArray();
    arrHocSinhNhom = arrHsNhomGot.map((hs) => {
      return {
        id: hs._id.toString(),
        shortName: hs.shortName,
        isSelected: false,
      };
    });
  } catch (err) {
    client.close();
    return {
      notFound: true,
    };
  }
  try {
    const arrGiaoVienGot = await db.collection("giaoviens").find().toArray();
    //COnver nó lại với _id để xài được
    arrGiaoVien = arrGiaoVienGot.map((gv) => {
      return {
        id: gv._id.toString(),
        shortName: gv.shortName,
        luongNhom: +gv.luongNhom,
        isSelected: false,
      };
    });
  } catch (err) {
    client.close();
    return {
      notFound: true,
    };
  }
  client.close();
  return {
    props: {
      lopNhom,
      arrGiaoVien,
      arrHocSinhNhom,
    },
    revalidate: 10,
  };
}

//SSP
export async function getStaticPaths() {
  let client, db;
  try {
    const { clientGot, dbGot } = await ConnectMongodb();
    client = clientGot;
    db = dbGot;
  } catch (err) {
    return {
      paths: [],
      fallback: false,
    };
  }
  try {
    const arrLopNhomGot = await db.collection("lopnhoms").find().toArray();
    const arrPath = arrLopNhomGot.map((lopnhom) => {
      return { params: { lopNhomId: lopnhom._id.toString() } };
    });
    client.close();
    return {
      paths: arrPath,
      fallback: "blocking",
    };
  } catch (err) {
    console.log(err);
    client.close();
    return {
      paths: [],
      fallback: false,
    };
  }
}

export default SuaLopNhomRoute;
