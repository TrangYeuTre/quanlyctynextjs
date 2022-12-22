const API_GETDATA_DDCN_GIAOVIEN_ROUTE = "/api/ddcn/getDataDdcnByGiaoVienId";
const API_GETDATA_DDCN_HOCSINH_ROUTE = "/api/ddcn/getDataDdcnByHocSinhId";

class DataDiemDanhCaNhan {
  static arrDiemDanhCaNhan = [];
  static loadArrDiemDanhCaNhan = (arr) => {
    this.arrDiemDanhCaNhan = arr;
  };

  static loadArrDdcnByNgayVaGiaoVienId = async (dataSubmit) => {
    const { giaoVienId, ngayThongKe } = dataSubmit;
    try {
      const response = await fetch(API_GETDATA_DDCN_GIAOVIEN_ROUTE, {
        method: "POST",
        body: JSON.stringify({
          giaoVienId: giaoVienId,
          ngayThongKe: ngayThongKe,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const statusCode = response.status;
      const dataGot = await response.json();
      return { statusCode, dataGot };
    } catch (err) {
      return;
    }
  };

  static loadArrDdcnByNgayVaHocSinhId = async (dataSubmit) => {
    const { hocSinhId, ngayThongKe } = dataSubmit;
    try {
      const response = await fetch(API_GETDATA_DDCN_HOCSINH_ROUTE, {
        method: "POST",
        body: JSON.stringify({
          hocSinhId: hocSinhId,
          ngayThongKe: ngayThongKe,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const statusCode = response.status;
      const dataGot = await response.json();
      return { statusCode, dataGot };
    } catch (err) {
      return;
    }
  };
}
export default DataDiemDanhCaNhan;
