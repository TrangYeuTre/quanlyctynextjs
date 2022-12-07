import ConnectMongoDb from "../../../helper/connectMongodb";
import { getFirstLastDateOfThisMonth } from "../../../helper/uti";

const handler = async (req, res) => {
  const { method, body } = req;
  //Check input
  const { giaoVienId, ngayDauThang } = body;
  if (
    !giaoVienId ||
    !ngayDauThang ||
    giaoVienId === "" ||
    ngayDauThang === ""
  ) {
    return res.status(422).json({
      thongbao:
        "Thiếu giáo viên id hoặc ngày lọc để lấy thông tin điểm danh của giáo viên.",
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
    //Lấy biên 2 ngày của tháng đẻ lọc
    const { firstDateOfThisMonth, lastDateOfThisMonth } =
      getFirstLastDateOfThisMonth(ngayDauThang);
    //Tạo magnr chứa kq
    let arrDdcn = [];
    let arrDdn = [];
    //Lấy data
    try {
      const arrDdcnGot = await db
        .collection("diemdanhcanhans")
        .find({
          giaoVienId: giaoVienId,
          ngayDiemDanh: {
            $gte: firstDateOfThisMonth,
            $lte: lastDateOfThisMonth,
          },
        })
        .toArray();
      const arrDdnGot = await db
        .collection("diemdanhnhoms")
        .find({
          [giaoVienId]: { $exists: true },
          ngayDiemDanh: {
            $gte: firstDateOfThisMonth,
            $lte: lastDateOfThisMonth,
          },
        })
        .toArray();
      arrDdcn = arrDdcnGot;
      arrDdn = arrDdnGot;
      //Trả
      client.close();
      return res.status(201).json({
        thongbao: "Lấy data điểm danh cho tính lương giáo viên thành công",
        arrDdcn: arrDdcn,
        arrDdn: arrDdn,
      });
    } catch (err) {
      client.close();
      return res.status(500).json({
        thongbao: "Lấy data điểm danh cho tính lương giáo viên lỗi",
        arrDdcn: [],
        arrDdn: [],
      });
    }
  }
};

export default handler;
