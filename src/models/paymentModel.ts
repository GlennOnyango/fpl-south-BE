import mongodb from "mongodb";
import mongoose from "mongoose";
const getDb = require("../util/database").getDb;

interface Payment {
  phone: string;
  weeks: number[];
  months: number[];
  amount: number;
  mpesaToken: string;
  approved: boolean;
  userId: string;
  _id?: mongodb.ObjectId | null;
  adminId?: string | null;
}

class Payment {
  constructor(
    phone: string,
    weeks: number[],
    months: number[],
    amount: number,
    mpesaToken: string,
    approved: boolean,
    userId: string,
    _id?: mongodb.ObjectId | null,
    adminId?: string | null
  ) {
    this.phone = phone;
    this.weeks = weeks;
    this.months = months;
    this.amount = amount;
    this.mpesaToken = mpesaToken;
    this.approved = approved;
    this.userId = userId;
    this.adminId = adminId ? adminId : null;
    this._id = _id ? _id : null;
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
        return result;
      })
      .catch((err: any) => {
        return err;
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
      .find({ userId: userId })
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
      .find({ _id: new mongoose.Types.ObjectId(_id) })
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
