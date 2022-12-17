import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "../../components/UI/Loading";
import { getSession } from "next-auth/react";
import { redirectPageAndResetState } from "../../helper/uti";

const GiaoVienRoute = (props) => {
  //VARIABLES
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setLoggedIn] = useState(false);
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
    if (router.asPath && router.asPath === "/giao-vien/them") {
      setLoading(false);
    } else {
      router.replace("/giao-vien/them");
    }
  }, [router]);

  const isProcessing = () => {
    return !isLoggedIn;
  };

  if (isProcessing()) {
    return <h1>Đang xử lý ...</h1>;
  }

  return loading && <Loading />;
};

export default GiaoVienRoute;
