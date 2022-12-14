import { sortArtByLastShortName } from "../helper/uti";

class DataHocSinh {
  static arrHocSinhCaNhan = [];
  static arrHocSinhNhom = [];

  static loadArrHocSinhCaNhan = (arr) => {
    this.arrHocSinhCaNhan = sortArtByLastShortName(arr);
  };

  static loadArrHocSinhNhom = (arr) => {
    this.arrHocSinhNhom = sortArtByLastShortName(arr);
  };

  static loadHocSinhChon = (obj) => {
    this.hocSinhChon = obj;
  };

  static timKiemHsCaNhanTheoShortName = (key) => {
    if (key) {
      const arrFilter = this.arrHocSinhCaNhan.filter((item) =>
        item.shortName.toLowerCase().trim().includes(key.toLowerCase().trim())
      );
      return sortArtByLastShortName(arrFilter);
    } else {
      return sortArtByLastShortName(this.arrHocSinhCaNhan);
    }
  };

  static timKiemHsNhomTheoShortName = (key) => {
    if (!key || key === "") {
      return sortArtByLastShortName(this.arrHocSinhNhom);
    }
    const arrFilter = this.arrHocSinhNhom.filter((item) =>
      item.shortName.toLowerCase().trim().includes(key.toLowerCase().trim())
    );
    return sortArtByLastShortName(arrFilter);
  };

  static traHsCaNhanData = (id) => {
    const hsMatched = this.arrHocSinhCaNhan.find((item) => item.id === id);
    if (hsMatched) {
      return hsMatched;
    }
  };
}
export default DataHocSinh;
