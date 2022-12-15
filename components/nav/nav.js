import classes from "./nav.module.css";
import Link from "next/link";
import { navItems } from "../../data/static";
import { useRouter } from "next/router";
import { Fragment, useState, useEffect } from "react";
import { signOut, getSession } from "next-auth/react";

const NavBar = (props) => {
  const router = useRouter();
  const arrPaths = router.asPath.split("/");
  const mainRoute = `/${arrPaths[1]}`;
  const [isLoggedIn, setLoggedIn] = useState(false);
  //Lấy về mảng tĩnh navitems
  const arrNavItems = navItems();

  const signOutHandler = () => {
    signOut({ callbackUrl: "/auth/login" });
  };
  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });
  }, []);
  return (
    <nav className={classes.container}>
      {isLoggedIn && (
        <Fragment>
          {arrNavItems.map((item) => {
            //Quyết định css xem item có được chọn chưa
            let finalStyle = classes.navItem;
            if (item.route.toString() === mainRoute.toString()) {
              finalStyle = `${classes.navItem} ${classes.navItemActive}`;
            }
            return (
              <Link href={item.route} key={item.id}>
                <div className={finalStyle}>
                  <p>{item.name}</p>{" "}
                </div>
              </Link>
            );
          })}
          <div
            className={classes.navItem}
            style={{
              backgroundColor: "var(--mauMh4--)",
              color: "var(--mauNen--)",
            }}
            onClick={signOutHandler}
          >
            Sign Out
          </div>
        </Fragment>
      )}

      {!isLoggedIn && (
        <Fragment>
          <div
            className={classes.navItem}
            style={{
              backgroundColor: "var(--mauMh3--)",
              color: "var(--mauNen--)",
            }}
          >
            Login vào mới xài app được mẹ mìn sushi ê.
          </div>
          <Link href={"/auth/login"}>
            <div
              className={classes.navItem}
              style={{
                backgroundColor: "var(--mauMh4--)",
                color: "var(--mauNen--)",
              }}
            >
              Login
            </div>
          </Link>
        </Fragment>
      )}
    </nav>
  );
};

export default NavBar;
