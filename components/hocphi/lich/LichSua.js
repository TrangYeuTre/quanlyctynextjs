import classes from "./Lich.module.css";
import LichItemViewOnly from "./LichItemViewOnly";
import { Fragment } from "react";

const LichSua = (props) => {
  //VARIABLES
  const { ngayChon, lichDaChonNgay } = props;
  const title = new Date(ngayChon).toLocaleString("en-GB", {
    month: "numeric",
    year: "numeric",
  });

  return (
    <Fragment>
      {lichDaChonNgay.length > 0 && (
        <Fragment>
          <h4
            style={{
              paddingBottom: ".5rem",
              borderBottom: "1px solid gray",
            }}
          >
            Lịch tháng:{" "}
            <span style={{ color: "var(--mauMh1--)" }}>{title}</span>
          </h4>
          <div className={classes.overall}>
            <table className={classes.container}>
              {/* Hàng labels thứ */}
              <thead>
                <tr className={classes.labels}>
                  <th>Hai</th>
                  <th>Ba</th>
                  <th>Tư</th>
                  <th>Năm</th>
                  <th>Sáu</th>
                  <th>Bảy</th>
                  <th>CN</th>
                </tr>
              </thead>
              {/* Render 42 ô lịch - chia làm 6 hàng data */}
              <tbody>
                <tr className={classes.datas}>
                  {lichDaChonNgay.map((date) => {
                    if (date.idCell >= 0 && date.idCell <= 6) {
                      return <LichItemViewOnly key={date.idCell} data={date} />;
                    }
                  })}
                </tr>
                <tr className={classes.datas}>
                  {lichDaChonNgay.map((date) => {
                    if (date.idCell >= 7 && date.idCell <= 13) {
                      return <LichItemViewOnly key={date.idCell} data={date} />;
                    }
                  })}
                </tr>
                <tr className={classes.datas}>
                  {lichDaChonNgay.map((date) => {
                    if (date.idCell >= 14 && date.idCell <= 20) {
                      return <LichItemViewOnly key={date.idCell} data={date} />;
                    }
                  })}
                </tr>
                <tr className={classes.datas}>
                  {lichDaChonNgay.map((date) => {
                    if (date.idCell >= 21 && date.idCell <= 27) {
                      return <LichItemViewOnly key={date.idCell} data={date} />;
                    }
                  })}
                </tr>
                <tr className={classes.datas}>
                  {lichDaChonNgay.map((date) => {
                    if (date.idCell >= 28 && date.idCell <= 34) {
                      return <LichItemViewOnly key={date.idCell} data={date} />;
                    }
                  })}
                </tr>
                <tr className={classes.datas}>
                  {lichDaChonNgay.map((date) => {
                    if (date.idCell >= 35 && date.idCell <= 41) {
                      return <LichItemViewOnly key={date.idCell} data={date} />;
                    }
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </Fragment>
      )}
      {lichDaChonNgay.length === 0 && <h1>Loading...</h1>}
    </Fragment>
  );
};

export default LichSua;
