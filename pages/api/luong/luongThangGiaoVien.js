import ConnectMongoDb from "../../../helper/connectMongodb";
import { ObjectId } from "mongodb";
import { getFirstLastDateOfThisMonth } from "../../../helper/uti";

const handler = async (req, res) => {
  const { method, body } = req;
  //Tạo biến chứa client và database
  let client;
  let db;
  //Kết nối db trước
  try {
    const { clientGot, dbGot } = await ConnectMongoDb();
    client = clientGot;
    db = dbGot;
  } catch (err) {
    //Chõ này không dùng được returnErrror bên trên vì chưa có client, hải res thủ công lỗi
    return res.status(500).json({ thongbao: "Lỗi kết nối đến mongodb rồi." });
  }
  //Xử lý chính tinh lương tháng mới
  if (method === "POST") {
    //Check input
    const { giaoVienId, ngayTinhLuong } = body;
    if (
      !giaoVienId ||
      !ngayTinhLuong ||
      giaoVienId === "" ||
      ngayTinhLuong === ""
    ) {
      return res.status(422).json({
        thongbao: "Thiếu giáo viên id hoặc ngày để tính lương giáo viên.",
      });
    }
    //Lấy biên 2 ngày của tháng đẻ lọc
    const { firstDateOfThisMonth, lastDateOfThisMonth } =
      getFirstLastDateOfThisMonth(ngayTinhLuong);
    //Lấy data
    try {
      //Tìm xem lương tháng này được tính chưa, chưa mới tính không thì trả về
      const luongThangFound = await db.collection("luongs").findOne({
        giaoVienId: giaoVienId,
        ngayTinhLuong: {
          $gte: firstDateOfThisMonth,
          $lte: lastDateOfThisMonth,
        },
      });
      if (luongThangFound) {
        client.close();
        return res.status(403).json({
          thongbao:
            "Lương tháng của giáo viên này đã tồn tại. Vui lòng chọn lại để sửa nó.",
        });
      } else {
        //Thêm mới
        await db.collection("luongs").insertOne(body);
        client.close();
        return res
          .status(200)
          .json({ thongbao: "Tính lương tháng giáo viên thành công." });
      }
    } catch (err) {
      client.close();
      return res.status(500).json({
        thongbao: "Tính lương tháng giáo viên lỗi.",
      });
    }
  }
  //Xử lý chính tinh lương tháng mới
  if (method === "PUT") {
    //Check input
    const { luongThangId, dataUpdate } = body;
    if (
      !luongThangId ||
      luongThangId == "" ||
      Object.keys(dataUpdate).length === 0
    ) {
      return res.status(422).json({
        thongbao: "Thiếu lương tháng id hoặc data update lại lương tháng.",
      });
    }
    //Lấy data
    try {
      await db
        .collection("luongs")
        .findOneAndReplace({ _id: ObjectId(luongThangId) }, dataUpdate);
      return res.status(200).json({thongbao:'Sửa lương tháng giáo viên thành công'})
    } catch (err) {
      client.close();
      return res.status(500).json({
        thongbao: "Sửa lương tháng giáo viên lỗi",
      });
    }
  }
};

export default handler;
