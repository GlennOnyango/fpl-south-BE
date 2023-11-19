"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const getDb = require("../util/database").getDb;
class WeeksModel {
    constructor(weeks, userId, _id) {
        this.weeks = weeks;
        this.userId = userId;
        this._id = _id ? _id : null;
    }
    save() {
        const db = getDb();
        let oDB;
        if (this._id) {
            oDB = db.collection("weeks").updateOne({ _id: this._id }, { $set: this });
        }
        else {
            oDB = db.collection("weeks").insertOne(this);
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
            .collection("weeks")
            .find()
            .toArray()
            .then((weeks) => {
            return weeks;
        })
            .catch((err) => {
            return err;
        });
    }
    static fetchByUserId(userId) {
        const db = getDb();
        return db
            .collection("weeks")
            .find({ userId: new mongoose_1.default.Types.ObjectId(userId) })
            .next()
            .then((weeks) => {
            return weeks;
        })
            .catch((err) => {
            return err;
        });
    }
    static fetchByuserIds(userIds) {
        const db = getDb();
        return db
            .collection("weeks")
            .find({ userId: { $in: userIds } })
            .toArray()
            .then((weeks) => {
            return weeks;
        })
            .catch((err) => {
            return err;
        });
    }
}
exports.default = WeeksModel;
