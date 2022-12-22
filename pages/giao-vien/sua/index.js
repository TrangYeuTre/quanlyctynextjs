import ThemGvPage from "../../../components/giaovien/ThemGv";
import DataGiaoVien from "../../../classes/DataGiaoVien";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { redirectPageAndResetState } from "../../../helper/uti";
import { useRouter } from "next/router";
import Loading from "../../../components/UI/Loading";

const SuaGiaoVienRoute = (props) => {
  //VARIABLES
  const router = useRouter();
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [dataGiaoVienSua, setDataGiaoVienSua] = useState();
  //Ghi chú: xài cùng Comp UI PersonBar điều hướng lấy query là hocSinhId
  const giaoVienId = router.query.hocSinhId;

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
    const fetchLoadDataGiaoVienSua = async (giaoVienId) => {
      const { statusCode, dataGot } = await DataGiaoVien.loadDataGiaoVienTheoId(
        giaoVienId
      );
      if (statusCode === 201) {
        setDataGiaoVienSua(dataGot.data);
      }
    };
    fetchLoadDataGiaoVienSua(giaoVienId);
  }, [giaoVienId]);

  const isProcessing = () => {
    return !isLoggedIn || !dataGiaoVienSua;
  };
  if (isProcessing()) {
    return <Loading />;
  }

  return <ThemGvPage dataGiaoVienSua={dataGiaoVienSua} renderMode="sua" />;
};

export default SuaGiaoVienRoute;
