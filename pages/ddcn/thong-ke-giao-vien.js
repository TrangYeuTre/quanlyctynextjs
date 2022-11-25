import ThongKeGiaoVienPage from "../../components/ddcn/ThongKeGiaoVien";
import ConnectMongo from "../../helper/connectMongodb";
import GiaoVienProvider from "../../context/giaoVienProvider";
import ChonNguoiProvider from "../../context/chonNguoiProvider";
import {
  getFirstLastDateOfPrevMonth,
  getFirstLastDateOfThisMonth,
} from "../../helper/uti";
import { useState, useEffect } from "react";

const ThongKeGiaoVienRoute = (props) => {
  const { arrGiaoVien, arrDiemDanhCaNhanFilter } = props;
  //State loading
  const [loading, setLoading] = useState(true);
  //   Side effect set loading
  useEffect(() => {
    if (arrGiaoVien && arrDiemDanhCaNhanFilter) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [arrGiaoVien, arrDiemDanhCaNhanFilter]);
  return (
    <GiaoVienProvider>
      <ChonNguoiProvider>
        {loading && <h1 style={{ color: "var(--mauMh4--)" }}>Đang load ...</h1>}
        {!loading && (
          <ThongKeGiaoVienPage
            arrGiaoVien={arrGiaoVien}
            arrDiemDanhCaNhan={arrDiemDanhCaNhanFilter}
          />
        )}
      </ChonNguoiProvider>
    </GiaoVienProvider>
  );
};

//SSG
export async function getStaticProps() {
  //Kết nối db trước
  let client, db;
  try {
    const { clientGot, dbGot } = await ConnectMongo();
    client = clientGot;
    db = dbGot;
  } catch (err) {
    return {
      notFound: true,
    };
  }
  //Lấy mảng giáo viên về
  let arrGiaoVien = [];
  //Lấy mảng điêm danh cá nhân của giáo viên
  try {
    const arrGiaoVienGot = await db.collection("giaoviens").find().toArray();
    //Map lại mảng giáo viên với _id thành id string
    //Chú ý: chỉ map lại mảng có các prop cần thiết
    const arrGiaoVienConvert = arrGiaoVienGot.map((gv) => {
      return {
        id: gv._id.toString(),
        shortName: gv.shortName,
      };
    });
    arrGiaoVien = arrGiaoVienConvert;
  } catch (err) {
    client.close();
    return {
      notFound: true,
    };
  } //end try-catch lấy ds giáo viên
  //Tạo biến ngày hiện tại để lọc data
  const now = new Date();
  //Từ biến now này lấy ngày đầu của tháng trước và ngày cuối của tháng này để làm biên lọc data mongodb
  const { firstDateOfThisMonth, lastDateOfThisMonth } =
    getFirstLastDateOfThisMonth(now);
  const { firstDateOfPrevMonth, lastDateOfPrevMonth } =
    getFirstLastDateOfPrevMonth(now);
  //Ta có 2 biên lọc
  //   console.log(firstDateOfPrevMonth, lastDateOfThisMonth);
  let arrDiemDanhCaNhanFilter = [];
  //Lấy mảng điểm danh cá nhân
  try {
    const arrDdcn = await db
      .collection("diemdanhcanhans")
      .find({
        ngayDiemDanh: {
          $gte: firstDateOfPrevMonth,
          $lte: lastDateOfThisMonth,
        },
      })
      .toArray();
    //Convert id
    arrDdcn.forEach((item) => (item._id = item._id.toString()));
    arrDiemDanhCaNhanFilter = arrDdcn;
  } catch (err) {
    console.log(err);
    client.close();
    return {
      notFound: true,
    };
  }
  //Trả cuối
  client.close();
  return {
    props: {
      arrGiaoVien,
      arrDiemDanhCaNhanFilter,
    },
  };
}

export default ThongKeGiaoVienRoute;
