import classes from "./Login.module.css";
import { useRef, useContext } from "react";
import NotiContext from "../../context/notiContext";
import { useRouter } from "next/router";

const Login = (props) => {
  const { message } = props;
  const router = useRouter();
  const notiCtx = useContext(NotiContext);
  const usernameRef = useRef();
  const passwordRef = useRef();
  const loginHandler = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/auth/createAdmin", {
      method: "POST",
      body: JSON.stringify({
        role: "admin",
        username: usernameRef.current.value,
        password: passwordRef.current.value,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const statusCode = response.status;
    const dataGot = await response.json();
    //Đẩy thông báo nào
    setTimeout(() => {
      notiCtx.clearNoti();
      if (statusCode === 200 || statusCode === 201) {
        router.replace("/");
      }
    }, 2000);
    window.scrollTo(0, 0);
    notiCtx.pushNoti({ status: statusCode, message: dataGot.thongbao });
  };
  return (
    <form className={classes.container} onSubmit={loginHandler}>
      <div className={classes.control}>
        <label htmlFor="username">Username *</label>
        <input
          type="text"
          ref={usernameRef}
          name="username"
          id="username"
          defaultValue=""
          required
        />
      </div>
      <div className={classes.control}>
        <label htmlFor="password">Password *</label>
        <input
          type="password"
          name="password"
          id="password"
          required
          ref={passwordRef}
        />
      </div>
      {message && <p style={{ color: "var(--mauMh4--)" }}>{message}</p>}
      <button type="submit" className="btn btn-submit">
        Đăng nhập
      </button>
    </form>
  );
};

export default Login;
