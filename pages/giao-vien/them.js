import ThemGvPage from "../../components/giaovien/ThemGv";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";

const GiaoVienRoute = (props) => {
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
  if (!isLoggedIn) {
    return <h1>Đang xử lý ...</h1>;
  }

  return <ThemGvPage renderMode="them" />;
};
export default GiaoVienRoute;
