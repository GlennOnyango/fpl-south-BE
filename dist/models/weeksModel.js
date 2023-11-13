"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = __importDefault(require("mongodb"));
const getDb = require("../util/database").getDb;
class WeeksModel {
    constructor(weeks, userId, _id) {
        this.weeks = weeks;
        this.userId = userId;
        this._id = _id ? new mongodb_1.default.ObjectId(_id) : null;
    }
    save() {
        const db = getDb();
        let oDB;
        if (this._id) {
            oDB = db
                .collection("weeks")
                .updateOne({ _id: this._id }, { $set: this });
        }
        else {
            oDB = db.collection("weeks").insertOne(this);
        }
        return oDB
            .then((result) => {
            console.log(result);
        })
            .catch((err) => {
            console.log(err);
        });
    }
}
exports.default = WeeksModel;
