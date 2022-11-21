import ConnectMongodb from "../../helper/connectMongodb";
import { ObjectId } from "mongodb";

const handler = async (req, res) => {
  const { method, body } = req;
  //Kết nối db
  let client, db;
  try {
    const { clientGot, dbGot } = await ConnectMongodb();
    client = clientGot;
    db = dbGot;
  } catch (err) {
    res.status(500).json({ thongbao: "Lỗi kết nối đến db." });
  }
  //Thêm lớp nhóm
  if (method === "POST") {
    //Xử lý input lên không hợp lệ thì trả về lỗi
    const { tenLopNhom, giaoVienLopNhom, hocSinhLopNhom } = body;
    //Kiẻm tra data submit lên
    if (
      !tenLopNhom ||
      tenLopNhom === "" ||
      !giaoVienLopNhom ||
      giaoVienLopNhom.length === 0 ||
      !hocSinhLopNhom ||
      hocSinhLopNhom.length === 0
    ) {
      client.close();
      return res
        .status(422)
        .json({ thongbao: "Thiếu thông tin submit để thêm lớp nhóm." });
    }
    //Chạy thêm
    try {
      await db.collection("lopnhoms").insertOne(body);
      client.close();
      return res.status(200).json({ thongbao: "Thêm lớp nhóm thành công." });
    } catch (err) {
      client.close();
      return res.status(500).json({ thongbao: "Thêm lớp nhóm lỗi." });
    }
  } //end if POST

  //Sửa lóp nhóm
  if (method === "PUT") {
    const { lopNhomId, tenLopNhom, giaoVienLopNhom, hocSinhLopNhom } = body;
    //Kiẻm tra data submit lên
    if (
      !tenLopNhom ||
      tenLopNhom === "" ||
      !giaoVienLopNhom ||
      giaoVienLopNhom.length === 0 ||
      !hocSinhLopNhom ||
      hocSinhLopNhom.length === 0
    ) {
      client.close();
      return res
        .status(422)
        .json({ thongbao: "Thiếu thông tin submit để thêm lớp nhóm." });
    }
    //Chạy update thôi
    try {
      await db.collection("lopnhoms").updateOne(
        { _id: ObjectId(lopNhomId) },
        {
          $set: {
            tenLopNhom: tenLopNhom,
            giaoVienLopNhom: giaoVienLopNhom,
            hocSinhLopNhom: hocSinhLopNhom,
          },
        }
      );
      client.close();
      return res.status(201).json({ thongbao: "Sửa lớp nhóm thành công." });
    } catch (err) {
      client.close();
      return res.status(500).json({ thongbao: "Sửa lớp nhóm lỗi." });
    }
  }
};

export default handler;
