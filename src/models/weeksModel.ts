import mongodb from "mongodb";
import mongoose from "mongoose";
const getDb = require("../util/database").getDb;

type weeksObject = {
  week: number;
  approved: boolean;
};

interface WeeksModel {
  weeks: weeksObject[];
  userId: mongodb.ObjectId | null;
  _id?: mongodb.ObjectId | null;
}

class WeeksModel {
  constructor(
    weeks: weeksObject[],
    userId: mongodb.ObjectId | null,
    _id?: mongodb.ObjectId | null
  ) {
    console.log("id", _id);
    this.weeks = weeks;
    this.userId = userId;
    this._id = _id ? _id : null;
  }

  save() {
    const db = getDb();
    let oDB;
    if (this._id) {
      oDB = db.collection("weeks").updateOne({ _id: this._id }, { $set: this });
    } else {
      oDB = db.collection("weeks").insertOne(this);
    }

    return oDB
      .then((result: any) => {
        return result;
      })
      .catch((err: any) => {
        return err;
      });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("weeks")
      .find()
      .toArray()
      .then((weeks: any) => {
        return weeks;
      })
      .catch((err: any) => {
        return err;
      });
  }

  static fetchByUserId(userId: string) {
    const db = getDb();
    console.log("userId", userId);
    return db
      .collection("weeks")
      .find({ userId: new mongoose.Types.ObjectId(userId) })
      .next()
      .then((weeks: any) => {
        return weeks;
      })
      .catch((err: any) => {
        return err;
      });
  }
}

export default WeeksModel;
