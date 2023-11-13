"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = __importDefault(require("mongodb"));
const getDb = require("../util/database").getDb;
class MonthsModel {
    constructor(months, userId, _id) {
        this.months = months;
        this.userId = userId;
        this._id = _id ? new mongodb_1.default.ObjectId(_id) : null;
    }
    save() {
        const db = getDb();
        let oDB;
        if (this._id) {
            oDB = db.collection("months").updateOne({ _id: this._id }, { $set: this });
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
}
exports.default = MonthsModel;
