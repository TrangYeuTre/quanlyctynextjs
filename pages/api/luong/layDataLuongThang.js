import ConnectMongoDb from "../../../helper/connectMongodb";
import { ObjectId } from "mongodb";

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
  //Xử lý lấy lương tháng
  if (method === "POST") {
    try {
      const luongThangFound = await db
        .collection("luongs")
        .findOne({ _id: ObjectId(body) });
      luongThangFound._id = luongThangFound._id.toString();
      client.close();
      return res.status(201).json({
        thongbao: "Lấy lương tháng giáo viên thành công.",
        data: luongThangFound,
      });
    } catch (err) {
      client.close();
      return res.status(500).json({
        thongbao: "Không tìm thấy lương tháng giáo viên để get.",
      });
    }
  }
};

export default handler;
