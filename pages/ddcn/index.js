import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "../../components/UI/Loading";
import { getSession } from "next-auth/react";
import { redirectPageAndResetState } from "../../helper/uti";

const DdnROute = (props) => {
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
  //Side effect set loading
  useEffect(() => {
    const isCorrectCurPath = () => {
      return router.asPath && router.asPath === "/ddcn/diem-danh";
    };
    if (isCorrectCurPath()) {
      setLoading(false);
    } else {
      redirectPageAndResetState("/ddcn/diem-danh");
    }
  }, [router]);

  if (!isLoggedIn) {
    return <Loading />;
  }

  return loading && <Loading />;
};

export default DdnROute;
