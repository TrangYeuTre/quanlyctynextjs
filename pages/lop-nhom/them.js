import ThemLopNhomPage from "../../components/lopnhom/ThemLopNhom";
import ChonNguoiProvider from "../../context/chonNguoiProvider";
import ConnectMongoDb from "../../helper/connectMongodb";
import DataHocSinh from "../../classes/DataHocSinh";
import DataGiaoVien from "../../classes/DataGiaoVien";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { redirectPageAndResetState } from "../../helper/uti";

const ThemLopNhomRoute = (props) => {
  //VARIABLES
  const [isLoggedIn, setLoggedIn] = useState(false);
  const { arrHsNhom, arrGiaoVien } = props;
  DataHocSinh.loadArrHocSinhNhom(arrHsNhom);
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
    return !isLoggedIn || !arrHsNhom || !arrGiaoVien;
  };
  if (isProcessing()) {
    return <h1>Đang xử lý ...</h1>;
  }

  return (
    <ChonNguoiProvider>
      <ThemLopNhomPage />
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
    return {
      notFound: true,
    };
  }

  let arrHsNhom = [];
  let arrGiaoVien = [];
  try {
    const arrHsNhomGot = await db
      .collection("hocsinhs")
      .find({ lopHoc: { $in: ["nhom"] } })
      .toArray();
    arrHsNhom = arrHsNhomGot.map((hs) => {
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
      arrHsNhom,
      arrGiaoVien,
    },
    revalidate: 10,
  };
}

export default ThemLopNhomRoute;
