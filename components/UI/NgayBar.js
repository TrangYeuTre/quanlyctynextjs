import classes from "./NgayBar.module.css";
import { BsFillCalendarEventFill } from "react-icons/bs";

const NgayBar = (props) => {
  const { ngay } = props;
  return (
    <div className={classes.container}>
      <div>
        <BsFillCalendarEventFill
          size="1.5rem"
          style={{ color: "var(--mauNen--)" }}
        />
      </div>
      <div
        style={{
          fontSize: "1.4rem",
          color: "var(--mauNen--)",
          borderLeft: "2px var(--mauNen--) solid",
          paddingLeft: "1rem",
        }}
      >
        {ngay || "none"}
      </div>
    </div>
  );
};

export default NgayBar;
