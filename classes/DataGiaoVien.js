import { sortArtByLastShortName } from "../helper/uti";

const API_GETDATA_GIAOVIEN_ROUTE = "/api/giaovien/getDataGiaoVien";

class DataGiaoVien {
  static arrGiaoVien = [];
  static giaoVienChonData = {};

  static loadArrGiaoVien = (arr) => {
    this.arrGiaoVien = arr;
  };

  static loadDataGiaoVienDuocChon = (data) => {
    this.giaoVienChonData = data;
  };

  static timKiemGiaoVienTheoShortName = (key) => {
    if (!key || key === "") {
      return sortArtByLastShortName(this.arrGiaoVien);
    }
    const arrFilter = this.arrGiaoVien.filter((item) =>
      item.shortName.toLowerCase().trim().includes(key.toLowerCase().trim())
    );
    return sortArtByLastShortName(arrFilter);
  };

  static timKiemGiaoVienTheoId = (id) => {
    if (!id || id === "") {
      return null;
    }
    const giaoVienMatched = this.arrGiaoVien.find((item) => item.id === id);
    if (giaoVienMatched) {
      return giaoVienMatched;
    } else {
      return null;
    }
  };

  //Từ giáo viên chính id, chỉ lấy các giáo viên còn lại để dạy thế
  static layArrGiaoVienDayThe = (giaoVienChinhId) => {
    const arrGiaoVienClone = [...this.arrGiaoVien];
    if (giaoVienChinhId) {
      const indexGiaoVienDaChon = arrGiaoVienClone.findIndex(
        (giaovien) => giaovien.id === giaoVienChinhId
      );
      if (indexGiaoVienDaChon !== -1) {
        arrGiaoVienClone.splice(indexGiaoVienDaChon, 1);
      }
    }
    return arrGiaoVienClone;
  };

  static loadDataGiaoVienTheoId = async (id) => {
    const response = await fetch(API_GETDATA_GIAOVIEN_ROUTE, {
      method: "POST",
      body: JSON.stringify(id),
      headers: { "Content-Type": "application/json" },
    });
    const statusCode = response.status;
    const dataGot = await response.json();
    return { statusCode, dataGot };
  };
}
export default DataGiaoVien;
