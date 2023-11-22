import mongodb from "mongodb";
const getDb = require("../util/database").getDb;

interface User {
  username: string;
  teamid: number;
  leagueid?: number;
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
    leagueid: number,
    phonenumber: number,
    email: string,
    password: string,
    approved: boolean,
    admin: boolean,
    approved_by?: mongodb.ObjectId | null,
    id?: mongodb.ObjectId | null
  ) {
    this.username = username;
    this.teamid = teamid;
    this.leagueid = leagueid;
    this.phonenumber = phonenumber;
    this.email = email;
    this.password = password;
    this.approved = approved;
    this.admin = admin;
    this.approved_by = approved_by ? approved_by : null;
    this._id = id ? id : null;
  }

  save() {
    const db = getDb();
    let oDB;
    if (this._id) {
      console.log(this._id, this);
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
      .then((result: User) => {
        return result;
      })
      .catch((err: Error) => {
        return err;
      });
  }

  static findUsersByTeamId(teamids: string[]) {
    const db = getDb();
    return db
      .collection("users")
      .find({ teamid: { $in: teamids } })
      .toArray()
      .then((result: User[]) => {
        return result;
      })
      .catch((err: Error) => {
        return err;
      });
  }
  
}

export default User;
