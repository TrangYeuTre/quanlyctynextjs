import ThemHsPage from "../../../components/hocsinh/ThemHs";
// import ConnectMongoDb from "../../../helper/connectMongodb";
// import { ObjectId } from "mongodb";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import {
  redirectPageAndResetState,
  layObjChuyenDoiDataTuMongodb,
  layMangChuyenDoiDataTuMongodb,
} from "../../../helper/uti";
import { useRouter } from "next/router";
import DataHocSinh from "../../../classes/DataHocSinh";

const SuaHocSinhRoute = (props) => {
  //VARIABLES
  const router = useRouter();
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [dataHocSinhSua, setDataHocSinhSua] = useState();
  const hocSinhId = router.query.hocSinhId;
  //FUNCITONS
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
    const fetchLoadDataHocSinhTheoId = async () => {
      const { statusCode, dataGot } = await DataHocSinh.loadDataHocSinhTheoId(
        hocSinhId
      );
      if (statusCode === 201) {
        setDataHocSinhSua(dataGot.data);
      }
    };
    fetchLoadDataHocSinhTheoId();
  }, [hocSinhId]);

  const isProcessing = () => {
    return !isLoggedIn || !dataHocSinhSua;
  };

  if (isProcessing()) {
    return <h1>Đang xử lý ...</h1>;
  }

  return <ThemHsPage renderMode="sua" dataHocSinh={dataHocSinhSua} />;
};

export default SuaHocSinhRoute;
