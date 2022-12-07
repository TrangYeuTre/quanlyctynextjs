import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { chuyenThangViewThanhNgay } from "../../../components/hocphi/hocphi_helper";

const TinhToanLuongRoute = (props) => {
  const router = useRouter();
  const giaoVienId = router.query.giaoVienId;
  const thangTinh = router.query.thangTinh;
  //State lấy data 2 mảng ddcn và ddn
  const [arrDdcn, setArrDdcn] = useState([]);
  const [arrDdn, setArrDdn] = useState([]);
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
      console.log(dataGot.thongbao);
      if (status === 201) {
        setArrDdcn(dataGot.arrDdcn);
        setArrDdn(dataGot.arrDdn);
      }
    };
    //Chạy func
    layDataDiemDanh();
  }, [giaoVienId, thangTinh]);

  return <h1>Tui test</h1>;
};

export default TinhToanLuongRoute;
