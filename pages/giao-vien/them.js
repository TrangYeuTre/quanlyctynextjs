import ThemGvPage from "../../components/giaovien/ThemGv";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";

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
    return <h1>Đang xử lý ...</h1>;
  }

  return <ThemGvPage renderMode="them" />;
};
export default GiaoVienRoute;
