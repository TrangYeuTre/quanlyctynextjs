import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "../../components/UI/Loading";
import { getSession } from "next-auth/react";
import { redirectPageAndResetState } from "../../helper/uti";

const HocSinhRoute = (props) => {
  //VARIABLE
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
    const isInCurrentUrl = () => {
      return router.asPath && router.asPath === "/hoc-sinh/them";
    };
    if (isInCurrentUrl()) {
      setLoading(false);
    } else {
      router.replace("/hoc-sinh/them");
    }
  }, [router]);

  if (!isLoggedIn) {
    return <h1>Đang xử lý ...</h1>;
  }

  return loading && isLoggedIn && <Loading />;
};

export default HocSinhRoute;
