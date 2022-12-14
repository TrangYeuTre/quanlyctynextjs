const API_HOCPHI_ROUTE = "/api/hocphi/hocPhiThangMoi";
const API_HOCPHI_DAUVAO = "/api/hocphi/locThongTinDauVao";

class HocPhiHocSinh {
  constructor(inputData) {
    this.ngayTinhPhi = inputData.ngayTinhPhi;
    this.hocSinhId = inputData.hocSinhId;
    this.lichDaChonNgay = inputData.lichDaChonNgay;
  }

  static async xuLyDauVao(dataSubmit) {
    const response = await fetch(API_HOCPHI_DAUVAO, {
      method: "POST",
      body: JSON.stringify(dataSubmit),
      headers: { "Content-Type": "application/json" },
    });
    const statusCode = response.status;
    const dataGot = await response.json();
    return { statusCode, dataGot };
  }

  //Ghi chú: thêm mới và cập nhật học phí tháng hs cùng một func này
  async themHocPhiHocSinh() {
    const response = await fetch(API_HOCPHI_ROUTE, {
      method: "POST",
      body: JSON.stringify(this),
      headers: { "Content-Type": "application/json" },
    });
    const statusCode = response.status;
    const dataGot = await response.json();
    return { statusCode, dataGot };
  }
}

export default HocPhiHocSinh;
