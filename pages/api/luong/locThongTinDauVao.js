import ConnectMongoDb from "../../../helper/connectMongodb";
import { getFirstLastDateOfThisMonth } from "../../../helper/uti";

const handler = async (req, res) => {
  const { method, body } = req;
  //Xử lý input hợp lệ hay không
  const { giaoVienId, ngayChon } = body;
  console.log(giaoVienId, ngayChon);
  if (!giaoVienId || !ngayChon || giaoVienId === "" || ngayChon === "") {
    return res
      .status(422)
      .json({ thongbao: "Thiếu học sinh id hoặc ngày chọn để xử lý " });
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
    //Từ ngày submit lấy các biên cần thiét cho tháng này, tháng trước và tháng sau
    const { firstDateOfThisMonth, lastDateOfThisMonth } =
      getFirstLastDateOfThisMonth(ngayChon);
    try {
      //Tìm xem obj lương tháng này tồn tại chưa
      const objLuongThangNay = await db.collection("luongs").findOne({
        giaoVienId: giaoVienId,
        ngayTinhLuong: {
          $gte: firstDateOfThisMonth,
          $lte: lastDateOfThisMonth,
        },
      });
      //Xử lý kq
      if (!objLuongThangNay) {
        client.close();
        //Trả rỗng để tính mới
        return res
          .status(201)
          .json({ thongbao: "Học phí tháng chưa tồn tại", data: "none" });
      } else {
        //Trả về id của obj lương tìm thấy đẻ chỉnh sửa
        client.close();
        return res
          .status(201)
          .json({
            thongbao: "Học phí tháng đã tồn tại",
            data: objLuongThangNay._id.toString(),
          });
      }
    } catch (err) {
      client.close();
      return res
        .status(500)
        .json({ thongbao: "Lọc thông tin lỗi", data: null });
    }
  }
};

export default handler;
