import DanhSachGiaoVienPage from "../../components/giaovien/DsGiaoVien";

const DsHocSinhCaNhanRoute = (props) => {
  //Dummy mảng giáo viên
  const DUMMY = [
    {
      id: "gv1",
      shortName: "Boss Trang",
      gioiTinh: "nu",
    },
    {
      id: "gv2",
      shortName: "Thy Thy",
      gioiTinh: "nu",
    },
    {
      id: "gv3",
      shortName: "Trâm Lớn",
      gioiTinh: "nu",
    },
    {
      id: "gv4",
      shortName: "Nghĩa culi",
      gioiTinh: "nam",
    },
  ];
  return <DanhSachGiaoVienPage arrGiaoVienGot={DUMMY} />;
};

//SSG lấy mảng hs cá nhân từ db
// export async function getStaticProps() {}

export default DsHocSinhCaNhanRoute;
