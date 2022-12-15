import DanhSachLopNhomPage from "../../components/lopnhom/DanhSachLopNhom";
import ConnectMongodb from "../../helper/connectMongodb";
import DataLopNhom from "../../classes/DataLopNhom";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";

const DanhSachLopNhomRoute = (props) => {
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

  const { arrLopNhom } = props;
  DataLopNhom.loadArrLopNhom(arrLopNhom);
  return <DanhSachLopNhomPage />;
};

//SSG đẻ load ds lớp nhóm
export async function getStaticProps() {
  //Kết nối db
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
  //Lấy ds lớp nhóm nào
  try {
    const arrLopNhomGot = await db.collection("lopnhoms").find().toArray();
    const arrLopNhom = arrLopNhomGot.map((lopnhom) => {
      return {
        id: lopnhom._id.toString(),
        tenLopNhom: lopnhom.tenLopNhom,
        giaoVienLopNhom: lopnhom.giaoVienLopNhom,
        hocSinhLopNhom: lopnhom.hocSinhLopNhom,
      };
    });
    //Trả
    client.close();
    return {
      props: {
        arrLopNhom,
      },
      revalidate: 10,
    };
  } catch (err) {
    console.log(err);
    client.close();
    return {
      notFound: true,
    };
  }
}

export default DanhSachLopNhomRoute;
