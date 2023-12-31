"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkTeamIdWithUserName = exports.checkTeamId = void 0;
const constants_1 = require("../constants");
const node_fetch_1 = __importDefault(require("node-fetch"));
function checkTeamId(teamId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(teamId);
        const userData = yield (0, node_fetch_1.default)(`${constants_1.api_url}entry/${teamId}/`, {
            method: "GET",
            redirect: "follow",
        });
        const userDataText = yield userData.text();
        const userDataObject = JSON.parse(userDataText);
        if (userDataObject["id"] == teamId) {
            return true;
        }
        return false;
    });
}
exports.checkTeamId = checkTeamId;
function checkTeamIdWithUserName(teamId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(teamId);
        const userData = yield (0, node_fetch_1.default)(`${constants_1.api_url}entry/${teamId}/`, {
            method: "GET",
            redirect: "follow",
        });
        const userDataText = yield userData.text();
        const userDataObject = JSON.parse(userDataText);
        if (userDataObject["id"] == teamId) {
            const username = userDataObject["player_first_name"] +
                " " +
                userDataObject["player_last_name"];
            return { status: true, username: username };
        }
        return { status: false, username: null };
    });
}
exports.checkTeamIdWithUserName = checkTeamIdWithUserName;
