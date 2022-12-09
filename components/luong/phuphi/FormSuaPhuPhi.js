import classes from "./Phuphi.module.css";
import { convertInputDateFormat } from "../../../helper/uti";
import { useRef } from "react";

const FormSuaPhuPhi = (props) => {
  const { dataNgayPhuPhi, suaNgayPhuPhi, huySua } = props;
  //Các ref lấy value
  const ngayRef = useRef();
  const phuPhiRef = useRef();
  const ghiChuRef = useRef();

  const clearInput = () => {
    ghiChuRef.current.value = "";
    phuPhiRef.current.value = 0;
    document.getElementById("ghiChuPhuPhi").focus();
  };

  //cb hủy sửa trở lại giao diện thêm
  const huySuaHandler = () => {
    huySua();
  };

  //Cb lấy data ngày ghi chú
  const layDataNgayGhiChuHandler = (e) => {
    e.preventDefault();
    const data = {
      ngayPhuPhiId: dataNgayPhuPhi.ngayPhuPhiId,
      ngayPhuPhi: ngayRef.current.value || null,
      phuPhi: phuPhiRef.current.value || 0,
      ghiChuPhuPhi: ghiChuRef.current.value || "",
    };
    suaNgayPhuPhi(data);
    huySua();
    clearInput();
  };
  return (
    <form className={classes.formSuaPhuPhi} onSubmit={layDataNgayGhiChuHandler}>
      <div className={classes.control}>
        <label>Ngày</label>
        <input
          ref={ngayRef}
          type="date"
          defaultValue={convertInputDateFormat(
            new Date(dataNgayPhuPhi.ngayPhuPhi)
          )}
          disabled
        />
        <label>Phụ phí</label>
        <input
          ref={phuPhiRef}
          defaultValue={+dataNgayPhuPhi.phuPhi}
          type="number"
          min="10000"
          step="1000"
          required
          style={{ width: "8rem" }}
        />
        <button type="submit" className="btn btn-sub2">
          Sửa
        </button>
        <button type="button" className="btn btn-ghost" onClick={huySuaHandler}>
          Hủy
        </button>
      </div>
      <div className={classes.control}>
        <textarea
          id="ghiChuPhuPhi"
          defaultValue={
            dataNgayPhuPhi.ghiChuPhuPhi || "Lỗi load ghi chú của ngày"
          }
          rows="5"
          ref={ghiChuRef}
          placeholder="Nhập ghi chú ..."
        />
      </div>
    </form>
  );
};

export default FormSuaPhuPhi;
