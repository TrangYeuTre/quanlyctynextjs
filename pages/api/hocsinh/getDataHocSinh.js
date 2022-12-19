import ConnectMongoDb from "../../../helper/connectMongodb";
import { ObjectId } from "mongodb";

const handler = async (req, res) => {
  const { method, body } = req;

  let client;
  let db;
  try {
    const { clientGot, dbGot } = await ConnectMongoDb();
    client = clientGot;
    db = dbGot;
  } catch (err) {
    return res.status(500).json({ thongbao: "Lỗi kết nối đến mongodb rồi." });
  }

  if (method === "POST") {
    try {
      const hocSinhFound = await db
        .collection("hocsinhs")
        .findOne({ _id: ObjectId(body) });
      if (!hocSinhFound) {
        client.close();
        return res
          .status(404)
          .json({ thongbao: "Không tìm thấy học sinh để lấy data." });
      }
      client.close();
      return res
        .status(201)
        .json({ thongbao: "Lấy data học sinh thành công", data: hocSinhFound });
    } catch (err) {
      client.close();
      return res.status(500).json({ thongbao: "Lấy data học sinh lỗiÏ" });
    }
  }
};

export default handler;
