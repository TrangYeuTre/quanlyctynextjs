import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "../../components/UI/Loading";
import { getSession } from "next-auth/react";
import { redirectPageAndResetState } from "../../helper/uti";

const HocPhiRoute = (props) => {
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
    if (router.asPath && router.asPath === "/hoc-phi/dau-vao") {
      setLoading(false);
    } else {
      redirectPageAndResetState("/hoc-phi/dau-vao");
    }
  }, [router]);

  if (!isLoggedIn) {
    return <Loading />;
  }

  return loading && <Loading />;
};

export default HocPhiRoute;
