const tinhTong = (arrNumber) => {
  const tong = arrNumber.reduce((cv, tong) => cv + tong);
  return tong;
};
export default tinhTong;

