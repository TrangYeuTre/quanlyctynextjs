import classes from "./Phuphi.module.css";
import { convertInputDateFormat } from "../../../helper/uti";
import { useRef } from "react";

const FormThemPhuPhi = (props) => {
  //VARIABLES
  const { themNgayPhuPhi } = props;
  const ngayRef = useRef();
  const phuPhiRef = useRef();
  const ghiChuRef = useRef();

  //CB
  const clearInput = () => {
    ghiChuRef.current.value = "";
    phuPhiRef.current.value = 0;
    document.getElementById("ghiChuPhuPhi").focus();
  };
  const layDataNgayGhiChuHandler = (e) => {
    e.preventDefault();
    const data = {
      ngayPhuPhi: ngayRef.current.value || null,
      phuPhi: phuPhiRef.current.value || 0,
      ghiChuPhuPhi: ghiChuRef.current.value || "",
    };
    themNgayPhuPhi(data);
    clearInput();
  };

  return (
    <form
      className={classes.formThemPhuPhi}
      onSubmit={layDataNgayGhiChuHandler}
    >
      <div className={classes.control}>
        <label>Ngày</label>
        <input
          ref={ngayRef}
          type="date"
          defaultValue={convertInputDateFormat(new Date())}
        />
        <label>Phụ phí</label>
        <input
          defaultValue={0}
          ref={phuPhiRef}
          type="number"
          min="10000"
          step="1000"
          required
          style={{ width: "8rem" }}
        />
        <button type="submit" className="btn btn-sub2">
          Thêm
        </button>
      </div>
      <div className={classes.control}>
        <textarea
          id="ghiChuPhuPhi"
          rows="5"
          ref={ghiChuRef}
          placeholder="Nhập ghi chú ..."
        />
      </div>
    </form>
  );
};

export default FormThemPhuPhi;
