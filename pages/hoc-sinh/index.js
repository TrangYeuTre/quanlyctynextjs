import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "../../components/UI/Loading";
import { getSession } from "next-auth/react";

const HocSinhRoute = (props) => {
  const router = useRouter();
  //State loading
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setLoggedIn] = useState(false);
  //Side effect nếu chưa đăng nhập thì không cho truy cạp
  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
        window.location.href = "/auth/login";
      }
    });
  }, []);
  //Side effect set loading
  useEffect(() => {
    if (router.asPath && router.asPath === "/hoc-sinh/them") {
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
