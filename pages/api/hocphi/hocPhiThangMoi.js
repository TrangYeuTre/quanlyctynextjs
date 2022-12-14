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
  //Xử lý post req
  if (method === "POST") {
    //Kiểm tra data
    const { hocSinhId, ngayTinhPhi, lichDaChonNgay } = body;
    //Check
    if (
      !hocSinhId ||
      !ngayTinhPhi ||
      !lichDaChonNgay ||
      hocSinhId === "" ||
      ngayTinhPhi === ""
    ) {
      client.close();
      return res
        .status(422)
        .json({ thongbao: "Thiếu thông tin để tính học phí tháng mới." });
    }
    //Lấy 2 đầu của tháng này kiểm tra xem ngay tính phí đã tồn tại hay chưa
    const { firstDateOfThisMonth, lastDateOfThisMonth } =
      getFirstLastDateOfThisMonth(ngayTinhPhi);
    try {
      //TÌm xem đã tính phí trong thagns này chưa
      const tinhPhiTonTai = await db.collection("hocphis").findOne({
        hocSinhId: hocSinhId,
        ngayTinhPhi: {
          $gte: firstDateOfThisMonth,
          $lte: lastDateOfThisMonth,
        },
      });
      //Chưa tồn tại thì thêm mới
      if (!tinhPhiTonTai) {
        //Thêm hp tháng mới
        await db.collection("hocphis").insertOne(body);
        client.close();
        return res
          .status(200)
          .json({ thongbao: "Tính phí tháng mới thành công." });
      } else {
        //Sửa hp đã tồn tại
        await db.collection("hocphis").updateOne(
          {
            hocSinhId: hocSinhId,
            ngayTinhPhi: {
              $gte: firstDateOfThisMonth,
              $lte: lastDateOfThisMonth,
            },
          },
          { $set: { lichDaChonNgay: lichDaChonNgay } }
        );
        //Trả
        client.close();
        return res
          .status(201)
          .json({ thongbao: "Cập nhật học phí tháng thành công" });
      }
    } catch (err) {
      client.close();
      return res.status(500).json({ thongbao: "Tính học phí tháng mới lỗi." });
    }
  }
};

export default handler;
