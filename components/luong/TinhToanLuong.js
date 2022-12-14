import LuongCaNhan from "./caNhan/CaNhan";
import LuongNhom from "./nhom/LuongNhom";
import PhuPhi from "./phuphi/Phuphi";
import { useState, useEffect, useContext } from "react";
import Card from "../UI/Card";
import CTA from "../UI/CTA";
import { kiemTraLuongCaNhanTinhChua, tinhTongLuong } from "./luong_helper";
import NotiContext from "../../context/notiContext";
import { useRouter } from "next/router";
import { viewSplitMoney } from "../../helper/uti";
import LuongGiaoVien from "../../classes/LuongGiaoVien";
import DataGiaoVien from "../../classes/DataGiaoVien";

const TinhToanLuongPage = (props) => {
  const router = useRouter();
  //Noti
  const notiCtx = useContext(NotiContext);
  //Lấy về data ddcn và ddn của giáo viên
  const { arrDdcn, arrDdn, ngayDauThang } = props;
  const giaoVienChonData = DataGiaoVien.giaoVienChonData;
  //State chính xử lý xem được bấm nút chốt tính lương hay không
  const [isSubmit, setSubmit] = useState(false);
  //State lấy data lương cá nhân
  const [dataLuongCaNhan, setDataLuongCaNhan] = useState([]);
  //Cb lấy data lương cá nhân
  const layDataLuongCaNhanHandler = (data) => {
    setDataLuongCaNhan(data);
  };
  //State data lương nhớm
  const [dataLuongNhom, setDataLuongNhom] = useState([]);
  //cb lấy data lương nhóm
  const layDataLuongNhomHandler = (data) => {
    setDataLuongNhom(data);
  };
  //State data phụ phí
  const [dataPhuPhi, setDataPhuPhi] = useState([]);
  //cb lấy data phụ phí
  const layDataPhuPhiHandler = (data) => {
    setDataPhuPhi(data);
  };
  //Cb chính chốt lương tháng mới
  const chotLuongThangHandler = async () => {
    //Class
    const luongGiaoVienThangMoi = new LuongGiaoVien({
      giaoVienId: giaoVienChonData.id,
      shortName: giaoVienChonData.shortName,
      ngayTinhLuong: ngayDauThang,
      dataLuongCaNhan: dataLuongCaNhan,
      dataLuongNhom: dataLuongNhom,
      dataPhuPhi: dataPhuPhi,
    });
    //Fetch
    const { statusCode, dataGot } =
      await luongGiaoVienThangMoi.themLuongGiaoVien();
    //Push noti
    setTimeout(() => {
      notiCtx.clearNoti();
      if (statusCode === 200 || statusCode === 201) {
        router.replace("/luong/dau-vao");
      }
    }, process.env.DELAY_TIME_NOTI);
    window.scrollTo(0, 0);
    notiCtx.pushNoti({ status: statusCode, message: dataGot.thongbao });
  };
  //Side effect check được bấm nút submit không
  useEffect(() => {
    const isOk = kiemTraLuongCaNhanTinhChua(dataLuongCaNhan);
    setSubmit(isOk);
  }, [dataLuongCaNhan]);
  //Side effect thêm phần ghi chú vào mảng dd nhóm, chạy 1 lần load thôi
  useEffect(() => {
    const arrDdnThemGhiChu = arrDdn.map((item) => {
      return { ...item, ghiChu: "", luongNhom: +giaoVienChonData.luongNhom };
    });
    //Sơrt lại theo ngày cái
    arrDdnThemGhiChu.sort((a, b) =>
      new Date(a.ngayDiemDanh) < new Date(b.ngayDiemDanh) ? -1 : 1
    );
    setDataLuongNhom(arrDdnThemGhiChu);
  }, [arrDdn, giaoVienChonData]);
  //Tạo một helper tính tổng lương tất cả ở đây
  const tongLuong = tinhTongLuong(dataLuongCaNhan, dataLuongNhom, dataPhuPhi);
  //Trả
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
