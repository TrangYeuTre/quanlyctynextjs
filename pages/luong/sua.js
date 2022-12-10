import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { chuyenThangViewThanhNgay } from "../../components/hocphi/hocphi_helper";
import ConnectMongoDb from "../../helper/connectMongodb";
import SuaLuongPage from "../../components/luong/SuaLuong";

const SuaLuongRoute = (props) => {
  const router = useRouter();
  const { arrGiaoVien } = props;
  //Lấy id lương tháng sửa
  const luongThangId = router.query.luongThangId;
  const giaoVienId = router.query.giaoVienId;
  const thangTinh = router.query.thangTinh;
  console.log(luongThangId, giaoVienId, thangTinh);

  //State lấy data lương thagns tìm được
  const [dataLuongThang, setDataLuongThang] = useState({});
  const [arrDdcn, setArrDdcn] = useState([]);
  const [arrDdn, setArrDdn] = useState([]);
  const [giaoVienChonData, setGvChonData] = useState({});
  //Side effct lấy data lương tháng
  useEffect(() => {
    const layDataLuongThang = async () => {
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
    };
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
    if (luongThangId && giaoVienId && thangTinh) {
      layDataLuongThang();
      layDataDiemDanh();
      //Xử lý lấy data của giáo viên được chọn
      const gvMatched = arrGiaoVien.find((item) => item.id === giaoVienId);
      if (gvMatched) {
        setGvChonData(gvMatched);
      }
    }
  }, [luongThangId, arrGiaoVien, giaoVienChonData, giaoVienId, thangTinh]);
  return (
    arrDdcn.length > 0 &&
    arrDdn.length > 0 &&
    Object.keys(giaoVienChonData).length > 0 &&
    Object.keys(dataLuongThang).length > 0 && (
      <SuaLuongPage
        arrDdcn={arrDdcn}
        arrDdn={arrDdn}
        giaoVienChonData={giaoVienChonData}
        ngayDauThang={chuyenThangViewThanhNgay(thangTinh)}
        dataLuongThang={dataLuongThang}
      />
    )
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

export default SuaLuongRoute;
