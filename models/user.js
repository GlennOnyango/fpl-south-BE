const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class User {
  constructor(username, teamid, phonenumber, email, password, id) {
    this.username = username;
    this.teamid = teamid;
    this.phonenumber = phonenumber;
    this.email = email;
    this.password = password;
    this.approved = false;
    this.admin = false;
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
      .find({ _id: new mongodb.ObjectId(_id) })
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
      .deleteOne({ _id: new mongodb.ObjectId(_id) })
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
      .find(email)
      .next()
      .then((result) => {
        return result;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = User;
