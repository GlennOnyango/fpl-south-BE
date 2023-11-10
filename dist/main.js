"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
require("dotenv").config();
//Routes
const authRouter = require("./routes/authRoute.js");
const paymentsRouter = require("./routes/paymentsRoute.js");
//Controllers
const errorController = require("./controllers/error.js");
//database connection
const mongoConnect = require("./util/database").mongoConnect;
const app = (0, express_1.default)();
const port = 3000;
// create application/json parser
const jsonParser = body_parser_1.default.json();
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use("/auth", jsonParser, authRouter);
app.use("/payments", jsonParser, paymentsRouter);
//error handling
app.use(errorController.get404);
mongoConnect(() => {
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
});
