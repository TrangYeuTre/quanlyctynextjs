import DanhSachHocSinhPage from "../../components/hocsinh/DsHocSinh";

const DsHocSinhCaNhanRoute = (props) => {
  //Dummy mảng học sinh đã được lọc theo loiaj lớp nhé
  const DUMMY = [
    {
      id: "hs4",
      shortName: "Chó Hùa",
      gioiTinh: "nam",
      arrLoaiLop: ["canhan", "nhom"],
    },
    {
      id: "hs5",
      shortName: "Gà Què",
      gioiTinh: "nu",
      arrLoaiLop: ["nhom"],
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
