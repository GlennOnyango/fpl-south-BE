"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = __importDefault(require("mongodb"));
const getDb = require("../util/database").getDb;
class User {
    constructor(username, teamid, phonenumber, email, password, approved, admin, approved_by, id) {
        this.username = username;
        this.teamid = teamid;
        this.phonenumber = phonenumber;
        this.email = email;
        this.password = password;
        this.approved = approved;
        this.admin = admin;
        this.approved_by = approved_by ? new mongodb_1.default.ObjectId(approved_by) : null;
        this._id = id ? new mongodb_1.default.ObjectId(id) : null;
    }
    save() {
        const db = getDb();
        let oDB;
        if (this._id) {
            oDB = db.collection("users").updateOne({ _id: this._id }, { $set: this });
        }
        else {
            oDB = db.collection("users").insertOne(this);
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
            .collection("users")
            .find()
            .toArray()
            .then((result) => {
            return result;
        })
            .catch((err) => console.log(err));
    }
    static findById(_id) {
        const db = getDb();
        return db
            .collection("users")
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
            .collection("users")
            .deleteOne({ _id: new mongodb_1.default.ObjectId(_id) })
            .then((result) => {
            console.log("Deleted");
            return result;
        })
            .catch((err) => console.log(err));
    }
    static findByEmail(email) {
        const db = getDb();
        return db
            .collection("users")
            .find({ email: email })
            .next()
            .then((result) => {
            return result;
        })
            .catch((err) => console.log(err));
    }
    static findByTeamId(teamid) {
        const db = getDb();
        return db
            .collection("users")
            .find({ teamid: teamid })
            .next()
            .then((result) => {
            return result;
        })
            .catch((err) => {
            return err;
        });
    }
}
exports.default = User;
