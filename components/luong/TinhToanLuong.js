import LuongCaNhan from "./caNhan/CaNhan";
import LuongNhom from "./nhom/LuongNhom";
import PhuPhi from "./phuphi/Phuphi";
import { Fragment, useState, useEffect } from "react";
import Card from "../UI/Card";

const TinhToanLuongPage = (props) => {
  //Lấy về data ddcn và ddn của giáo viên
  const { arrDdcn, arrDdn, giaoVienChonData } = props;
  //State lấy data lương cá nhân
  const [dataLuongCaNhan, setDataLuongCaNhan] = useState([]);
  //Cb lấy data lương cá nhân
  const layDataLuongCaNhanHandler = (data) => {
    setDataLuongCaNhan(data);
  };
  //State data lương nhớm
  const [dataLuongNhom, setDataLuongNhom] = useState([]);
  //cb lấy data lương nhóm
  const layDataLuongNhomHandler = (data) => {
    setDataLuongNhom(data);
  };
  //State data phụ phí
  const [dataPhuPhi, setDataPhuPhi] = useState([]);
  //cb lấy data phụ phí
  const layDataPhuPhiHandler = (data) => {
    setDataPhuPhi(data);
  };
  console.log(dataLuongCaNhan);
  console.log(dataLuongNhom);
  console.log(dataPhuPhi);
  //Side effect thêm phần ghi chú vào mảng dd nhóm, chạy 1 lần load thôi
  useEffect(() => {
    const arrDdnThemGhiChu = arrDdn.map((item) => {
      return { ...item, ghiChu: "", luongNhom: +giaoVienChonData.luongNhom };
    });
    //Sơrt lại theo ngày cái
    arrDdnThemGhiChu.sort((a, b) =>
      new Date(a.ngayDiemDanh) < new Date(b.ngayDiemDanh) ? -1 : 1
    );
    setDataLuongNhom(arrDdnThemGhiChu);
  }, [arrDdn, giaoVienChonData]);
  //Trả
  return (
    <Card>
      <LuongCaNhan
        arrDdcn={arrDdcn}
        giaoVienChonData={giaoVienChonData}
        layDataLuongCaNhan={layDataLuongCaNhanHandler}
      />
      <LuongNhom
        arrDdn={dataLuongNhom}
        layDataLuongNhom={layDataLuongNhomHandler}
      />
      <PhuPhi layDataPhuPhi={layDataPhuPhiHandler} />
    </Card>
  );
};

export default TinhToanLuongPage;
