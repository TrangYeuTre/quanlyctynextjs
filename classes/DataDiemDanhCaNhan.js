const API_GETDATA_DDCN_ROUTE = "/api/ddcn/getDataDdcn";

class DataDiemDanhCaNhan {
  static arrDiemDanhCaNhan = [];
  // static arrDdcnByNgayVaGiaoVienId = [];

  static loadArrDiemDanhCaNhan = (arr) => {
    this.arrDiemDanhCaNhan = arr;
  };

  static loadArrDdcnByNgayVaGiaoVienId = async (dataSubmit) => {
    const { giaoVienId, ngayThongKe } = dataSubmit;
    try {
      const response = await fetch(API_GETDATA_DDCN_ROUTE, {
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
}
export default DataDiemDanhCaNhan;
