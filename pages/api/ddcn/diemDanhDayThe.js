import ConnectMongoDb from "../../../helper/connectMongodb";

const handler = async (req, res) => {
  //Lấy data
  const { body, method } = req;
  //Check đầu vào
  const { giaoVienId, ngayDiemDanh } = body;
  if (!giaoVienId || !ngayDiemDanh) {
    return res
      .status(422)
      .json({ thongbao: "Data submit điểm danh dạy thế có vấn đề." });
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
  if (method === "POST") {
    try {
      await db.collection("diemdanhcanhans").insertOne(body);
      client.close();
      return res
        .status(200)
        .json({ thongbao: "Điểm danh dạy thế thành công." });
    } catch (err) {
      client.close();
      return res.status(500).json({ thongbao: "Điểm danh dạy thế lỗi." });
    }
  } //end if post
};

export default handler;
