import { useRouter } from "next/router";
import { chuyenThangViewThanhNgay } from "../../../components/hocphi/hocphi_helper";
import TinhToanLuongPage from "../../../components/luong/TinhToanLuong";
import ConnectMongoDb from "../../../helper/connectMongodb";
import DataGiaoVien from "../../../classes/DataGiaoVien";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import {
  redirectPageAndResetState,
  layMangChuyenDoiDataTuMongodb,
} from "../../../helper/uti";
import Loading from "../../../components/UI/Loading";

const TinhToanLuongRoute = (props) => {
  const API_GET_DATA_DIEMDANH_ROUTE = "/api/luong/layDataDiemDanh";
  const { arrGiaoVien } = props;
  const router = useRouter();
  const giaoVienId = router.query.giaoVienId;
  const thangTinh = router.query.thangTinh;
  DataGiaoVien.loadArrGiaoVien(arrGiaoVien);
  const gvMatched = DataGiaoVien.timKiemGiaoVienTheoId(giaoVienId);
  DataGiaoVien.loadDataGiaoVienDuocChon(gvMatched);
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
    const layDataDiemDanh = async () => {
      startFetching();
      const response = await fetch(API_GET_DATA_DIEMDANH_ROUTE, {
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
    <TinhToanLuongPage
      arrDdcn={arrDdcn}
      arrDdn={arrDdn}
      ngayDauThang={chuyenThangViewThanhNgay(thangTinh)}
    />
  );
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

export default TinhToanLuongRoute;
