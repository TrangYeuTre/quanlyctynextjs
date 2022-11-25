import ConnectMongoDb from "../../../helper/connectMongodb";

const handler = async (req, res) => {
  //Lấy data
  const { body, method } = req;
  //Check đầu vào
  const { giaoVienId, shortName, ngayDiemDanh } = body;
  if (!giaoVienId || !shortName || !ngayDiemDanh) {
    return res.status(422).json({ thongbao: "Data submit ddcn có vấn đề." });
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
      // Tìm ngày dd đã tồn tại chưa, nếu chưa thì thêm mới/ không thì đè lên
      const ngayDiemDanhExist = await db
        .collection("diemdanhcanhans")
        .findOne({ ngayDiemDanh: ngayDiemDanh });
      if (!ngayDiemDanhExist) {
        await db.collection("diemdanhcanhans").insertOne(body);
      } else {
        await db
          .collection("diemdanhcanhans")
          .replaceOne({ ngayDiemDanh: ngayDiemDanh }, body);
      }
      client.close();
      return res
        .status(200)
        .json({ thongbao: "Điểm danh cá nhân thành công." });
    } catch (err) {
      console.log(err);
      client.close();
      return res.status(500).json({ thongbao: "Điểm danh cá nhân lỗi." });
    }
  } //end if post
};

export default handler;
