import classes from "./LichItem.module.css";
import { TbCircleOff } from "react-icons/tb";

const LichItem = (props) => {
  //VARIABLES
  const { idCell, ngay, loaiLop, isActive } = props.data;
  const { getCellId } = props;

  //CALLBACKS
  const suaNgayChonHandler = (idCell) => {
    getCellId(idCell);
  };
  
  return (
    <td className={!isActive ? classes.dis : null}>
      {isActive && (
        <div
          onClick={suaNgayChonHandler.bind(0, idCell)}
          className={classes.container}
        >
          <p>{ngay}</p>
          {loaiLop &&
            loaiLop.length > 0 &&
            loaiLop.map((item) => {
              let finalStyle;
              if (item.loaiLop === "canhan") {
                finalStyle = classes.canhan;
              }
              if (item.loaiLop === "nhom") {
                finalStyle = classes.nhom;
              }
              if (item.loaiLop === "donghanh") {
                finalStyle = classes.donghanh;
              }
              return (
                <p key={item.loaiLop} className={finalStyle}>
                  {item.loaiLop}{" "}
                  {item.heso > 1 && (
                    <span style={{ fontSize: ".8rem" }}>(x{item.heso})</span>
                  )}
                </p>
              );
            })}
        </div>
      )}
      {!isActive && (
        <div className={classes.dis}>
          <TbCircleOff size="2rem" style={{ color: "rgb(240, 240, 240)" }} />
        </div>
      )}
    </td>
  );
};

export default LichItem;
