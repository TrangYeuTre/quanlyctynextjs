import LuongCaNhan from "./caNhan/CaNhan";
import LuongNhom from "./nhom/LuongNhom";
import PhuPhi from "./phuphi/Phuphi";
import { useState, useEffect, useContext } from "react";
import Card from "../UI/Card";
import CTA from "../UI/CTA";
import { kiemTraLuongCaNhanTinhChua, tinhTongLuong } from "./luong_helper";
import NotiContext from "../../context/notiContext";
import LuongGiaoVien from "../../classes/LuongGiaoVien";
import DataGiaoVien from "../../classes/DataGiaoVien";
import { redirectPageAndResetState } from "../../helper/uti";

const TinhToanLuongPage = (props) => {
  //VARIABLES
  const notiCtx = useContext(NotiContext);
  const { arrDdcn, arrDdn, ngayDauThang } = props;
  const giaoVienChonData = DataGiaoVien.giaoVienChonData;
  const [isSubmit, setSubmit] = useState(false);
  const [dataLuongCaNhan, setDataLuongCaNhan] = useState([]);
  const [dataLuongNhom, setDataLuongNhom] = useState([]);
  const [dataPhuPhi, setDataPhuPhi] = useState([]);
  const tongLuong = tinhTongLuong(dataLuongCaNhan, dataLuongNhom, dataPhuPhi);

  //CB
  const layDataLuongCaNhanHandler = (data) => {
    setDataLuongCaNhan(data);
  };
  const layDataLuongNhomHandler = (data) => {
    setDataLuongNhom(data);
  };
  const layDataPhuPhiHandler = (data) => {
    setDataPhuPhi(data);
  };

  //FUNCTIONS
  const chotLuongThangHandler = async () => {
    const luongGiaoVienThangMoi = new LuongGiaoVien({
      giaoVienId: giaoVienChonData.id,
      shortName: giaoVienChonData.shortName,
      ngayTinhLuong: ngayDauThang,
      dataLuongCaNhan: dataLuongCaNhan,
      dataLuongNhom: dataLuongNhom,
      dataPhuPhi: dataPhuPhi,
      tongLuongThang : +tongLuong || 0,
    });
    const { statusCode, dataGot } =
      await luongGiaoVienThangMoi.themLuongGiaoVien();
    dayThongBao(statusCode, dataGot);
  };
  const dayThongBao = (statusCode, dataGot) => {
    setTimeout(() => {
      notiCtx.clearNoti();
      if (statusCode === 200 || statusCode === 201) {
        redirectPageAndResetState("/luong/dau-vao");
      }
    }, process.env.DELAY_TIME_NOTI);
    window.scrollTo(0, 0);
    notiCtx.pushNoti({ status: statusCode, message: dataGot.thongbao });
  };

  //SIDE EFFECT
  useEffect(() => {
    const isOk = kiemTraLuongCaNhanTinhChua(dataLuongCaNhan);
    setSubmit(isOk);
  }, [dataLuongCaNhan]);
  //Chỉ load 1 lần
  useEffect(() => {
    const taoArrDiemDanhNhomThemPropGhiChu = (arrDdn, giaoVienChonData) => {
      const arrDdnThemGhiChu = arrDdn.map((item) => {
        return { ...item, ghiChu: "", luongNhom: +giaoVienChonData.luongNhom };
      });
      sapXepLaiMangDiemDanhNhomTheoNgayTangDan(arrDdnThemGhiChu);
      return arrDdnThemGhiChu;
    };
    const arrDdnThemPropGhiChu = taoArrDiemDanhNhomThemPropGhiChu(
      arrDdn,
      giaoVienChonData
    );
    setDataLuongNhom(arrDdnThemPropGhiChu);
  }, [arrDdn, giaoVienChonData]);
  const sapXepLaiMangDiemDanhNhomTheoNgayTangDan = (arrDdn) => {
    arrDdn.sort((a, b) =>
      new Date(a.ngayDiemDanh) < new Date(b.ngayDiemDanh) ? -1 : 1
    );
  };

  return (
    <Card>
      <h3>
        Tính lương tháng cho giáo viên{" "}
        <span style={{ color: "var(--mauMh4--)" }}>
          {giaoVienChonData.shortName}
        </span>
      </h3>
      <LuongCaNhan
        arrDdcn={arrDdcn}
        giaoVienChonData={giaoVienChonData}
        layDataLuongCaNhan={layDataLuongCaNhanHandler}
      />
      <LuongNhom
        arrDdn={dataLuongNhom}
        layDataLuongNhom={layDataLuongNhomHandler}
      />
      <PhuPhi layDataPhuPhi={layDataPhuPhiHandler} />
      <CTA
        message={
          isSubmit
            ? null
            : "Chú ý : phần lương cá nhân phải chọn hết hệ số để tính thì mới được bấm nút tính bên dưới."
        }
        tongTienLuong={isSubmit ? tongLuong : null}
      >
        <button
          type="button"
          className="btn btn-submit"
          onClick={chotLuongThangHandler}
          disabled={!isSubmit ? "disabled" : null}
        >
          Chốt lương tháng
        </button>
      </CTA>
    </Card>
  );
};

export default TinhToanLuongPage;
