import ConnectMongoDb from "../../../helper/connectMongodb";
import { ObjectId } from "mongodb";
import {
  getFirstLastDateOfNextMonth,
  getFirstLastDateOfPrevMonth,
  getFirstLastDateOfThisMonth,
} from "../../../helper/uti";

const handler = async (req, res) => {
  // return res.status(201).json({ thongbao: "Get data test thành cong" });
  //Ghi chú quan trọng : submit lên sẽ là id học sinh và ngay chọn --> dựa vào 2 thông tin này ta sẽ lọc lại 2 thong tin quan tọng
  // -- thứ 1 : collection "hocphis": từ ngày submit tìm xem đã tồn tại data học phí tính cho tháng sau chưa -> nếu có thì cho 1 option sửa / nếu chưa có thì cho option tính phí cho thagns đó
  // -- thứ 2 : collection 'ddcn" : từ ngày submit lên load lại data ddcn tháng trước đó của học sinh để xử lý tính tăng cường, nghỉ có và không bù - no, thằng này để api sửa hẵng xài

  const { method, body } = req;
  //Xử lý input hợp lệ hay không
  const { hocSinhId, ngayChon } = body;
  console.log(hocSinhId, ngayChon);
  if (!hocSinhId || !ngayChon) {
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
    const { firstDateOfNextMonth, lastDateOfNextMonth } =
      getFirstLastDateOfNextMonth(ngayChon);
    // const { firstDateOfPrevMonth, lastDateOfPrevMonth } =
    //   getFirstLastDateOfPrevMonth(ngayChon);
    const { firstDateOfThisMonth, lastDateOfThisMonth } =
      getFirstLastDateOfThisMonth(ngayChon);
    try {
      let result = { dataPhiThangSauId: "none", dataPhiDaTonTai: "none" };
      //Lấy ngày submit làm gốc
      //TÌm xem đã tồn tại obj Data hocphis trong biên của tháng sau chua, nếu có thì trả về : [chế độ sửa, id của obj đã tồng tại để sửa]
      //Nếu chưa tìm thấy thì trả về chế đố tính cho tháng đó
      const objTinhPhiThangSau = await db.collection("hocphis").findOne({
        hocSinhId: hocSinhId,
        ngayTinhPhi: {
          $gte: firstDateOfNextMonth,
          $lte: lastDateOfNextMonth,
        },
      });
      if (objTinhPhiThangSau) {
        result.dataPhiThangSauId = objTinhPhiThangSau._id.toString();
      }
      //Tìm xem với ngày submit này đã tồn tại objTinhs phí chưa, nếu có tức là trường hợp tìm thấy tính phí đã tính và chọn nó để sủa
      const objTinhPhiDaTonTai = await db.collection("hocphis").findOne({
        hocSinhId: hocSinhId,
        ngayTinhPhi: {
          $gte: firstDateOfThisMonth,
          $lte: lastDateOfThisMonth,
        },
      });
      if (objTinhPhiDaTonTai) {
        result.dataPhiDaTonTai = objTinhPhiDaTonTai._id.toString();
      }
      //Trả kq
      client.close();
      return res
        .status(201)
        .json({ thongbao: "Lọc thông tin thành công", data: result });
    } catch (err) {
      client.close();
      return res
        .status(500)
        .json({ thongbao: "Lọc thông tin lỗi", data: null });
    }
  }
};

export default handler;
