import { useRouter } from "next/router";
import ConnectMongoDb from "../../helper/connectMongodb";
import SuaHocPhiPage from "../../components/hocphi/tinhToan/SuaHocPhi";

const SuaHocPhiRoute = (props) => {
  const { arrHocSinh } = props;
  const router = useRouter();
  const hocSinhId = router.query.hocSinhId;
  const thangTinh = router.query.thangTinh;

  return (
    <SuaHocPhiPage
      hocSinhId={hocSinhId}
      thangTinh={thangTinh}
      arrHocSinh={arrHocSinh}
    />
  );
};

//SSG lây mảng học sinh cá nhân ở để tính
export async function getStaticProps() {
  //Fetch trực tiếp lên mongodb đẻ lấy mảng học sinh luôn, không cần thông api nội bộ làm gì
  let client, db;
  //Kết nối db trước
  try {
    const { clientGot, dbGot } = await ConnectMongoDb();
    client = clientGot;
    db = dbGot;
  } catch (err) {
    return { notFound: true };
  }
  // Lấy về mảng học sinh
  try {
    const arrHocSinhGot = await db
      .collection("hocsinhs")
      .find({ lopHoc: { $in: ["canhan"] } })
      .toArray();
    const arrHocSinhConvertId = arrHocSinhGot.map((item) => {
      return {
        id: item._id.toString(),
        tenHocSinh: item.tenHocSinh,
        shortName: item.shortName,
        lopHoc: item.lopHoc,
        gioiTinh: item.gioiTinh,
        soPhutHocMotTiet: item.soPhutHocMotTiet,
        hocPhiCaNhan: item.hocPhiCaNhan,
        hocPhiNhom: item.hocPhiNhom,
        ngaySinh: item.ngaySinh,
        tenPhuHuynh: item.tenPhuHuynh,
        soDienThoai: item.soDienThoai,
        diaChi: item.diaChi,
      };
    });
    //Đóng client
    client.close();
    //Trả
    return {
      props: {
        arrHocSinh: arrHocSinhConvertId,
      },
      revalidate: 10,
    };
  } catch (err) {
    client.close();
    return { notFound: true };
  }
}

export default SuaHocPhiRoute;
