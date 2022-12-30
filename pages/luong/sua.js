import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { chuyenThangViewThanhNgay } from "../../components/hocphi/hocphi_helper";
import ConnectMongoDb from "../../helper/connectMongodb";
import SuaLuongPage from "../../components/luong/SuaLuong";
import DataGiaoVien from "../../classes/DataGiaoVien";
import { getSession } from "next-auth/react";
import {
  redirectPageAndResetState,
  layMangChuyenDoiDataTuMongodb,
} from "../../helper/uti";
import Loading from "../../components/UI/Loading";

const SuaLuongRoute = (props) => {
  //VARIABLES
  const router = useRouter();
  const { arrGiaoVien } = props;
  const luongThangId = router.query.luongThangId;
  const giaoVienId = router.query.giaoVienId;
  const thangTinh = router.query.thangTinh;
  DataGiaoVien.loadArrGiaoVien(arrGiaoVien);
  const giaoVienChonData = DataGiaoVien.timKiemGiaoVienTheoId(giaoVienId);
  DataGiaoVien.loadDataGiaoVienDuocChon(giaoVienChonData);
  const [dataLuongThang, setDataLuongThang] = useState({});
  const [arrDdcn, setArrDdcn] = useState([]);
  const [arrDdn, setArrDdn] = useState([]);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  //CB
  const startFetching = () => {
    setIsFetching(true);
  };
  const endFetching = () => {
    setIsFetching(false);
  };

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
  useEffect(() => {
    const isAllowLayDataLuongThang = () => {
      return luongThangId && luongThangId !== "";
    };
    if (!isAllowLayDataLuongThang()) {
      return;
    }
    const layDataLuongThang = async () => {
      startFetching();
      const response = await fetch("/api/luong/layDataLuongThang", {
        method: "POST",
        body: JSON.stringify(luongThangId),
        headers: { "Content-Type": "application/json" },
      });
      const statusCode = response.status;
      const dataGot = await response.json();
      if (statusCode === 201) {
        setDataLuongThang(dataGot.data);
      }
      endFetching();
    };
    layDataLuongThang();
  }, [luongThangId]);
  useEffect(() => {
    const isAllowLayDataDiemDanh = () => {
      return giaoVienId && thangTinh && giaoVienId !== "" && thangTinh !== "";
    };
    if (!isAllowLayDataDiemDanh()) {
      return;
    }
    const layDataDiemDanh = async () => {
      startFetching();
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
      endFetching();
    };
    layDataDiemDanh();
  }, [giaoVienId, thangTinh]);

  const isProcessing = () => {
    return !isLoggedIn || isFetching || !arrGiaoVien;
  };
  if (isProcessing()) {
    return <Loading />;
  }

  return (
    // arrDdcn.length > 0 &&
    // arrDdn.length > 0 && (
    // Object.keys(giaoVienChonData).length > 0 &&
    // Object.keys(dataLuongThang).length > 0 && (
    <SuaLuongPage
      arrDdcn={arrDdcn}
      arrDdn={arrDdn}
      ngayDauThang={chuyenThangViewThanhNgay(thangTinh)}
      dataLuongThang={dataLuongThang}
    />
  );
  // )
  // );
};

//SSG
export async function getStaticProps() {
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
    const arrNeededProps = ["id", "shortName", "luongCaNhan", "luongNhom"];
    const arrGiaoVien = layMangChuyenDoiDataTuMongodb(
      arrGiaoVienGot,
      arrNeededProps
    );
    client.close();
    return {
      props: {
        arrGiaoVien,
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

export default SuaLuongRoute;
