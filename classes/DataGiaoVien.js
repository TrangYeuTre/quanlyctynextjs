import { sortArtByLastShortName } from "../helper/uti";

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
}
export default DataGiaoVien;
