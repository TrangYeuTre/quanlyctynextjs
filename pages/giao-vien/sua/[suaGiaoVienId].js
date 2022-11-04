import ThemGvPage from "../../../components/giaovien/ThemGv";

const SuaGiaoVienRoute = (props) => {
  //Dummy một hs được chọn
  const GV_DUMMY = {
    id: "gv2",
    gioiTinh: "nu",
    tenGiaoVien: "Công Nữ Thi Thy",
    shortName: "Thy Thy",
    ngaySinh: "1999-11-22",
    luongCaNhan: 180000,
    luongNhom: 100000,
    soDienThoai: "099828929",
    diaChi: "Xóm quận 8",
    thongTinCoBan:
      "Cô giáo thích ăn da heo",
  };
  //Trả
  return <ThemGvPage renderMode="sua" dataGiaoVien={GV_DUMMY} />;
};

//SSG lấy data học sinh cần sửa
// export async function getStaticProps() {}

//SSP lấy dah sách hs đẻ render satic
// export async function getStaticPaths() {}

export default SuaGiaoVienRoute;
