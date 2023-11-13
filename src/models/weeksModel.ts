import mongodb from "mongodb";
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
    _id?: mongodb.ObjectId | null,
  ) {
    this.weeks = weeks;
    this.userId = userId;
    this._id = _id ? new mongodb.ObjectId(_id) : null;
  }

  save() {
    const db = getDb();
    let oDB;
    if (this._id) {
      oDB = db
        .collection("weeks")
        .updateOne({ _id: this._id }, { $set: this });
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

}

export default WeeksModel;
