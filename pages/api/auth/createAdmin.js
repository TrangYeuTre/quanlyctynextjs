import { hash } from "bcryptjs";
import ConnectMongoDb from "../../../helper/connectMongodb";

const handler = async (req, res) => {
  const { body, method } = req;
  const { username, password, role } = body;
  if (!username || !password || !role) {
    return res
      .status(422)
      .json({ thongbao: "Thiếu thông tin cung cấp tạo tk admin." });
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
  //Tạo tk admin nào
  try {
    const passwordHashed = await hash(password, 12);
    await db
      .collection("auths")
      .insertOne({ username: username, password: passwordHashed, role: role });
    client.close();
    return res.status(200).json({ thongbao: "Tạo tk admin thành công." });
  } catch (err) {}
};

export default handler;
