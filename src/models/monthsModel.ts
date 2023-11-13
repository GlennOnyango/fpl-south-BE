import mongodb from "mongodb";
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
    this._id = _id ? new mongodb.ObjectId(_id) : null;
  }

  save() {
    const db = getDb();
    let oDB;
    if (this._id) {
      oDB = db.collection("months").updateOne({ _id: this._id }, { $set: this });
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
}

export default MonthsModel;
