import mongodb from "mongodb";
const getDb = require("../util/database").getDb;

interface User {
  username: string;
  teamid: number;
  phonenumber: number;
  email: string;
  password: string;
  approved: boolean;
  admin: boolean;
  approved_by?: mongodb.ObjectId | null;
  _id?: mongodb.ObjectId | null;
}

class User {
  constructor(
    username: string,
    teamid: number,
    phonenumber: number,
    email: string,
    password: string,
    approved: boolean,
    admin: boolean,
    approved_by?: mongodb.ObjectId | null,
    id?: string
  ) {
    this.username = username;
    this.teamid = teamid;
    this.phonenumber = phonenumber;
    this.email = email;
    this.password = password;
    this.approved = approved;
    this.admin = admin;
    this.approved_by = approved_by ? new mongodb.ObjectId(approved_by) : null;
    this._id = id ? new mongodb.ObjectId(id) : null;
  }

  save() {
    const db = getDb();
    let oDB;
    if (this._id) {
      oDB = db.collection("users").updateOne({ _id: this._id }, { $set: this });
    } else {
      oDB = db.collection("users").insertOne(this);
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
      .collection("users")
      .find()
      .toArray()
      .then((result: User[]) => {
        return result;
      })
      .catch((err: Error) => console.log(err));
  }

  static findById(_id: string) {
    const db = getDb();

    return db
      .collection("users")
      .find({ _id: new mongodb.ObjectId(_id) })
      .next()
      .then((result: User) => {
        return result;
      })
      .catch((err: Error) => console.log(err));
  }

  static deleteById(_id: string) {
    const db = getDb();

    return db
      .collection("users")
      .deleteOne({ _id: new mongodb.ObjectId(_id) })
      .then((result: User) => {
        console.log("Deleted");
        return result;
      })
      .catch((err: Error) => console.log(err));
  }

  static findByEmail(email: string) {
    const db = getDb();

    return db
      .collection("users")
      .find({ email: email })
      .next()
      .then((result: User) => {
        return result;
      })
      .catch((err: Error) => console.log(err));
  }

  static findByTeamId(teamid: number) {
    const db = getDb();
    return db
      .collection("users")
      .find({ teamid: teamid })
      .next()
      .then((result: User[]) => {
        return result;
      })
      .catch((err: Error) => {
        return err;
      });
  }
  
}

export default User;
