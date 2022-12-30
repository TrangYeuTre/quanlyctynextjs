const API_LUONG_ROUTE = "/api/luong/luongThangGiaoVien";
const API_HOCPHI_DAUVAO = "/api/luong/locThongTinDauVao";

class LuongGiaoVien {
  constructor(inputData) {
    this.giaoVienId = inputData.giaoVienId;
    this.shortName = inputData.shortName;
    this.ngayTinhLuong = inputData.ngayTinhLuong;
    this.dataLuongCaNhan = inputData.dataLuongCaNhan;
    this.dataLuongNhom = inputData.dataLuongNhom;
    this.dataPhuPhi = inputData.dataPhuPhi;
    this.tongLuongThang = inputData.tongLuongThang;
  }

  static async xuLyThongTinDauVao(dataSubmit) {
    const response = await fetch(API_HOCPHI_DAUVAO, {
      method: "POST",
      body: JSON.stringify(dataSubmit),
      headers: { "Content-Type": "application/json" },
    });
    const statusCode = response.status;
    const dataGot = await response.json();
    return { statusCode, dataGot };
  }

  async themLuongGiaoVien() {
    const response = await fetch(API_LUONG_ROUTE, {
      method: "POST",
      body: JSON.stringify(this),
      headers: { "Content-Type": "application/json" },
    });
    const statusCode = response.status;
    const dataGot = await response.json();
    return { statusCode, dataGot };
  }

  async suaLuongGiaoVien(luongThangId) {
    const dataSubmit = { luongThangId: luongThangId, dataUpdate: this };
    const response = await fetch(API_LUONG_ROUTE, {
      method: "PUT",
      body: JSON.stringify(dataSubmit),
      headers: { "Content-Type": "application/json" },
    });
    const statusCode = response.status;
    const dataGot = await response.json();
    return { statusCode, dataGot };
  }
}

export default LuongGiaoVien;
