import ThemLopNhomPage from "../../components/lopnhom/ThemLopNhom";
import ChonNguoiProvider from "../../context/chonNguoiProvider";
import ConnectMongoDb from "../../helper/connectMongodb";
import DataHocSinh from "../../classes/DataHocSinh";
import DataGiaoVien from "../../classes/DataGiaoVien";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";

const ThemLopNhomRoute = (props) => {
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

  //Lấy về mảng
  const { arrHsNhom, arrGiaoVien } = props;
  //Set class học sinh
  DataHocSinh.loadArrHocSinhNhom(arrHsNhom);
  DataGiaoVien.loadArrGiaoVien(arrGiaoVien);
  return (
    <ChonNguoiProvider>
      <ThemLopNhomPage />
    </ChonNguoiProvider>
  );
};

export default ThemLopNhomRoute;

//SSG phải load ds giáo viên và học sinh nhóm
export async function getStaticProps() {
  //Kết nối đến db
  let client, db;
  try {
    const { clientGot, dbGot } = await ConnectMongoDb();
    client = clientGot;
    db = dbGot;
  } catch (err) {
    return {
      notFound: true,
    };
  } //end kết nối
  //Lấy mảng học sinh nhóm
  let arrHsNhom = [];
  try {
    const arrHsNhomGot = await db
      .collection("hocsinhs")
      .find({ lopHoc: { $in: ["nhom"] } })
      .toArray();
    //COnver nó lại với _id để xài được
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
  } //end lấy mảng học sinh nhóm
  //Lấy mảng giáo viên
  let arrGiaoVien = [];
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
  } //end lấy mảng giáo viên
  //ổn thì trả lại render thôi nào
  client.close();
  return {
    props: {
      arrHsNhom,
      arrGiaoVien,
    },
    revalidate: 10,
  };
}
