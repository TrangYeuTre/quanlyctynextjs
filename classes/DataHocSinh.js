import { sortArtByLastShortName } from "../helper/uti";
const API_GET_DATA_HOCSINH_ROUTE = "/api/hocsinh/getDataHocSinh";

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

  static loadDataHocSinhTheoId = async (hocSinhId) => {
    const response = await fetch(API_GET_DATA_HOCSINH_ROUTE, {
      method: "POST",
      body: JSON.stringify(hocSinhId),
      headers: { "Content-Type": "application/json" },
    });
    const statusCode = response.status;
    const dataGot = await response.json();
    return { statusCode, dataGot };
  };
}
export default DataHocSinh;
