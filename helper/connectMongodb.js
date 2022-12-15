import { MongoClient } from "mongodb";

const ConnectMongoDb = async () => {
  const client = await MongoClient.connect(
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}.jtxwz.mongodb.net/?retryWrites=true&w=majority`
  );
  const db = client.db("Dev_Nextjs_Cty");
  return { clientGot: client, dbGot: db };
};

export default ConnectMongoDb;
