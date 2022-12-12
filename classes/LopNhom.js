const API_LOPNHOM_ROUTE = "/api/lopnhom/lopNhom";

class LopNhom {
  constructor(inputData) {
    this.tenLopNhom = inputData.tenLopNhom;
    this.giaoVienLopNhom = inputData.giaoVienLopNhom;
    this.hocSinhLopNhom = inputData.hocSinhLopNhom;
  }

  async themLopNhom() {
    //Chạy submit
    const response = await fetch(API_LOPNHOM_ROUTE, {
      method: "POST",
      body: JSON.stringify(this),
      headers: { "Content-Type": "application/json" },
    });
    const statusCode = response.status;
    const dataGot = await response.json();
    return { statusCode, dataGot };
  }

  async suaLopNhom(lopNhomId) {
    //Tổng hợp lại dataSubmit
    const dataSubmit = { ...this, lopNhomId: lopNhomId };
    //Chạy submit
    const response = await fetch(API_LOPNHOM_ROUTE, {
      method: "PUT",
      body: JSON.stringify(dataSubmit),
      headers: { "Content-Type": "application/json" },
    });
    const statusCode = response.status;
    const dataGot = await response.json();
    return { statusCode, dataGot };
  }

  static async xoaLopNhom(lopNhomId) {
    const response = await fetch(API_LOPNHOM_ROUTE, {
      method: "DELETE",
      body: JSON.stringify(lopNhomId),
      headers: { "Content-Type": "application/json" },
    });
    const statusCode = response.status;
    const dataGot = await response.json();
    return { statusCode, dataGot };
  }
}

export default LopNhom;
