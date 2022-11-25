import ConnectMongoDb from "../../../helper/connectMongodb";
import { ObjectId } from "mongodb";

const handler = async (req, res) => {
  //Lấy data
  const { body, method } = req;
  //Check đầu vào
  if (!body) {
    return res
      .status(422)
      .json({ thongbao: "Không có id phù hợp để xóa ngày điểm danh cá nhân." });
  }

  //Kết nối mongodb
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
  //Xử lý điểm danh
  if (method === "DELETE") {
    try {
      await db
        .collection("diemdanhcanhans")
        .findOneAndDelete({ _id: ObjectId(body) });
      client.close();
      return res
        .status(201)
        .json({ thongbao: "Xóa ngày điểm danh cá nhân thành công." });
    } catch (err) {
      client.close();
      return res
        .status(500)
        .json({ thongbao: "Xóa ngày điểm danh cá nhân lỗi." });
    }
  } //end if post
};

export default handler;
