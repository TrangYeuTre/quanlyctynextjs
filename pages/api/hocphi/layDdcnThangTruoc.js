import ConnectMongoDb from "../../../helper/connectMongodb";
import { ObjectId } from "mongodb";
import { getFirstLastDateOfPrevMonth } from "../../../helper/uti";

const handler = async (req, res) => {
  const { method, body } = req;
  //Kiểm tra đầu vào
  const { hocSinhId, ngayTinhPhi } = body;
  if (!hocSinhId || !ngayTinhPhi || hocSinhId === "" || ngayTinhPhi === "") {
    return res.status(422).json({
      thongbao:
        "Thiếu học sinh id hoặc ngày tính phí để lấy ddcn tháng trước cho tính phí.",
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
    const { firstDateOfPrevMonth, lastDateOfPrevMonth } =
      getFirstLastDateOfPrevMonth(ngayTinhPhi);
    try {
      //Lấy ddcn
      const arrDdcnGot = await db
        .collection("diemdanhcanhans")
        .find({
          [hocSinhId]: { $exists: true },
          ngayDiemDanh: {
            $gte: firstDateOfPrevMonth,
            $lte: lastDateOfPrevMonth,
          },
        })
        .toArray();
      console.log(arrDdcnGot);
      //Trả
      client.close();
      return res.status(201).json({
        thongbao: "Lấy ddcn tháng trước thành công",
        data: arrDdcnGot,
      });
    } catch (err) {
      //Trả
      client.close();
      return res.status(500).json({
        thongbao: "Lấy ddcn tháng trước lỗi.",
        data: null,
      });
    }
  }
};

export default handler;
