import { MongoClient } from "mongodb";


console.log("Connecting to MongoDB", process.env.MONGODB_URI);
const client = new MongoClient(process.env.MONGODB_URI!);


client.connect();
let _db: any;

const mongoConnect = (callback: () => void) => {
  client
    .connect()
    .then((client) => {
      console.log("Connected to MongoDB");
      _db = client.db("fpl");
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "Database not found";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
