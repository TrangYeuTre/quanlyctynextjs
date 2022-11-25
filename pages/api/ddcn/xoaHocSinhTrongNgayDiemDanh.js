import ConnectMongoDb from "../../../helper/connectMongodb";
import { ObjectId } from "mongodb";

const handler = async (req, res) => {
  const { body, method } = req;
  const { ngayDiemDanhId, hocSinhId } = body;
  //Xử lý body
  if (!ngayDiemDanhId && !hocSinhId) {
    return res.status(422).json({
      thongbao:
        "Thiếu id học sinh hoặc id ngày điểm danh để xóa học sinh trong ngày điểm danh.",
    });
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
  //Xử lý xóa hs
  if (method === "DELETE") {
    try {
      const ngayDiemDanh = await db
        .collection("diemdanhcanhans")
        .findOne({ _id: ObjectId(ngayDiemDanhId) });
      //clone nó lại đẻ xóa học sinh bên trong
      let ngayDdClone = { ...ngayDiemDanh };
      //Xóa prop id học sinh tương ứng
      delete ngayDdClone[hocSinhId];
      //Cập nhật lại
      await db
        .collection("diemdanhcanhans")
        .replaceOne({ _id: ObjectId(ngayDiemDanhId) }, ngayDdClone);
      //Trả
      client.close();
      return res
        .status(201)
        .json({ thongbao: "Xóa học sinh trong ngày điểm danh thành công." });
    } catch (err) {
      client.close();
      return res
        .status(500)
        .json({ thongbao: "Xóa học sinh trong ngày điểm danh lỗi." });
    }
  }
};
export default handler;
