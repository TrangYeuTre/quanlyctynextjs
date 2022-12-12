const API_GIAOVIEN_ROUTE = "/api/giaovien/giaoVien";
const API_GV_HSPHUTRACH_ROUTE = "/api/giaovien/hocSinhPhuTrachChoGiaoVien";
const API_GV_LICH_ROUTE = "/api/giaovien/lichChoHocSinhCuaGiaoVien";

class GiaoVien {
  constructor(inputData) {
    this.tenGiaoVien = inputData.tenGiaoVien;
    this.shortName = inputData.shortName;
    this.gioiTinh = inputData.gioiTinh;
    this.ngaySinh = inputData.ngaySinh;
    this.luongCaNhan = +inputData.luongCaNhan;
    this.luongNhom = +inputData.luongNhom;
    this.soDienThoai = inputData.soDienThoai;
    this.diaChi = inputData.diaChi;
    this.thongTinCoBan = inputData.thongTinCoBan;
    this.hocTroCaNhan = inputData.hocTroCaNhan;
    this.lichDayCaNhan = inputData.lichDayCaNhan;
  }

  async themGiaoVien() {
    //Tiến hành fetch thôi
    const response = await fetch(API_GIAOVIEN_ROUTE, {
      method: "POST",
      body: JSON.stringify(this),
      headers: { "Content-Type": "application/json" },
    });
    const statusCode = response.status;
    const dataGot = await response.json();
    return { statusCode, dataGot };
  }

  async suaGiaoVien(giaoVienSuaId) {
    //Tổng hợp lại data submit
    const dataSubmit = { ...this, giaoVienSuaId: giaoVienSuaId };
    //Chạy fetch
    const response = await fetch(API_GIAOVIEN_ROUTE, {
      method: "PUT",
      body: JSON.stringify(dataSubmit),
      headers: { "Content-Type": "application/json" },
    });
    const statusCode = response.status;
    const dataGot = await response.json();
    return { statusCode, dataGot };
  }

  static async xoaGiaoVien(giaoVienId) {
    const response = await fetch(API_GIAOVIEN_ROUTE, {
      method: "DELETE",
      body: JSON.stringify(giaoVienId),
      headers: { "Content-Type": "application/json" },
    });
    const statusCode = response.status;
    const dataGot = await response.json();
    return { statusCode, dataGot };
  }

  static async updateHocSinhPhuTrach(giaoVienDuocChonId, arrHocSinhDuocChon) {
    //Tổng hợp lại data submit
    const dataSubmit = {
      idGiaoVien: giaoVienDuocChonId,
      arrHocSinhChon: arrHocSinhDuocChon,
    };
    //Fetch lên db để cập nhật mảng hocTroCaNhan cho giáo viên
    const response = await fetch(API_GV_HSPHUTRACH_ROUTE, {
      method: "PUT",
      body: JSON.stringify(dataSubmit),
      headers: { "Content-Type": "application/json" },
    });
    const statusCode = response.status;
    const dataGot = await response.json();
    return { statusCode, dataGot };
  }

  static async updateLichGiaoVien(dataSubmit) {
    //Tiến hành fetch nào
    const response = await fetch(API_GV_LICH_ROUTE, {
      method: "POST",
      body: JSON.stringify(dataSubmit),
      headers: { "Content-Type": "application/json" },
    });
    const statusCode = response.status;
    const dataGot = await response.json();
    return { statusCode, dataGot };
  }

  static async xoaLichGiaoVien(id, giaoVienDuocChonId) {
    const response = await fetch(API_GV_LICH_ROUTE, {
      method: "DELETE",
      body: JSON.stringify({ lichId: id, giaoVienId: giaoVienDuocChonId }),
      headers: { "Content-Type": "application/json" },
    });
    const statusCode = response.status;
    const dataGot = await response.json();
    return { statusCode, dataGot };
  }
}

export default GiaoVien;
