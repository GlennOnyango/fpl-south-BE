"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = __importDefault(require("mongodb"));
const getDb = require("../util/database").getDb;
class Payment {
    constructor(phone, weeks, months, amount, mpesaToken, approved, userId, _id, adminId) {
        this.phone = phone;
        this.weeks = weeks;
        this.months = months;
        this.amount = amount;
        this.mpesaToken = mpesaToken;
        this.approved = approved;
        this.userId = userId;
        this.adminId = adminId ? new mongodb_1.default.ObjectId(adminId) : null;
        this._id = _id ? new mongodb_1.default.ObjectId(_id) : null;
    }
    save() {
        const db = getDb();
        let oDB;
        if (this._id) {
            oDB = db
                .collection("payments")
                .updateOne({ _id: this._id }, { $set: this });
        }
        else {
            oDB = db.collection("payments").insertOne(this);
        }
        return oDB
            .then((result) => {
            console.log(result);
        })
            .catch((err) => {
            console.log(err);
        });
    }
    static fetchAll() {
        const db = getDb();
        return db
            .collection("payments")
            .find()
            .toArray()
            .then((result) => {
            return result;
        })
            .catch((err) => console.log(err));
    }
    static findByUserId(userId) {
        const db = getDb();
        return db
            .collection("payments")
            .find({ userId: new mongodb_1.default.ObjectId(userId) })
            .toArray()
            .then((result) => {
            return result;
        })
            .catch((err) => console.log(err));
    }
    //find by mpesa token
    static findByMpesaToken(mpesaToken) {
        const db = getDb();
        return db
            .collection("payments")
            .find({ mpesaToken: mpesaToken })
            .next()
            .then((result) => {
            return result;
        })
            .catch((err) => console.log(err));
    }
    static findById(_id) {
        const db = getDb();
        return db
            .collection("payments")
            .find({ _id: new mongodb_1.default.ObjectId(_id) })
            .next()
            .then((result) => {
            return result;
        })
            .catch((err) => console.log(err));
    }
    static deleteById(_id) {
        const db = getDb();
        return db
            .collection("payments")
            .deleteOne({ _id: new mongodb_1.default.ObjectId(_id) })
            .then((result) => {
            console.log("Deleted");
            return result;
        })
            .catch((err) => console.log(err));
    }
}
exports.default = Payment;
