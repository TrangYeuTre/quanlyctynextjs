import ThongKeGiaoVienPage from "../../components/ddcn/ThongKeGiaoVien";
import ConnectMongo from "../../helper/connectMongodb";
import ChonNguoiProvider from "../../context/chonNguoiProvider";
import { redirectPageAndResetState } from "../../helper/uti";
import { useState, useEffect } from "react";
import DataGiaoVien from "../../classes/DataGiaoVien";
import DataDiemDanhCaNhan from "../../classes/DataDiemDanhCaNhan";
import Loading from "../../components/UI/Loading";
import { getSession } from "next-auth/react";
import {
  convertInputDateFormat,
  layMangChuyenDoiDataTuMongodb,
} from "../../helper/uti";

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
    return <Loading />;
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

  try {
    const arrGiaoVienGot = await db.collection("giaoviens").find().toArray();
    const arrNeededProps = ["id", "shortName"];
    const arrGiaoVien = layMangChuyenDoiDataTuMongodb(
      arrGiaoVienGot,
      arrNeededProps
    );
    client.close();
    return {
      props: {
        arrGiaoVien,
      },
    };
  } catch (err) {
    client.close();
    return {
      notFound: true,
    };
  }
}

export default ThongKeGiaoVienRoute;
