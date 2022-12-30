import SuaLuongCaNhan from "./caNhan/SuaCaNhan";
import SuaPhuPhi from "./phuphi/SuaPhuPhi";
import SuaLuongNhom from "./nhom/SuaLuongNhom";
import { useState, useEffect, useContext } from "react";
import Card from "../UI/Card";
import CTA from "../UI/CTA";
import { kiemTraLuongCaNhanTinhChua, tinhTongLuong } from "./luong_helper";
import NotiContext from "../../context/notiContext";
import { useRouter } from "next/router";
import LuongGiaoVien from "../../classes/LuongGiaoVien";
import DataGiaoVien from "../../classes/DataGiaoVien";

const SuaLuongPage = (props) => {
  const router = useRouter();
  const notiCtx = useContext(NotiContext);
  const { arrDdcn, arrDdn, ngayDauThang, dataLuongThang } = props;
  const giaoVienChonData = DataGiaoVien.giaoVienChonData;
  const [isSubmit, setSubmit] = useState(false);
  const [dataLuongCaNhan, setDataLuongCaNhan] = useState([]);
  const [dataLuongNhom, setDataLuongNhom] = useState([]);
  const [dataPhuPhi, setDataPhuPhi] = useState([]);
  const [firstLoad, setFirstLoad] = useState(true);
  const tongLuong = tinhTongLuong(dataLuongCaNhan, dataLuongNhom, dataPhuPhi);

  //Callbacks
  const xuLyLayTongLuongRender = (firstLoad, dataLuongThang, tongLuong) => {
    let tongLuongRender = 0;
    if (firstLoad) {
      tongLuongRender = +dataLuongThang.tongLuongThang;
    } else {
      tongLuongRender = +tongLuong;
    }
    return tongLuongRender;
  };
  const layDataLuongCaNhanHandler = (data) => {
    setDataLuongCaNhan(data);
    setFirstLoad(false);
  };
  const layDataLuongNhomHandler = (data) => {
    setDataLuongNhom(data);
    setFirstLoad(false);
  };
  const layDataPhuPhiHandler = (data) => {
    setDataPhuPhi(data);
    setFirstLoad(false);
  };

  //Không đem xử lý này lên khu VARIABLES sẽ gây lỗi
  const tongLuongRender = xuLyLayTongLuongRender(
    firstLoad,
    dataLuongThang,
    tongLuong
  );
  //Func chính
  const chotLuongThangHandler = async () => {
    const luongGiaoVienUpdate = new LuongGiaoVien({
      giaoVienId: giaoVienChonData.id,
      shortName: giaoVienChonData.shortName,
      ngayTinhLuong: ngayDauThang,
      dataLuongCaNhan: dataLuongCaNhan,
      dataLuongNhom: dataLuongNhom,
      dataPhuPhi: dataPhuPhi,
      tongLuongThang: +tongLuongRender,
    });
    const { statusCode, dataGot } = await luongGiaoVienUpdate.suaLuongGiaoVien(
      dataLuongThang._id
    );
    dayThongBao(statusCode, dataGot);
  };

  const dayThongBao = (statusCode, dataGot) => {
    setTimeout(() => {
      notiCtx.clearNoti();
      if (statusCode === 200 || statusCode === 201) {
        router.replace("/luong/dau-vao");
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

  useEffect(() => {
    const arrDdnThemGhiChu = arrDdn.map((item) => {
      return { ...item, ghiChu: "", luongNhom: +giaoVienChonData.luongNhom };
    });
    arrDdnThemGhiChu.sort((a, b) =>
      new Date(a.ngayDiemDanh) < new Date(b.ngayDiemDanh) ? -1 : 1
    );
    setDataLuongNhom(arrDdnThemGhiChu);
  }, [arrDdn, giaoVienChonData]);

  useEffect(() => {
    if (dataLuongThang && dataLuongThang.dataLuongCaNhan.length > 0) {
      console.log(dataLuongThang);
      setDataLuongCaNhan(dataLuongThang.dataLuongCaNhan);
    }
    if (dataLuongThang && dataLuongThang.dataLuongNhom.length > 0) {
      setDataLuongNhom(dataLuongThang.dataLuongNhom);
    }
    if (dataLuongThang && dataLuongThang.dataPhuPhi.length > 0) {
      setDataPhuPhi(dataLuongThang.dataPhuPhi);
    }
  }, [dataLuongThang]);

  //Trả
  return (
    <Card isSubBg={true}>
      <h3>
        Tính lương tháng cho giáo viên{" "}
        <span style={{ color: "var(--mauMh4--)" }}>
          {giaoVienChonData.shortName}
        </span>
      </h3>
      <SuaLuongCaNhan
        arrDdcn={arrDdcn}
        giaoVienChonData={giaoVienChonData}
        dataLuongCaNhan={dataLuongCaNhan}
        layDataLuongCaNhan={layDataLuongCaNhanHandler}
      />
      <SuaLuongNhom
        dataLuongNhom={dataLuongNhom}
        layDataLuongNhom={layDataLuongNhomHandler}
      />
      <SuaPhuPhi layDataPhuPhi={layDataPhuPhiHandler} dataPhuPhi={dataPhuPhi} />
      <CTA
        message={
          isSubmit
            ? null
            : "Chú ý : phần lương cá nhân phải chọn hết hệ số để tính thì mới được bấm nút tính bên dưới."
        }
        tongTienLuong={isSubmit ? tongLuongRender : null}
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

export default SuaLuongPage;
