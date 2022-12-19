const HS_API_ROUTE = "/api/hocsinh/hocSinh";

class HocSinh {
  constructor(inputData) {
    this.lopHoc = inputData.lopHoc;
    this.gioiTinh = inputData.gioiTinh;
    this.tenHocSinh = inputData.tenHocSinh;
    this.shortName = inputData.shortName;
    this.ngaySinh = inputData.ngaySinh;
    this.soPhutHocMotTiet = +inputData.soPhutHocMotTiet;
    this.hocPhiCaNhan = +inputData.hocPhiCaNhan;
    this.hocPhiNhom = +inputData.hocPhiNhom;
    this.tenPhuHuynh = inputData.tenPhuHuynh;
    this.soDienThoai = inputData.soDienThoai;
    this.diaChi = inputData.diaChi;
    this.thongTinCoBan = inputData.thongTinCoBan;
  }

  async themHocSinhMoi() {
    //FETCH HERE
    const response = await fetch(HS_API_ROUTE, {
      method: "POST",
      body: JSON.stringify(this),
      headers: { "Content-Type": "application/json" },
    });
    const statusCode = response.status;
    const dataGot = await response.json();
    return { statusCode, dataGot };
  }

  async suaHocSinh(hocSinhId) {
    const dataSubmit = { ...this, hocSinhId: hocSinhId };
    //FETCH HERE
    const response = await fetch(HS_API_ROUTE, {
      method: "PUT",
      body: JSON.stringify(dataSubmit),
      headers: { "Content-Type": "application/json" },
    });
    const statusCode = response.status;
    const dataGot = await response.json();
    return { statusCode, dataGot };
  }

  static async xoaHocSinh(hocSinhId) {
    const response = await fetch(HS_API_ROUTE, {
      method: "DELETE",
      body: JSON.stringify(hocSinhId),
      headers: { "Content-Type": "application/json" },
    });
    const statusCode = response.status;
    const dataGot = await response.json();
    return { statusCode, dataGot };
  }
}

export default HocSinh;
