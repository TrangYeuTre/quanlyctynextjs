const API_DDCN_DAYCHINH_ROUTE = "/api/ddcn/diemDanhDayChinh";
const API_DDCN_DAYTHE_ROUTE = "/api/ddcn/diemDanhDayThe";
const API_DDCN_SUANGAY_ROUTE = "/api/ddcn/suaNgayDiemDanh";
const API_DDCN_XOAHSNGAY_ROUTE = "/api/ddcn/xoaHocSinhTrongNgayDiemDanh";
const API_DDCN_XOANGAY_ROUTE = "/api/ddcn/xoaNgayDiemDanh";

class DiemDanhCaNhan {
  constructor(dataInput) {
    this.ngayDiemDanh = dataInput.ngayDiemDanh;
    this.giaoVienId = dataInput.giaoVienId;
    this.shortName = dataInput.shortName;
  }

  async themDiemDanhDayChinhMoi(objHocSinhData) {
    //Tổng hợp lại data submit
    const dataSubmit = { ...this, ...objHocSinhData };
    const response = await fetch(API_DDCN_DAYCHINH_ROUTE, {
      method: "POST",
      body: JSON.stringify(dataSubmit),
      headers: { "Content-Type": "application/json" },
    });
    const statusCode = response.status;
    const dataGot = await response.json();
    return { statusCode, dataGot };
  }

  async themDiemDanhDayTheMoi(objHocSinhData) {
    //Tổng hợp lại data submit
    const dataSubmit = { ...this, ...objHocSinhData };
    const response = await fetch(API_DDCN_DAYTHE_ROUTE, {
      method: "POST",
      body: JSON.stringify(dataSubmit),
      headers: { "Content-Type": "application/json" },
    });
    const statusCode = response.status;
    const dataGot = await response.json();
    return { statusCode, dataGot };
  }

  static async suaNgayDiemDanhCaNhan(dataSubmit) {
    const response = await fetch(API_DDCN_SUANGAY_ROUTE, {
      method: "PUT",
      body: JSON.stringify(dataSubmit),
      headers: { "Content-Type": "application/json" },
    });
    const statusCode = response.status;
    const dataGot = await response.json();
    return { statusCode, dataGot };
  }

  static async xoaHocSinhTrongNgayDiemDanhCaNhan(hocSinhId, ngayDiemDanhId) {
    const response = await fetch(API_DDCN_XOAHSNGAY_ROUTE, {
      method: "DELETE",
      body: JSON.stringify({
        ngayDiemDanhId: ngayDiemDanhId,
        hocSinhId: hocSinhId,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const statusCode = response.status;
    const dataGot = await response.json();
    return { statusCode, dataGot };
  }

  static async xoaNgayDiemDanhCaNhan(ngayDiemDanhId) {
    const response = await fetch(API_DDCN_XOANGAY_ROUTE, {
      method: "DELETE",
      body: JSON.stringify(ngayDiemDanhId),
      headers: { "Content-Type": "application/json" },
    });
    const statusCode = response.status;
    const dataGot = await response.json();
    return { statusCode, dataGot };
  }
}

export default DiemDanhCaNhan;
