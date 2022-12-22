import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "../../components/UI/Loading";
import { getSession } from "next-auth/react";
import { redirectPageAndResetState } from "../../helper/uti";

const LopNhomRoute = (props) => {
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
    const isExistedPath = () => {
      return router.asPath && router.asPath === "/lop-nhom/them";
    };
    if (isExistedPath()) {
      setLoading(false);
    } else {
      redirectPageAndResetState("/lop-nhom/them");
    }
  }, [router]);

  const isProcessing = () => {
    return !isLoggedIn;
  };
  if (isProcessing()) {
    return <Loading />;
  }

  return loading && <Loading />;
};

export default LopNhomRoute;
