import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { chuyenThangViewThanhNgay } from "../../../components/hocphi/hocphi_helper";
import TinhToanLuongPage from "../../../components/luong/TinhToanLuong";
import ConnectMongoDb from "../../../helper/connectMongodb";

const TinhToanLuongRoute = (props) => {
  const { arrGiaoVien } = props;

  const router = useRouter();
  const giaoVienId = router.query.giaoVienId;
  const thangTinh = router.query.thangTinh;
  //State lấy data 2 mảng ddcn và ddn
  const [arrDdcn, setArrDdcn] = useState([]);
  const [arrDdn, setArrDdn] = useState([]);
  const [giaoVienChonData, setGvChonData] = useState({});
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
    //Xử lý lấy data của giáo viên được chọn
    const gvMatched = arrGiaoVien.find((item) => item.id === giaoVienId);
    if (gvMatched) {
      setGvChonData(gvMatched);
    }
  }, [giaoVienId, thangTinh, arrGiaoVien, giaoVienChonData]);

  return (
    <TinhToanLuongPage
      arrDdcn={arrDdcn}
      arrDdn={arrDdn}
      giaoVienChonData={giaoVienChonData}
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
