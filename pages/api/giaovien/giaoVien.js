import ConnectMongodb from "../../../helper/connectMongodb";
import { ObjectId } from "mongodb";

const handler = async (req, res) => {
  const { body, method } = req;
  //Kiêm tra các giá trị bát buộc
  const {
    giaoVienSuaId,
    tenGiaoVien,
    shortName,
    gioiTinh,
    ngaySinh,
    luongCaNhan,
    luongNhom,
    soDienThoai,
    diaChi,
    thongTinCoBan,
  } = body;

  //Xử lý xét input chung
  if (method === "POST" || method === "PUT") {
    //Ưu tiên lương cá nhân bằng không là lỗi
    if (+luongCaNhan === 0) {
      return res
        .status(422)
        .json({ thongbao: "Lỗi: lương cá nhân phải lớn hơn 0 cô Trang ê." });
    }
    if (
      !gioiTinh ||
      !tenGiaoVien ||
      tenGiaoVien === "" ||
      !shortName ||
      shortName === "" ||
      !ngaySinh ||
      !luongNhom
    ) {
      return res
        .status(422)
        .json({ thongbao: "Lỗi: phải cung cấp đủ các ô có dấu * cô Trang ê." });
    }
  }

  //XỬ LÝ KẾT NỐI ĐẾN DB
  let db, client;
  try {
    const { clientGot, dbGot } = await ConnectMongodb();
    db = dbGot;
    client = clientGot;
  } catch (err) {
    res.status(500).json({ thongbao: "Lỗi kết nối đến db." });
  }
  //XỬ LÝ THÊM MỚI GIÁO VIÊN
  if (method === "POST") {
    try {
      await db.collection("giaoviens").insertOne(body);
      client.close();
      res.status(200).json({ thongbao: "Thêm giáo viên mới thành công" });
    } catch (err) {
      client.close();
      res.status(500).json({ thongbao: "Lỗi thêm giáo viên mới." });
    }
  }
  //XỬ LÝ SỬA THÔNG TIN GIÁO VIÊN
  if (method === "PUT") {
    //Lấy ra các props cần update lại thông tin giáo viên
    try {
      await db.collection("giaoviens").updateOne(
        { _id: ObjectId(giaoVienSuaId) },
        {
          $set: {
            tenGiaoVien: tenGiaoVien,
            shortName: shortName,
            gioiTinh: gioiTinh,
            ngaySinh: ngaySinh,
            luongCaNhan: luongCaNhan,
            luongNhom: luongNhom,
            soDienThoai: soDienThoai,
            diaChi: diaChi,
            thongTinCoBan: thongTinCoBan,
          },
        }
      );
      client.close();
      res.status(201).json({ thongbao: "Sửa thông tin giáo viên thành công." });
    } catch (err) {
      console.log(err);
      client.close();
      res.status(500).json({ thongbao: "Lỗi sửa thông tin giáo viên." });
    }
  } //end if put sửa gv
  // XỬ LÝ XÓA GIÁO VIÊN
  if (method === "DELETE") {
    try {
      //Giáo viên id
      const giaoVienXoaId = body;
      //xóa thôi
      await db
        .collection("giaoviens")
        .deleteOne({ _id: ObjectId(giaoVienXoaId) });
      client.close();
      return res.status(201).json({ thongbao: "Xóa giáo viên thành công." });
    } catch (err) {
      client.close();
      res.status(500).json({ thongbao: "Lỗi xóa giáo viên." });
    }
  } //end if xóa giáo viên
};

export default handler;
