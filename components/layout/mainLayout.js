import { Fragment } from "react";
import classes from "./mainLayout.module.css";
import NavBar from "../nav/nav";
import SubMenu from "../nav/subMenu";
import NotiBar from "../UI/NotiBar";
import { useContext } from "react";
import NotiContext from "../../context/notiContext";

const MainLayout = (props) => {
  const notiCtx = useContext(NotiContext);
  const notiData = notiCtx.noti;
  return (
    <Fragment>
      <header className={classes.header}>
        <NavBar />
        <SubMenu navItemId="i-1" />
      </header>
      {notiData.status && (
          <NotiBar status={notiData.status} message={notiData.message} />
      )}
      <main className={classes.container}>{props.children}</main>
    </Fragment>
  );
};

export default MainLayout;
