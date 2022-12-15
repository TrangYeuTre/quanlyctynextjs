import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import ConnectMongoDb from "../../../helper/connectMongodb";
import { compare } from "bcryptjs";

export const authOptions = {
  // Configure one or more authentication providers
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    encryption: true,
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      async authorize(credentials, req) {
        //Kết nói db trước
        let db, client;
        try {
          const { clientGot, dbGot } = await ConnectMongoDb();
          db = dbGot;
          client = clientGot;
        } catch (err) {
          throw new Error("Kết nối db xác thực ");
        }
        //TÌm username và role trong db
        try {
          const userGot = await db
            .collection("auths")
            .findOne({ username: credentials.username });
          if (!userGot) {
            client.close();
            throw new Error("Tài khoản admin không tồn tại.");
          }
          const isPasswordMatched = await compare(
            credentials.password,
            userGot.password
          );
          if (!isPasswordMatched) {
            client.close();
            throw new Error("Password đăng nhập không dúng.");
          }
          //Pass thì trả về obj là thành công đăng nhập, không trả vè thông tin nhạy cảm
          const user = { name: userGot.username, role: userGot.role };
          return user;
        } catch (err) {
          client.close();
          console.log(err);
          throw new Error("Xử lý xác thực đăng nhập lỗi.");
        }
      },
    }),
    // ...add more providers here
  ],
};
export default NextAuth(authOptions);
