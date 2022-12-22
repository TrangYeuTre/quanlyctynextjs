import ConnectMongoDb from "../../../helper/connectMongodb";
import { getFirstLastDateOfThisMonth } from "../../../helper/uti";

const handler = async (req, res) => {
  const { method, body } = req;
  const { ngayThongKe, giaoVienId } = body;
  const isValidDataSubmit = () => {
    return ngayThongKe && giaoVienId && ngayThongKe !== "" && giaoVienId !== "";
  };
  if (!isValidDataSubmit()) {
    return res.status(422).json({
      thongbao:
        "Ngày thống kê hoặc giáo viên id không hợp lệ để lấy data ngày điểm danh cá nhân.",
    });
  }

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
      const { firstDateOfThisMonth, lastDateOfThisMonth } =
        getFirstLastDateOfThisMonth(ngayThongKe);
      const dataDdcnFound = await db
        .collection("diemdanhcanhans")
        .find({
          giaoVienId: giaoVienId,
          ngayDiemDanh: {
            $gte: firstDateOfThisMonth,
            $lte: lastDateOfThisMonth,
          },
        })
        .toArray();

      if (!dataDdcnFound || dataDdcnFound.length === 0) {
        client.close();
        return res
          .status(404)
          .json({ thongbao: "Không tìm thấy data điểm danh cá nhân phù hợp." });
      }

      client.close();
      return res.status(201).json({
        thongbao: "Trả data điểm danh cá nhân ok.",
        data: dataDdcnFound,
      });
    } catch (err) {
      client.close();
      return res
        .status(500)
        .json({ thongbao: "Trả data điểm danh cá nhân lỗi." });
    }
  }
};

export default handler;
