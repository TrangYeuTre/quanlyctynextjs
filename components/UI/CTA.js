import classes from "./CTA.module.css";
import { viewSplitMoney } from "../../helper/uti";

const Card = (props) => {
  const { message, tongTienLuong } = props;
  return (
    <section className={classes.container}>
      <div className={classes.content}>
        {tongTienLuong && (
          <h3 style={{ textAlign: "center" }}>
            Tổng tiền lương:{" "}
            <span style={{ fontSize: "2rem", color: "var(--mauMh4--)" }}>
              {viewSplitMoney(tongTienLuong)} đ{" "}
            </span>
          </h3>
        )}
        {message && (
          <div className={classes.message}>
            {" "}
            <p>{message}</p>
          </div>
        )}
        <div className={classes.actions}>{props.children}</div>
      </div>
    </section>
  );
};

export default Card;
