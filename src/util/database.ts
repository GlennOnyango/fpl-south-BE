import { MongoClient } from "mongodb";

const client = new MongoClient(
  "mongodb+srv://glenntedd:7CenycxUocHa6eEJ@cluster0.hvxfqut.mongodb.net/?retryWrites=true&w=majority"
);

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
