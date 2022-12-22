import ConnectMongodb from "../../../helper/connectMongodb";
import { ObjectId } from "mongodb";
import { getFirstLastDateOfThisMonth } from "../../../helper/uti";

const handler = async (req, res) => {
  const { method, body } = req;
  const { lopNhomChonId, ngayThongKe } = body;

  const isValidSubmitData = () => {
    return (
      lopNhomChonId && ngayThongKe && lopNhomChonId !== "" && ngayThongKe !== ""
    );
  };
  if (!isValidSubmitData()) {
    return res.status(422).json({
      thongbao:
        "Lóp nhóm chọn id hoặc ngày thống kê không hợp lệ để lấy data điểm danh nhóm.",
    });
  }

  let db, client;
  try {
    const { clientGot, dbGot } = await ConnectMongodb();
    db = dbGot;
    client = clientGot;
  } catch (err) {
    return res.status(500).json({ thongbao: "Lỗi kết nối đến db." });
  }

  if (method === "POST") {
    try {
      const { firstDateOfThisMonth, lastDateOfThisMonth } =
        getFirstLastDateOfThisMonth(ngayThongKe);
      const dataDiemDanhNhomFound = await db
        .collection("diemdanhnhoms")
        .find({
          lopNhomId: lopNhomChonId,
          ngayDiemDanh: {
            $gte: firstDateOfThisMonth,
            $lte: lastDateOfThisMonth,
          },
        })
        .toArray();
      if (!dataDiemDanhNhomFound || dataDiemDanhNhomFound.length === 0) {
        client.close();
        return res
          .status(404)
          .json({ thongbao: "Không tìm thấy data điểm danh nhóm phù hợp." });
      }
      client.close();
      return res.status(201).json({
        thongbao: "Trả data điểm danh nhóm thành công.",
        data: dataDiemDanhNhomFound,
      });
    } catch (err) {
      client.close();
      return res.status(500).json({
        thongbao: "Trả data điểm danh nhóm lỗi.",
      });
    }
  }
};

export default handler;
