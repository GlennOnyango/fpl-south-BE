"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const client = new mongodb_1.MongoClient(process.env.MONGODB_URI);
client.connect();
let _db;
const mongoConnect = (callback) => {
    client.connect()
        .then(client => {
        console.log("Connected to MongoDB");
        _db = client.db("fpl");
        callback();
    })
        .catch(err => {
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
