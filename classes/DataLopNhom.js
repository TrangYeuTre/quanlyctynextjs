class DataLopNhom {
  static arrLopNhom = [];
  static lopNhomChonData = {};

  static loadArrLopNhom = (arr) => {
    this.arrLopNhom = arr;
  };

  static loadLopNhomData = (data) => {
    this.lopNhomChonData = data;
  };

  static traTenLopNhomChon = (lopNhomId) => {
    let tenLopNhom = "";
    if (lopNhomId) {
      const itemMatched = this.arrLopNhom.find((item) => item.id === lopNhomId);
      if (itemMatched) {
        tenLopNhom = itemMatched.tenLopNhom;
      }
    }
    return tenLopNhom;
  };
}
export default DataLopNhom;
