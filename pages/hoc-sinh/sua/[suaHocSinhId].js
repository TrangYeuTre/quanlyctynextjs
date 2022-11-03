import ThemHsPage from "../../../components/hocsinh/ThemHs";

const DsHocSinhCaNhanRoute = (props) => {
  //Dummy một hs được chọn
  const HS_DUMMY = {
    id: "hs1",
    canhan: true,
    nhom: true,
    gioiTinh: "nam",
    tenHocSinh: "Phan Văn Tèo Em",
    shortName: "Văn Tẻo",
    ngaySinh: "1991-03-04",
    soPhutHocMotTiet: 70,
    hocPhiCaNhan: 280000,
    hocPhiNhom: 0,
    tenPhuHuynh: "Phan Thị Nấu Nở",
    soDienThoai: "0399112221",
    diaChi: "Xóm xạo",
    thongTinCoBan:
      "Cậu bé đi ỉa, gặp phải con đĩa, nó rỉa cục cức, cậu bé ăn mứt.",
  };
  //Trả
  return <ThemHsPage renderMode="sua" dataHocSinh={HS_DUMMY} />;
};

//SSG lấy data học sinh cần sửa
// export async function getStaticProps() {}

//SSP lấy dah sách hs đẻ render satic
// export async function getStaticPaths() {}

export default DsHocSinhCaNhanRoute;
