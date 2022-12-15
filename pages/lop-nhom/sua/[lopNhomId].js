import ConnectMongodb from "../../../helper/connectMongodb";
import { ObjectId } from "mongodb";
import SuaLopNhomPage from "../../../components/lopnhom/SuaLopNhom";
import DataHocSinh from "../../../classes/DataHocSinh";
import DataGiaoVien from "../../../classes/DataGiaoVien";
import DataLopNhom from "../../../classes/DataLopNhom";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";

const SuaLopNhomRoute = (props) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
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
  if (!isLoggedIn) {
    return <h1>Đang xử lý ...</h1>;
  }

  const { lopNhom, arrHocSinhNhom, arrGiaoVien } = props;
  DataHocSinh.loadArrHocSinhNhom(arrHocSinhNhom);
  DataGiaoVien.loadArrGiaoVien(arrGiaoVien);
  DataLopNhom.loadLopNhomData(lopNhom);
  return <SuaLopNhomPage />;
};

//SSG
export async function getStaticProps(context) {
  //Lấy id lớp nhóm được chọn
  const lopNhomId = context.params.lopNhomId;
  //Kết nối đến db
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
  //Biến truyền props
  let lopNhom;
  let arrGiaoVien = [];
  let arrHocSinhNhom = [];
  //Tìm lớp nhóm tương ứng đế lấy data sửa
  try {
    const lopNhomFound = await db
      .collection("lopnhoms")
      .findOne({ _id: ObjectId(lopNhomId) });
    //Đổi lại _id của obj thành string
    const lopNhomConvert = {
      lopNhomId: lopNhomFound._id.toString(),
      tenLopNhom: lopNhomFound.tenLopNhom,
      giaoVienLopNhom: lopNhomFound.giaoVienLopNhom,
      hocSinhLopNhom: lopNhomFound.hocSinhLopNhom,
    };
    lopNhom = lopNhomConvert;
  } catch (err) {
    client.close();
    return {
      notFound: true,
    };
  }
  //Lấy mảng học sinh nhóm
  try {
    const arrHsNhomGot = await db
      .collection("hocsinhs")
      .find({ lopHoc: { $in: ["nhom"] } })
      .toArray();
    //COnver nó lại với _id để xài được
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
  //Lấy mảng giáo viên
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
  //Trả cuối
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
  //Kết nối đến db
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
  //Lấy mảng id của lớp nhóm về
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
