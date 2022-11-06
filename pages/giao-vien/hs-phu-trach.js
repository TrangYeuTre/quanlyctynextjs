import HocSinhPhuTrachPage from "../../components/giaovien/HsPhuTrach";
import GiaoVienProvider from "../../context/giaoVienProvider";

const HocSinhPhuTrachRoute = (props) => {
  //Bọc provider dùng nội bộ trong tính năng học sinh phụ trách này thôi

  return (
    <GiaoVienProvider>
      <HocSinhPhuTrachPage />
    </GiaoVienProvider>
  );
};

export default HocSinhPhuTrachRoute;
