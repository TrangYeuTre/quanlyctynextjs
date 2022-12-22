const API_GETDATA_DDN_ROUTE = "/api/ddn/getDataDiemDanhNhom";

class DataDiemDanhNhom {
  static loadDataDiemDanhNhom = async (lopNhomChonId, ngayThongKe) => {
    try {
      const response = await fetch(API_GETDATA_DDN_ROUTE, {
        method: "POST",
        body: JSON.stringify({
          lopNhomChonId: lopNhomChonId,
          ngayThongKe: ngayThongKe,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const statusCode = response.status;
      const dataGot = await response.json();
      return { statusCode, dataGot };
    } catch (err) {
      throw new Error("Lấy data điểm danh nhóm lỗi.");
    }
  };
}
export default DataDiemDanhNhom;
