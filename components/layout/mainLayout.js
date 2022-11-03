import { Fragment } from "react";
import classes from "./mainLayout.module.css";
import NavBar from "../nav/nav";
import SubMenu from "../nav/subMenu";

const MainLayout = (props) => {
  return (
    <Fragment>
      <header className={classes.header}>
        <NavBar />
        <SubMenu navItemId="i-1" />
      </header>
      <main className={classes.container}>{props.children}</main>
    </Fragment>
  );
};

export default MainLayout;
