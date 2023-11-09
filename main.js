const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

//Routes
const authRouter = require("./routes/authRoute.js");
const paymentsRouter = require("./routes/paymentsRoute.js");

//Controllers
const errorController = require("./controllers/error.js");

//database connection
const mongoConnect = require("./util/database").mongoConnect;

const app = express();
const port = 3000;

// create application/json parser
const jsonParser = bodyParser.json();
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/auth", jsonParser, authRouter);
app.use("/payments",jsonParser, paymentsRouter);

//error handling
app.use(errorController.get404);

mongoConnect(() => {
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
});
