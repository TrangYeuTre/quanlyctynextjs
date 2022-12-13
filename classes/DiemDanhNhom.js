const API_DDN_ROUTE = "/api/ddn/diemDanhNhom";
class DiemDanhNhom {
  constructor(dataInput) {
    this.ngayDiemDanh = dataInput.ngayDiemDanh;
    this.lopNhomId = dataInput.lopNhomId;
    this.tenLopNhom = dataInput.tenLopNhom;
  }

  async themNgayDiemDanhNhomMoi(objGiaoVien) {
    const dataSubmit = { ...this, ...objGiaoVien };
    //Fetch
    const response = await fetch(API_DDN_ROUTE, {
      method: "POST",
      body: JSON.stringify(dataSubmit),
      headers: { "Content-Type": "application/json" },
    });
    const statusCode = response.status;
    const dataGot = await response.json();
    return { statusCode, dataGot };
  }

  static async xoaNgayDiemDanhNhom(ngayDiemDanhNhomId) {
    const response = await fetch(API_DDN_ROUTE, {
      method: "DELETE",
      body: JSON.stringify(ngayDiemDanhNhomId),
      headers: { "Content-Type": "application/json" },
    });
    const statusCode = response.status;
    const dataGot = await response.json();
    return { statusCode, dataGot };
  }
}

export default DiemDanhNhom;
