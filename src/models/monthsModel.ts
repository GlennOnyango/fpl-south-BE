import mongodb from "mongodb";
import mongoose from "mongoose";
const getDb = require("../util/database").getDb;

type monthsObject = {
  month: number;
  approved: boolean;
};

interface MonthsModel {
  months: monthsObject[];
  userId: mongodb.ObjectId | null;
  _id?: mongodb.ObjectId | null;
}

class MonthsModel {
  constructor(
    months: monthsObject[],
    userId: mongodb.ObjectId | null,
    _id?: mongodb.ObjectId | null
  ) {
    this.months = months;
    this.userId = userId;
    this._id = _id ? _id : null;
  }

  save() {
    const db = getDb();
    let oDB;
    if (this._id) {
      oDB = db
        .collection("months")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      oDB = db.collection("months").insertOne(this);
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
      .collection("months")
      .find()
      .toArray()
      .then((months: any) => {
        return months;
      })
      .catch((err: any) => {
        return err;
      });
  }

  static fetchByUserId(userId: string) {
    const db = getDb();
    return db
      .collection("months")
      .findOne({ userId: new mongoose.Types.ObjectId(userId) })
      .then((months: any) => {
        return months;
      })
      .catch((err: any) => {
        return err;
      });
  }

  static fetchByUserIds(userIds: mongodb.ObjectId[]) {
    const db = getDb();
    return db
      .collection("months")
      .find({ userId: { $in: userIds } })
      .toArray()
      .then((months: any) => {
        return months;
      })
      .catch((err: any) => {
        return err;
      });
  }

}

export default MonthsModel;
