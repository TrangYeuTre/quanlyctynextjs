import DanhSachHocSinhPage from "../../components/hocsinh/DsHocSinh";

const DsHocSinhCaNhanRoute = (props) => {
  //Dummy mảng học sinh đã được lọc theo loiaj lớp nhé
  const DUMMY = [
    { id: "hs1", shortName: "Bèo", gioiTinh: "nu", arrLoaiLop: ["canhan"] },
    {
      id: "hs2",
      shortName: "Tí Sún",
      gioiTinh: "nam",
      arrLoaiLop: ["canhan", "nhom"],
    },
    {
      id: "hs3",
      shortName: "Công An",
      gioiTinh: "nu",
      arrLoaiLop: ["canhan"],
    },
    // {
    //   id: "gv1",
    //   shortName: "Boss Trang",
    //   gioiTinh: "nu",
    //   arrLoaiLop: [],
    // },
  ];
  return <DanhSachHocSinhPage arrHocSinhDaPhanLoai={DUMMY} />;
};

//SSG lấy mảng hs cá nhân từ db
// export async function getStaticProps() {}

export default DsHocSinhCaNhanRoute;
