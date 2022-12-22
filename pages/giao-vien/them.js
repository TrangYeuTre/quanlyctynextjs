import ThemGvPage from "../../components/giaovien/ThemGv";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import Loading from "../../components/UI/Loading";

const GiaoVienRoute = (props) => {
  //VARIABLES
  const [isLoggedIn, setLoggedIn] = useState(false);
  //SIDE EFFECT
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

  const isProcessing = () => {
    return !isLoggedIn;
  };

  if (isProcessing()) {
    return <Loading />;
  }

  return <ThemGvPage renderMode="them" />;
};
export default GiaoVienRoute;
