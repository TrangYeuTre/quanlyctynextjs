import { MongoClient } from "mongodb";

const ConnectMongoDb = async () => {
  const client = await MongoClient.connect(
    "mongodb+srv://nghiadeptrai91:NghiaTrang9192@hoc-nodejs-cluster.jtxwz.mongodb.net/?retryWrites=true&w=majority"
  );
  const db = client.db("Dev_Nextjs_Cty");
  return { clientGot: client, dbGot: db };
};

export default ConnectMongoDb;
