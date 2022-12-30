import ConnectMongoDb from "../../../helper/connectMongodb";
import { ObjectId } from "mongodb";

const handler = async (req, res) => {
  const { method, body } = req;
  //Des sở bộ cho tính năng thêm mới học sinh
  const {
    lopHoc,
    hocPhiCaNhan,
    hocPhiNhom,
    tenHocSinh,
    shortName,
    ngaySinh,
    soPhutHocMotTiet,
  } = body;
  //Xử lý trả lỗi ngay nếu thiếu các thông tin quan trọng nhé, bỏ phần lớp để bên dưới xử lý sau
  if (method !== "DELETE") {
    if (
      !tenHocSinh ||
      tenHocSinh === "" ||
      !shortName ||
      shortName === "" ||
      !ngaySinh ||
      +soPhutHocMotTiet === 0
    ) {
      return res
        .status(422)
        .json({ thongbao: "Lỗi: phải cung cấp đủ các ô có dấu * nhé" });
    }
  }
  //Xử lý biến cá nhân và nhóm
  let canhan = null;
  let nhom = null;
  let tangcuong = null;
  if (method !== "DELETE") {
    const caNhanMatched = lopHoc.findIndex((i) => i === "canhan");
    if (caNhanMatched !== -1) {
      canhan = true;
    }
    const nhomMatched = lopHoc.findIndex((i) => i === "nhom");
    if (nhomMatched !== -1) {
      nhom = true;
    }
    const tangcuongMatched = lopHoc.findIndex((i) => i === "tangcuong");
    if (tangcuongMatched !== -1) {
      tangcuong = true;
    }
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
    return res
      .status(500)
      .json({ thongbao: "Lỗi kết nối đến mongodb rồi.", statusCode: 500 });
  }

  //Xử lý thêm hs mới
  if (method === "POST") {
    //Kiểm tra nếu chưa chọn cá nhân và nhóm
    if (!canhan && !nhom && !tangcuong) {
      client.close();
      return res
        .status(422)
        .json({ thongbao: "Phải chọn lớp: cá nhân hoặc nhóm" });
    }
    //Kiểm tra điều kiện: có cá nhân/nhóm mà không có phí cá nhân / nhóm
    if (canhan && +hocPhiCaNhan === 0) {
      client.close();
      return res
        .status(422)
        .json({ thongbao: "Chọn cá nhân thì học phí cá nhân phải lớn hơn 0," });
    }
    //Kiểm tra điều kiện: có cá nhân/nhóm mà không có phí cá nhân / nhóm
    if (nhom && +hocPhiNhom === 0) {
      client.close();
      return res
        .status(422)
        .json({ thongbao: "Chọn nhóm thì học phí nhóm phải lớn hơn 0," });
    } //Tiến hành thêm thôi nào
    try {
      await db.collection("hocsinhs").insertOne(req.body);
      client.close();
      return res
        .status(200)
        .json({ thongbao: "Thêm mới học sinh thành công." });
    } catch (err) {
      client.close();
      return res.status(500).json({ thongbao: "Thêm học sinh lỗi." });
    }
  } //end if Post thêm hs mới
  //Xử lý sửa thông tin học sinh
  if (method === "PUT") {
    //Kiểm tra nếu chưa chọn cá nhân và nhóm
    if (!canhan && !nhom) {
      client.close();
      return res
        .status(422)
        .json({ thongbao: "Phải chọn lớp: cá nhân hoặc nhóm" });
    }
    //Kiểm tra điều kiện: có cá nhân/nhóm mà không có phí cá nhân / nhóm
    if (canhan && +hocPhiCaNhan === 0) {
      client.close();
      return res
        .status(422)
        .json({ thongbao: "Chọn cá nhân thì học phí cá nhân phải lớn hơn 0," });
    }
    //Kiểm tra điều kiện: có cá nhân/nhóm mà không có phí cá nhân / nhóm
    if (nhom && +hocPhiNhom === 0) {
      client.close();
      return res
        .status(422)
        .json({ thongbao: "Chọn nhóm thì học phí nhóm phải lớn hơn 0," });
    }
    //Tiến hành sửa nào
    try {
      //Tách từ body phần data cần sửa và id
      const idHocSinhSua = req.body.hocSinhId;
      let dataEdit = new Object();
      for (let prop in req.body) {
        if (prop !== "hocSinhId") {
          dataEdit[prop] = req.body[prop];
        }
      }

      //Tiến hành sửa
      await db
        .collection("hocsinhs")
        .replaceOne({ _id: ObjectId(idHocSinhSua) }, dataEdit);
      client.close();
      return res
        .status(201)
        .json({ thongbao: "Sửa thông tin học sinh thành công." });
    } catch (err) {
      client.close();
      return res.status(500).json({ thongbao: "Sửa thông tin học sinh lỗi" });
    }
  }
  //Xử lý xóa học sinh
  if (method === "DELETE") {
    //Lấy id
    const hocSinhXoaId = req.body;
    //Xóa thôi
    try {
      //Xóa trực tiếp học sinh
      await db
        .collection("hocsinhs")
        .deleteOne({ _id: ObjectId(hocSinhXoaId) });
      client.close();
      return res.status(200).json({ thongbao: "Xóa học sinh thành công" });
    } catch (err) {
      client.close();
      return res.status(500).json({ thongbao: "Xóa học sinh lỗi." });
    }
  } //end xóa học sinh
};

export default handler;
