import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "../../components/UI/Loading";
import { getSession } from "next-auth/react";

const DdnROute = (props) => {
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
    if (router.asPath && router.asPath === "/ddcn/diem-danh") {
      setLoading(false);
    } else {
      router.replace("/ddcn/diem-danh");
    }
  }, [router]);
  
  if (!isLoggedIn) {
    return <h1>Đang xử lý ...</h1>;
  }

  return loading && <Loading />;
};

export default DdnROute;
