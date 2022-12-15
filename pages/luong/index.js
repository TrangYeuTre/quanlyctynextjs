import { useRouter } from "next/router";
import Loading from "../../components/UI/Loading";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";

const LuongRoute = (props) => {
  const router = useRouter();
  //State loading
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setLoggedIn] = useState(false);
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
    if (router.asPath && router.asPath === "/luong/dau-vao") {
      setLoading(false);
    } else {
      router.replace("/luong/dau-vao");
    }
  }, [router]);

  if (!isLoggedIn) {
    return <h1>Đang xử lý ...</h1>;
  }

  return loading && <Loading />;
};

export default LuongRoute;
