const mongodb = require("mongodb");
const getDb = require("../../util/database").getDb;

class KopoKopoDetails {
  constructor(clientId, clientSecret, apiKey, sbaseUrl, id) {
    this.clientId = clientId.length > 0 ? clientId : "YOUR_CLIENT_ID";
    this.clientSecret =
      clientSecret.length > 0 ? clientSecret : "YOUR_CLIENT_SECRET";
    this.apiKey = apiKey.length > 0 ? apiKey : "YOUR_API_KEY";
    this.sbaseUrl =
      sbaseUrl.length > 0 ? sbaseUrl : "https://sandbox.kopokopo.com";
    this._id = id ? new mongodb.ObjectId(id) : null;
  }

  save() {
    const db = getDb();
    let oDB;
    if (this._id) {
      oDB = db
        .collection("kopokopodetails")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      oDB = db.collection("kopokopodetails").insertOne(this);
    }

    return oDB
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findById(_id) {
    const db = getDb();

    return db
      .collection("kopokopodetails")
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
      .collection("kopokopodetails")
      .deleteOne({ _id: new mongodb.ObjectId(_id) })
      .then((result) => {
        console.log("Deleted");
        return result;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = KopoKopoDetails;
