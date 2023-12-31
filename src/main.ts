import express from "express";
import bodyParser from "body-parser";
import rankRoutes from "./routes/rankRoute";

require("dotenv").config();

//Routes
import authRouter from "./routes/authRoute";
import paymentsRouter from "./routes/paymentsRoute";
import playerRouter from "./routes/openPlayersRoute";
import week from "./routes/weeksRoute";
//Controllers
import { get404 } from "./controllers/error";

//database connection
const mongoConnect = require("./util/database").mongoConnect;

const app = express();
const port = process.env.PORT || 3000;

// create application/json parser
const jsonParser = bodyParser.json();
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/auth", jsonParser, authRouter);
app.use("/payments", jsonParser, paymentsRouter);
app.use("/rank", rankRoutes);
app.use("/paid", playerRouter );
app.use("/weeks",week)

//error handling
app.use(get404);

mongoConnect(() => {
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
});
