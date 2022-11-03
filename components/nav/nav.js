import classes from "./nav.module.css";
import Link from "next/link";
import { navItems } from "../../data/static";
import { useRouter } from "next/router";

const NavBar = (props) => {
  const router = useRouter();
  const arrPaths = router.asPath.split("/");
  const mainRoute = `/${arrPaths[1]}`;

  //Lấy về mảng tĩnh navitems
  const arrNavItems = navItems();

  return (
    <nav className={classes.container}>
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
    </nav>
  );
};

export default NavBar;
