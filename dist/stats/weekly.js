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
exports.weeklyTeamId = exports.weeklyStandings = void 0;
const constants_1 = require("../constants");
const node_fetch_1 = __importDefault(require("node-fetch"));
const getCostObject = (eventId, userArray) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Promise.all(userArray.map((user) => __awaiter(void 0, void 0, void 0, function* () {
        const transferDetails = yield (0, node_fetch_1.default)(`https://fantasy.premierleague.com/api/entry/${user}/event/${eventId}/picks/`, {
            method: "GET",
            redirect: "follow",
        });
        const result = yield transferDetails.text();
        const dataEvent = yield JSON.parse(result);
        const transferCost = yield dataEvent["entry_history"]["event_transfers_cost"];
        return {
            id: user,
            cost: transferCost,
        };
    })));
});
const getBootStrap = () => __awaiter(void 0, void 0, void 0, function* () {
    let eventCurrent = 0;
    const bootStrap = yield (0, node_fetch_1.default)(`${constants_1.api_url}bootstrap-static/`, {
        method: "GET",
        redirect: "follow",
    });
    const bootStrapData = yield bootStrap.text();
    const bootStrapObject = JSON.parse(bootStrapData);
    const events = bootStrapObject["events"];
    events.forEach((event) => {
        if (event["is_current"]) {
            eventCurrent = event["id"];
        }
    });
    return eventCurrent;
});
const rawWeeklyStandings = () => __awaiter(void 0, void 0, void 0, function* () {
    // Get standings
    const standingsCall = yield (0, node_fetch_1.default)(`${constants_1.api_url}leagues-classic/264658/standings/`, {
        method: "GET",
        redirect: "follow",
    });
    const standings = yield standingsCall.text();
    const dataObject = JSON.parse(standings);
    const collectedStandings = dataObject["standings"]["results"];
    return collectedStandings;
});
function weeklyStandings() {
    return __awaiter(this, void 0, void 0, function* () {
        //Get standings
        const collectedStandings = yield rawWeeklyStandings();
        //Get current event
        const eventCurrent = yield getBootStrap();
        // Get weekly cost
        const userList = collectedStandings.map((e) => e.entry);
        if (eventCurrent !== 0 && userList.length > 0) {
            const dataCost = yield getCostObject(eventCurrent, userList);
            const dataCombined = dataCost.map((e) => {
                const entry = e.id;
                const cost = e.cost;
                const index = collectedStandings.findIndex((e) => e.entry === entry);
                const entry_name = collectedStandings[index].entry_name;
                const event_total = collectedStandings[index].event_total;
                const player_name = collectedStandings[index].player_name;
                return {
                    id: entry,
                    event_total: event_total - cost,
                    player_name: player_name,
                    total: collectedStandings[index].total,
                    entry: entry,
                    entry_name: entry_name,
                    cost: cost,
                };
            });
            return dataCombined.sort((a, b) => {
                return b["event_total"] - a["event_total"];
            });
        }
        return [];
    });
}
exports.weeklyStandings = weeklyStandings;
function weeklyTeamId() {
    return __awaiter(this, void 0, void 0, function* () {
        const collectedStandings = yield rawWeeklyStandings();
        const userList = collectedStandings.map((e) => String(e.entry));
        return userList;
    });
}
exports.weeklyTeamId = weeklyTeamId;
