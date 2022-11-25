import ConnectMongoDb from "../../../helper/connectMongodb";
import { ObjectId } from "mongodb";

const handler = async (req, res) => {
  const { body, method } = req;
  //Des từ body
  const {
    ngayDiemDanhId,
    hocSinhId,
    type,
    soPhutHocMotTiet,
    giaoVienDayTheId,
    giaoVienDayTheShortName,
    giaoVienDayBuId,
    giaoVienDayBuShortName,
    ngayNghiCanBu,
    ngayDayBu,
    heSoHoanTien,
    shortName,
  } = body;
  //Xử lý trả lỗi chung nếu thiếu 3 thằng quan trọng
  if (!ngayDiemDanhId || !hocSinhId || !type || type === "") {
    return res.status(422).json({
      thongbao: "Thiếu các thông tin quan trọng để sửa ngày điểm danh.",
    });
  }
  //Xử lý input số phút học một tiết trước
  if (
    type === "dayChinh" ||
    type === "dayThe" ||
    type === "dayTangCuong" ||
    type === "dayBu"
  ) {
    if (!soPhutHocMotTiet || soPhutHocMotTiet === 0) {
      return res.status(422).json({
        thongbao:
          "Phải thiết lập giá trị cho số phút học một tiết và phải lớn hơn 0",
      });
    }
  } //end if check số phút học một tiết
  //Xử lý cho trường hợp dạy thế
  if (type === "dayThe") {
    if (
      !giaoVienDayTheId ||
      giaoVienDayTheId === "" ||
      giaoVienDayTheId == "none" ||
      !giaoVienDayTheShortName ||
      giaoVienDayTheShortName === ""
    ) {
      return res.status(422).json({
        thongbao: "Phải chọn giáo viên dạy thế nhé.",
      });
    }
  } // end if xử lý dạy thế
  //Xử lý cho trường hợp dạy bù
  if (type === "dayBu") {
    if (
      !giaoVienDayBuId ||
      giaoVienDayBuId === "" ||
      giaoVienDayBuId == "none" ||
      !giaoVienDayBuShortName ||
      giaoVienDayBuShortName === "" ||
      !ngayNghiCanBu ||
      !ngayDayBu
    ) {
      return res.status(422).json({
        thongbao: "Phải chọn giáo viên dạy bù, ngày nghỉ và ngày dạy bù.",
      });
    }
  } //end if xử lý dạy bù
  //Xử lý nghỉ
  if (type === "nghi") {
    if (!heSoHoanTien) {
      return res.status(422).json({
        thongbao: "Phải chọn hệ số hoàn tiền.",
      });
    }
  } //end if xử lý nghỉ
  //Tiến hành connect mongodb
  let client;
  let db;
  try {
    const { clientGot, dbGot } = await ConnectMongoDb();
    client = clientGot;
    db = dbGot;
  } catch (err) {
    //Chõ này không dùng được returnErrror bên trên vì chưa có client, hải res thủ công lỗi
    return res.status(500).json({ thongbao: "Lỗi kết nối đến mongodb rồi." });
  }
  //Tiến hành update lại ngày điểm danh thôi, trường hợp khác dayBu mới update lại data cua ngày đó
  if (method === "PUT") {
    try {
      //Xử lý từ body lấy lại obj update, loại đi từ body ngayDiemDanhId và hocSinhId
      let objUpdate = {};
      for (const key in body) {
        if (key !== "ngayDiemDanhId" && key !== "hocSinhId") {
          objUpdate[key] = body[key];
        }
      }
      //Xử lý nếu type dayBu thì repalce nó lại thành nghi-dayBu
      if (objUpdate.type === "dayBu") {
        objUpdate.type = "nghi dayBu";
      }
      //Tiến hành tìm ngày đỉem danh trước
      const ngayDiemDanhFound = await db
        .collection("diemdanhcanhans")
        .findOne({ _id: ObjectId(ngayDiemDanhId) });
      //Clone lại để thao tác
      let ngayClone = { ...ngayDiemDanhFound };
      //Tìm trong obj này id học sinh cần thay thế
      ngayClone[hocSinhId] = objUpdate;
      //Update lại
      await db
        .collection("diemdanhcanhans")
        .replaceOne({ _id: ObjectId(ngayDiemDanhId) }, ngayClone);
      //Xong trả
      client.close();
      return res
        .status(201)
        .json({ thongbao: "Sửa học sinh trong ngày điểm danh thành công." });
    } catch (err) {
      client.close();
      return res
        .status(500)
        .json({ thongbao: "Sửa học sinh trong ngày điểm danh lỗi." });
    }
  } //end if khác dạyBu
};
export default handler;
