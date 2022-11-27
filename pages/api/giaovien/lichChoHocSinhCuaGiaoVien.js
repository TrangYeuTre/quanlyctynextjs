import ConnectMongoDb from "../../../helper/connectMongodb";
import { ObjectId } from "mongodb";

const handler = async (req, res) => {
  const { method, body } = req;
  //Kết nối đến db đầu tiên
  let client;
  let db;
  //Kết nối db trước
  try {
    const { clientGot, dbGot } = await ConnectMongoDb();
    client = clientGot;
    db = dbGot;
  } catch (err) {
    return res
      .status(500)
      .json({ thongbao: "Lỗi kết nối đến mongodb rồi.", statusCode: 500 });
  }
  //Xử lý post req, thêm mới lịch cho học sinh
  if (method === "POST") {
    //Des từu body ra và kiểm tra
    const { arrThu, arrHocSinh, giaoVienId } = body;
    if (arrThu.length === 0 || arrHocSinh.length === 0) {
      client.close();
      return res
        .status(422)
        .json({ thongbao: "Lỗi chưa chọn thứ hoặc chưa chọn học sinh." });
    }
    //Tổng hợp lại data cần thêm vào lịch
    let dataUpdate = { arrThu: arrThu, arrHocSinh: arrHocSinh };
    //Tìm giáo viên theo id và thêm vào lich
    try {
      //Tìm giáo viên
      const giaoVienMatched = await db
        .collection("giaoviens")
        .findOne({ _id: ObjectId(giaoVienId) });
      //Lấy mảng lịch của giáo viên đó trước
      let lichDayCaNhan = giaoVienMatched.lichDayCaNhan;
      //Đẩy id thủ công cho ọbj lịch
      if (lichDayCaNhan.length === 0) {
        dataUpdate.lichId = "lich-1";
      } else {
        const lastLichId = lichDayCaNhan[lichDayCaNhan.length - 1].lichId;
        const lastNum = lastLichId.split("-")[1];
        dataUpdate.lichId = `lich-${+lastNum + 1}`;
      } //end if đánh id tự động
      //Đẩy data mới vào lịch
      lichDayCaNhan.push(dataUpdate);
      //Cuối cùng mới update lại
      await db
        .collection("giaoviens")
        .updateOne(
          { _id: ObjectId(giaoVienId) },
          { $set: { lichDayCaNhan: lichDayCaNhan } }
        );
      client.close();
      return res
        .status(200)
        .json({ thongbao: "Thêm mới lịch dạy cho giáo viên thành công." });
    } catch (err) {
      console.log(err);
      client.close();
      return res
        .status(500)
        .json({ thongbao: "Thêm mới lịch dạy cho giáo viên lỗi." });
    }
  } //end pos req thêm mới lịch

  //Xử lý delete lihc
  if (method === "DELETE") {
    //Lấy id lịch cần xóa
    const { lichId, giaoVienId } = body;
    // console.log(body)
    //Xử lý trả lại nếu thiếu data
    if (!lichId || !giaoVienId) {
      client.close();
      return res
        .status(422)
        .json({ thongbao: "Thiếu id của giáo viên hoặc của lịch cần xóa." });
    }
    //Tìm giáo viên đẻ lấy lich về cần update
    try {
      //Tìm giào viên nè
      const giaovien = await db
        .collection("giaoviens")
        .findOne({ _id: ObjectId(giaoVienId) });
      //Lấy lại mảng lịch dạy cá nhân
      const curLichDayCaNhan = [...giaovien.lichDayCaNhan];
      //Tìm và xóa
      const lichDayCaNhanUpdate = curLichDayCaNhan.filter(
        (i) => i.lichId.toString() !== lichId.toString()
      );
      //Cập nhật lại thôi
      await db
        .collection("giaoviens")
        .updateOne(
          { _id: ObjectId(giaoVienId) },
          { $set: { lichDayCaNhan: lichDayCaNhanUpdate } }
        );
      client.close();
      return res
        .status(201)
        .json({ thongbao: "Xóa đối tượng lịch của giáo viên thành công." });
    } catch (err) {
      client.close();
      return res
        .status(500)
        .json({ thongbao: "Lỗi không xóa được lịch của giáo viên." });
    }
  }
};

export default handler;
