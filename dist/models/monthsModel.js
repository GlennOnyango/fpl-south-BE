"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const getDb = require("../util/database").getDb;
class MonthsModel {
    constructor(months, userId, _id) {
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
        }
        else {
            oDB = db.collection("months").insertOne(this);
        }
        return oDB
            .then((result) => {
            return result;
        })
            .catch((err) => {
            return err;
        });
    }
    static fetchAll() {
        const db = getDb();
        return db
            .collection("months")
            .find()
            .toArray()
            .then((months) => {
            return months;
        })
            .catch((err) => {
            return err;
        });
    }
    static fetchByUserId(userId) {
        const db = getDb();
        return db
            .collection("months")
            .findOne({ userId: new mongoose_1.default.Types.ObjectId(userId) })
            .then((months) => {
            return months;
        })
            .catch((err) => {
            return err;
        });
    }
    static fetchByUserIds(userIds) {
        const db = getDb();
        return db
            .collection("months")
            .find({ userId: { $in: userIds } })
            .toArray()
            .then((months) => {
            return months;
        })
            .catch((err) => {
            return err;
        });
    }
}
exports.default = MonthsModel;
