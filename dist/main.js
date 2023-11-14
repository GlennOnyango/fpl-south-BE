"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const rankRoute_1 = __importDefault(require("./routes/rankRoute"));
require("dotenv").config();
//Routes
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const paymentsRoute_1 = __importDefault(require("./routes/paymentsRoute"));
//Controllers
const error_1 = require("./controllers/error");
//database connection
const mongoConnect = require("./util/database").mongoConnect;
const app = (0, express_1.default)();
const port = 3000;
// create application/json parser
const jsonParser = body_parser_1.default.json();
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use("/auth", jsonParser, authRoute_1.default);
app.use("/payments", jsonParser, paymentsRoute_1.default);
app.use("/rank", rankRoute_1.default);
//error handling
app.use(error_1.get404);
mongoConnect(() => {
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
});
