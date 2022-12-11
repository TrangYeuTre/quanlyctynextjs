const HS_API_ROUTE = "/api/hocsinh/hocSinh";

class HocSinh {
  constructor(
    // hocSinhId,
    lopHoc,
    gioiTinh,
    tenHocSinh,
    shortName,
    ngaySinh,
    soPhutHocMotTiet,
    hocPhiCaNhan,
    hocPhiNhom,
    tenPhuHuynh,
    soDienThoai,
    diaChi,
    thongTinCoBan
  ) {
    // this.hocSinhId = hocSinhId;
    this.lopHoc = lopHoc;
    this.gioiTinh = gioiTinh;
    this.tenHocSinh = tenHocSinh;
    this.shortName = shortName;
    this.ngaySinh = ngaySinh;
    this.soPhutHocMotTiet = +soPhutHocMotTiet;
    this.hocPhiCaNhan = +hocPhiCaNhan;
    this.hocPhiNhom = +hocPhiNhom;
    this.tenPhuHuynh = tenPhuHuynh;
    this.soDienThoai = soDienThoai;
    this.diaChi = diaChi;
    this.thongTinCoBan = thongTinCoBan;
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
