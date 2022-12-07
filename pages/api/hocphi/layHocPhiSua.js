import ConnectMongoDb from "../../../helper/connectMongodb";
import { ObjectId } from "mongodb";
import { getFirstLastDateOfThisMonth } from "../../../helper/uti";

const handler = async (req, res) => {
  const { method, body } = req;
  //Kiểm tra đầu vào
  const { hocSinhId, ngayTinhPhi } = body;
  if (!hocSinhId || !ngayTinhPhi || hocSinhId === "" || ngayTinhPhi === "") {
    return res.status(422).json({
      thongbao: "Thiếu học sinh id hoặc ngày tính phí để lấy data học phí sửa.",
    });
  }
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

  //Xử lý chính
  if (method === "POST") {
    //Xử lý lấy ngày đầu và tháng trước
    const { firstDateOfThisMonth, lastDateOfThisMonth } =
      getFirstLastDateOfThisMonth(ngayTinhPhi);
    try {
      //Lấy học phí datas sửa
      const objHocPhi = await db.collection("hocphis").findOne({
        hocSinhId: hocSinhId,
        ngayTinhPhi: {
          $gte: firstDateOfThisMonth,
          $lte: lastDateOfThisMonth,
        },
      });

      //Trả
      client.close();
      return res.status(201).json({
        thongbao: "Lấy học phí data sửa thành công",
        data: objHocPhi,
      });
    } catch (err) {
      //Trả
      client.close();
      return res.status(500).json({
        thongbao: "Lấy học phí data sửa lỗi.",
        data: null,
      });
    }
  }
};

export default handler;
