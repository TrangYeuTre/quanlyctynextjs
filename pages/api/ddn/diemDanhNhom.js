import ConnectMongodb from "../../../helper/connectMongodb";
import { ObjectId } from "mongodb";

const handler = async (req, res) => {
  const { method, body } = req;
  //XỬ LÝ KẾT NỐI ĐẾN DB
  let db, client;
  try {
    const { clientGot, dbGot } = await ConnectMongodb();
    db = dbGot;
    client = clientGot;
  } catch (err) {
    res.status(500).json({ thongbao: "Lỗi kết nối đến db." });
  }
  //Thêm mới điêm danh nhóm
  if (method === "POST") {
    const { ngayDiemDanh, tenLopNhom, lopNhomId } = body;
    console.log(ngayDiemDanh, tenLopNhom, lopNhomId);
    //Check data submit
    if (
      !ngayDiemDanh ||
      ngayDiemDanh === "" ||
      Object.keys(body).length < 4 ||
      !tenLopNhom ||
      tenLopNhom === "" ||
      !lopNhomId ||
      lopNhomId === ""
    ) {
      client.close();
      return res.status(422).json({
        thongbao: "Data submit điềm danh nhóm không hợp lệ.",
      });
    }
    try {
      //Đầu tiên là tìm xem có đối tượng dd đã tồn tại chưa, nếu có thì xóa nó đi rồi mới thêm mới
      const isDdnExist = await db
        .collection("diemdanhnhoms")
        .findOne({ ngayDiemDanh: ngayDiemDanh, lopNhomId: lopNhomId });
      if (isDdnExist) {
        await db
          .collection("diemdanhnhoms")
          .deleteOne({ ngayDiemDanh: ngayDiemDanh, lopNhomId: lopNhomId });
      }
      //Thêm mới thôi
      await db.collection("diemdanhnhoms").insertOne(body);
      client.close();
      res.status(200).json({ thongbao: "Điểm danh nhóm thành công." });
    } catch (err) {
      client.close();
      return res.status(500).json({
        thongbao: "Điểm danh nhóm lỗi",
      });
    }
  } // end if post
  //Xóa ngày điểm danh nhóm
  if (method === "DELETE") {
    const lopNhomId = body;
    if (!lopNhomId) {
      client.close();
      return res.status(422).json({
        thongbao: "Thiếu id ngày điểm danh nhóm để xóa.",
      });
    }
    //Tiến hành xóa
    try {
      await db
        .collection("diemdanhnhoms")
        .findOneAndDelete({ _id: ObjectId(lopNhomId) });
      client.close();
      return res.status(201).json({
        thongbao: "Xóa ngày điểm danh nhóm thành công.",
      });
    } catch (err) {
      client.close();
      return res.status(500).json({
        thongbao: "Xóa ngày điểm danh nhóm lỗi.",
      });
    }
  }
};

export default handler;
