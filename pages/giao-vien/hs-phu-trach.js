import HocSinhPhuTrachPage from "../../components/giaovien/HsPhuTrach";
import GiaoVienProvider from "../../context/giaoVienProvider";
import HocSinhProvider from "../../context/hocSinhProvider";

const HocSinhPhuTrachRoute = (props) => {
  //Bọc provider dùng nội bộ trong tính năng học sinh phụ trách này thôi

  return (
    <GiaoVienProvider>
      <HocSinhProvider>
        <HocSinhPhuTrachPage />
      </HocSinhProvider>
    </GiaoVienProvider>
  );
};

export default HocSinhPhuTrachRoute;
