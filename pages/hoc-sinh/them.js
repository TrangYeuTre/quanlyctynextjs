import ThemHsPage from "../../components/hocsinh/ThemHs";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { redirectPageAndResetState } from "../../helper/uti";

const ThemHocSinhRoute = (props) => {
  //VARIABLE
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

  if (!isLoggedIn) {
    return <h1>Đang xử lý ...</h1>;
  }
  
  return <ThemHsPage renderMode="them" />;
};

export default ThemHocSinhRoute;
