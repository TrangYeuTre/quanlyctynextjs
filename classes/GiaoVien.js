const API_GIAOVIEN_ROUTE = "/api/giaovien/giaoVien";
const API_GV_HSPHUTRACH_ROUTE = "/api/giaovien/hocSinhPhuTrachChoGiaoVien";
const API_GV_LICH_ROUTE = "/api/giaovien/lichChoHocSinhCuaGiaoVien";

class GiaoVien {
  constructor(
    tenGiaoVien,
    shortName,
    gioiTinh,
    ngaySinh,
    luongCaNhan,
    luongNhom,
    soDienThoai,
    diaChi,
    thongTinCoBan,
    hocTroCaNhan,
    lichDayCaNhan
  ) {
    this.tenGiaoVien = tenGiaoVien;
    this.shortName = shortName;
    this.gioiTinh = gioiTinh;
    this.ngaySinh = ngaySinh;
    this.luongCaNhan = +luongCaNhan;
    this.luongNhom = +luongNhom;
    this.soDienThoai = soDienThoai;
    this.diaChi = diaChi;
    this.thongTinCoBan = thongTinCoBan;
    this.hocTroCaNhan = hocTroCaNhan;
    this.lichDayCaNhan = lichDayCaNhan;
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
