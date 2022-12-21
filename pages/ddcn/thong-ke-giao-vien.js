import ThongKeGiaoVienPage from "../../components/ddcn/ThongKeGiaoVien";
import ConnectMongo from "../../helper/connectMongodb";
import ChonNguoiProvider from "../../context/chonNguoiProvider";
import { redirectPageAndResetState } from "../../helper/uti";
import { useState, useEffect, useContext } from "react";
import DataGiaoVien from "../../classes/DataGiaoVien";
import DataDiemDanhCaNhan from "../../classes/DataDiemDanhCaNhan";
import { getSession } from "next-auth/react";
import { convertInputDateFormat } from "../../helper/uti";

const ThongKeGiaoVienRoute = (props) => {
  //VARIABLES
  const { arrGiaoVien } = props;
  const [isLoggedIn, setLoggedIn] = useState(false);
  DataGiaoVien.loadArrGiaoVien(arrGiaoVien);
  const [isFetching, setFetching] = useState(false);
  const [ngayThongKe, setNgayThongKe] = useState(new Date());
  const [arrDdcnOfThisMonth, setArrDdcnOfThisMonth] = useState([]);
  const [giaoVienChonId, setGiaoVienChonId] = useState();

  //CALLBACKS
  const thietLapNgayThongKeHandler = (date) => {
    setNgayThongKe(new Date(date));
  };
  const thietLapGiaoVienChonIdHandler = (id) => {
    setGiaoVienChonId(id);
  };
  const startFetching = () => {
    setFetching(true);
  };
  const endFetching = () => {
    setFetching(false);
  };

  //SIDE EFFECT
  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
        redirectPageAndResetState("/auth/login");
      }
    });
  }, []);

  useEffect(() => {
    const isAccessSubmit = () => {
      return giaoVienChonId && giaoVienChonId !== "";
    };
    if (!isAccessSubmit()) {
      return;
    }
    const createDataSubmit = () => {
      return {
        ngayThongKe: convertInputDateFormat(ngayThongKe),
        giaoVienId: giaoVienChonId,
      };
    };
    const dataSubmit = createDataSubmit();

    const fetchLoadDiemDanhCaNhanByNgayVaGiaoVien = async () => {
      startFetching();
      const { statusCode, dataGot } =
        await DataDiemDanhCaNhan.loadArrDdcnByNgayVaGiaoVienId(dataSubmit);
      if (statusCode === 201) {
        setArrDdcnOfThisMonth(dataGot.data);
      } else {
        setArrDdcnOfThisMonth([]);
      }
      endFetching();
    };
    fetchLoadDiemDanhCaNhanByNgayVaGiaoVien();
  }, [giaoVienChonId, ngayThongKe]);

  const isProcessing = () => {
    return !isLoggedIn || isFetching;
  };
  if (isProcessing()) {
    return <h1>Đang xử lý ...</h1>;
  }

  return (
    <ChonNguoiProvider>
      <ThongKeGiaoVienPage
        ngayThongKe={ngayThongKe}
        thietLapNgayThongKe={thietLapNgayThongKeHandler}
        thietLapGiaoVienChonId={thietLapGiaoVienChonIdHandler}
        arrDdcnOfThisMonth={arrDdcnOfThisMonth}
      />
    </ChonNguoiProvider>
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
  // //Tạo biến ngày hiện tại để lọc data
  // const now = new Date();
  // //Từ biến now này lấy ngày đầu của tháng trước và ngày cuối của tháng này để làm biên lọc data mongodb
  // const { firstDateOfThisMonth, lastDateOfThisMonth } =
  //   getFirstLastDateOfThisMonth(now);
  // const { firstDateOfPrevMonth, lastDateOfPrevMonth } =
  //   getFirstLastDateOfPrevMonth(now);
  // //Ta có 2 biên lọc
  // //   console.log(firstDateOfPrevMonth, lastDateOfThisMonth);
  // let arrDiemDanhCaNhanFilter = [];
  // //Lấy mảng điểm danh cá nhân
  // try {
  //   const arrDdcn = await db
  //     .collection("diemdanhcanhans")
  //     .find({
  //       ngayDiemDanh: {
  //         $gte: firstDateOfPrevMonth,
  //         $lte: lastDateOfThisMonth,
  //       },
  //     })
  //     .toArray();
  //   //Convert id
  //   arrDdcn.forEach((item) => (item._id = item._id.toString()));
  //   arrDiemDanhCaNhanFilter = arrDdcn;
  // } catch (err) {
  //   client.close();
  //   return {
  //     notFound: true,
  //   };
  // }
  //Trả cuối
  client.close();
  return {
    props: {
      arrGiaoVien,
      // arrDiemDanhCaNhanFilter,
    },
  };
}

export default ThongKeGiaoVienRoute;
