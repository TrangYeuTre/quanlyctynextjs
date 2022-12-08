import LuongCaNhan from "./caNhan/CaNhan";
import { Fragment } from "react";
import Card from "../UI/Card";
const TinhToanLuongPage = (props) => {
  //Lấy về data ddcn và ddn của giáo viên
  const { arrDdcn, arrDdn, giaoVienChonData } = props;
  //Trả
  return (
    <Card>
      <LuongCaNhan arrDdcn={arrDdcn} giaoVienChonData={giaoVienChonData} />
    </Card>
  );
};

export default TinhToanLuongPage;
