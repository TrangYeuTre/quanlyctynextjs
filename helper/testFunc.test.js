import { expect, it } from "vitest";

import tinhTong from "./testFunc";

it("test tính tổng của mảng số", () => {
  //Arrange giá tri đầu vào
  const mangDauVao = [10, 20, 30];
  //Act theo arrange nè
  const ketQua = tinhTong(mangDauVao);
  //Assert tạo mong đợi
  const ketQuaMongDoi = mangDauVao.reduce((cv, tong) => cv + tong);
  expect(ketQua).toBe(ketQuaMongDoi);
});
