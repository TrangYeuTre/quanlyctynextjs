import classes from "./Login.module.css";
import { useRef, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";

const Login = (props) => {
  const { message } = props;
  const { data: session, status } = useSession();
  const usernameRef = useRef();
  const passwordRef = useRef();
  const loginHandler = async (e) => {
    e.preventDefault();
    if (status === "unauthenticated") {
      await signIn("credentials", {
        redirect: false,
        username: usernameRef.current.value,
        password: passwordRef.current.value,
      });
    }
  };
  useEffect(() => {
    if (status === "authenticated") {
      window.location.href = "/";
    }
  }, [status]);
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
