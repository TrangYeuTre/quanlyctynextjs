import { useRouter } from "next/router";
import { chuyenThangViewThanhNgay } from "../../../components/hocphi/hocphi_helper";
import TinhToanLuongPage from "../../../components/luong/TinhToanLuong";
import ConnectMongoDb from "../../../helper/connectMongodb";
import DataGiaoVien from "../../../classes/DataGiaoVien";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";

const TinhToanLuongRoute = (props) => {
  const { arrGiaoVien } = props;
  DataGiaoVien.loadArrGiaoVien(arrGiaoVien);
  const router = useRouter();
  const giaoVienId = router.query.giaoVienId;
  const thangTinh = router.query.thangTinh;
  const gvMatched = DataGiaoVien.timKiemGiaoVienTheoId(giaoVienId);
  DataGiaoVien.loadDataGiaoVienDuocChon(gvMatched);
  //State lấy data 2 mảng ddcn và ddn
  const [arrDdcn, setArrDdcn] = useState([]);
  const [arrDdn, setArrDdn] = useState([]);
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

  //Side effect fetch lấy về data
  useEffect(() => {
    //Tạo func ascyn
    const layDataDiemDanh = async () => {
      const response = await fetch("/api/luong/layDataDiemDanh", {
        method: "POST",
        body: JSON.stringify({
          giaoVienId: giaoVienId,
          ngayDauThang: chuyenThangViewThanhNgay(thangTinh),
        }),
        headers: { "Content-Type": "application/json" },
      });
      const status = response.status;
      const dataGot = await response.json();
      if (status === 201) {
        setArrDdcn(dataGot.arrDdcn);
        setArrDdn(dataGot.arrDdn);
      }
    };
    //Chạy func
    layDataDiemDanh();
  }, [giaoVienId, thangTinh]);

  if (!isLoggedIn) {
    return <h1>Đang xử lý ...</h1>;
  }

  return (
    <TinhToanLuongPage
      arrDdcn={arrDdcn}
      arrDdn={arrDdn}
      ngayDauThang={chuyenThangViewThanhNgay(thangTinh)}
    />
  );
};

//SSG lấy data học sinh cần sửa
export async function getStaticProps() {
  let db, client;
  //Kết nối db
  try {
    const { clientGot, dbGot } = await ConnectMongoDb();
    db = dbGot;
    client = clientGot;
  } catch (err) {
    return {
      notFound: true,
    };
  }
  //Lấy về giáo viên theo id nào
  try {
    const arrGiaoVienGot = await db.collection("giaoviens").find().toArray();
    const arrGiaoVienConvert = arrGiaoVienGot.map((item) => {
      return {
        id: item._id.toString(),
        shortName: item.shortName,
        luongCaNhan: item.luongCaNhan,
        luongNhom: item.luongNhom,
      };
    });
    client.close();
    //Trả thôi
    return {
      props: {
        arrGiaoVien: arrGiaoVienConvert,
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

export default TinhToanLuongRoute;
