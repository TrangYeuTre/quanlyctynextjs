import classes from "./subMenu.module.css";
import Link from "next/link";
import { navItems } from "../../data/static";
import { useRouter } from "next/router";

const SubMenu = (props) => {
  const router = useRouter();
  //Lấy phần route chính của navitem từ router
  const arrPaths = router.asPath.split("/");
  const mainRouteGot = `/${arrPaths[1]}`;
  const subRouteGot = `/${arrPaths[2]}`;
  //Chờ props là id của navItems chính được chọn để load
  //Lấy về mảng tĩnh navitems
  const arrNavItems = navItems();
  //Lọc ra mảng children để render
  let arrChildren = [];
  const itemMatched = arrNavItems.find(
    (i) => i.route.toString() === mainRouteGot.toString()
  );
  //TÌm thấy thì mới xử lý tiếp
  if (itemMatched) {
    //Route chính
    const mainRoute = itemMatched.route;
    //Xử lý lại mảng children với link kết hợp mainỎute
    arrChildren = itemMatched.children.map((child) => {
      return {
        id: child.id,
        name: child.name,
        route: `${mainRoute}${child.route}`,
      };
    });
  }
  return (
    arrChildren.length > 0 && (
      <div className={classes.container}>
        {arrChildren.map((child) => {
          console.log(child.route);
          let finalStyle = classes.item;
          const arrRouteSplit = child.route.split("/");
          const routeOfChild = `/${arrRouteSplit[2]}`;
          if (routeOfChild.toString() === subRouteGot.toString()) {
            finalStyle = `${classes.item} ${classes.itemActive}`;
          }
          return (
            <Link href={child.route} key={child.id}>
              <div className={finalStyle}>
                <p>{child.name}</p>
              </div>
            </Link>
          );
        })}
      </div>
    )
  );
};

export default SubMenu;
