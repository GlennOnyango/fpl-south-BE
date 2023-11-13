import mongodb from "mongodb";
const getDb = require("../util/database").getDb;

interface Payment {
  phone: string;
  weeks: number[];
  months: number[];
  amount: number;
  mpesaToken: string;
  approved: boolean;
  userId: mongodb.ObjectId | null;
  _id?: mongodb.ObjectId | null;
  adminId?: mongodb.ObjectId | null;
}

class Payment {
  constructor(
    phone: string,
    weeks: number[],
    months: number[],
    amount: number,
    mpesaToken: string,
    approved: boolean,
    userId: mongodb.ObjectId | null,
    _id?: mongodb.ObjectId | null,
    adminId?: mongodb.ObjectId | null,
  ) {
    this.phone = phone;
    this.weeks = weeks;
    this.months = months;
    this.amount = amount;
    this.mpesaToken = mpesaToken;
    this.approved = approved;
    this.userId = userId;
    this.adminId = adminId ? new mongodb.ObjectId(adminId) : null;
    this._id = _id ? new mongodb.ObjectId(_id) : null;
  }

  save() {
    const db = getDb();
    let oDB;
    if (this._id) {
      oDB = db
        .collection("payments")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      oDB = db.collection("payments").insertOne(this);
    }

    return oDB
      .then((result: any) => {
        console.log(result);
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

  static fetchAll() {
    const db = getDb();

    return db
      .collection("payments")
      .find()
      .toArray()
      .then((result: Payment[]) => {
        return result;
      })
      .catch((err: Error) => console.log(err));
  }

  static findByUserId(userId: string) {
    const db = getDb();

    return db
      .collection("payments")
      .find({ userId: new mongodb.ObjectId(userId) })
      .toArray()
      .then((result: Payment[]) => {
        return result;
      })
      .catch((err: Error) => console.log(err));
  }

  //find by mpesa token
  static findByMpesaToken(mpesaToken: string) {
    const db = getDb();

    return db
      .collection("payments")
      .find({ mpesaToken: mpesaToken })
      .next()
      .then((result: Payment[]) => {
        return result;
      })
      .catch((err: Error) => console.log(err));
  }

  static findById(_id: string) {
    const db = getDb();

    return db
      .collection("payments")
      .find({ _id: new mongodb.ObjectId(_id) })
      .next()
      .then((result: Payment) => {
        return result;
      })
      .catch((err: Error) => console.log(err));
  }

  static deleteById(_id: string) {
    const db = getDb();

    return db
      .collection("payments")
      .deleteOne({ _id: new mongodb.ObjectId(_id) })
      .then((result: Payment) => {
        console.log("Deleted");
        return result;
      })
      .catch((err: Error) => console.log(err));
  }

}

export default Payment;
