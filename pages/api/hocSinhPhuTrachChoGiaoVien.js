import ConnectMongoDb from "../../helper/connectMongodb";
import { ObjectId } from "mongodb";

const handler = async (req, res) => {
  const { body, method } = req;
  //Des ra hai thứ cần
  const { idGiaoVien, arrHocSinhChon } = body;
  if (!idGiaoVien || arrHocSinhChon.length === 0) {
    return res.status(422).json({
      thongbao:
        "Lỗi: chưa chọn giáo viên hoặc chưa chọn học trò cho giáo viên.",
    });
  }
  let client;
  let db;
  //Kết nối db trước
  try {
    const { clientGot, dbGot } = await ConnectMongoDb();
    client = clientGot;
    db = dbGot;
  } catch (err) {
    //Chõ này không dùng được returnErrror bên trên vì chưa có client, hải res thủ công lỗi
    return res
      .status(500)
      .json({ thongbao: "Lỗi kết nối đến mongodb rồi.", statusCode: 500 });
  }
  //Tiến hành update lại mảng học trò cá nhân cho giáo viên thoi
  try {
    await db
      .collection("giaoviens")
      .updateOne(
        { _id: ObjectId(idGiaoVien) },
        { $set: { hocTroCaNhan: arrHocSinhChon } }
      );
    client.close();
    return res
      .status(201)
      .json({
        thongbao:
          "Cập nhật thành công. Đợi một chút nó tự chuyển trang, đừng bấm gì có thể gây lỗi nhé.",
      });
  } catch (err) {
    client.close();
    return res
      .status(500)
      .json({ thongbao: "Lỗi cập nhật học trò cho giáo viên." });
  }
};

export default handler;
