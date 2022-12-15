import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";

const HomeRoute = (props) => {
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
  return <h1>Trang tổng quan chính</h1>;
};

export default HomeRoute;
