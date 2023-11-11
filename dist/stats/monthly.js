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
exports.monthlyStandings = void 0;
const constants_1 = require("../constants");
const node_fetch_1 = __importDefault(require("node-fetch"));
const date = new Date();
const currentMonth = date.getMonth();
const months = [6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5];
const getCostObject = (eventIdArray, userList) => __awaiter(void 0, void 0, void 0, function* () {
    return Promise.all(userList.map((user) => __awaiter(void 0, void 0, void 0, function* () {
        const userCostArray = eventIdArray.map((event) => __awaiter(void 0, void 0, void 0, function* () {
            const userCost = yield (0, node_fetch_1.default)(`${constants_1.api_url}entry/${user}/event/${event}/picks/`, {
                method: "GET",
                redirect: "follow",
            });
            const userCostData = yield userCost.text();
            const userCostObject = JSON.parse(userCostData);
            if (userCostObject["detail"] === "Not found.") {
                return 0;
            }
            return userCostObject["entry_history"]["event_transfers_cost"];
        }));
        const userCost = yield Promise.all(userCostArray);
        const userCostTotal = userCost.reduce((total, currentValue) => {
            return total + currentValue;
        }, 0);
        return {
            id: user,
            cost: userCostTotal,
            weeks: eventIdArray,
            costArray: userCost,
        };
    })));
});
const rawMonthlyStandings = () => __awaiter(void 0, void 0, void 0, function* () {
    // Get standings
    const standingsCall = yield (0, node_fetch_1.default)(`${constants_1.api_url}leagues-classic/264658/standings/?page_new_entries=1&page_standings=1&phase=${months[currentMonth] + 1}`, {
        method: "GET",
        redirect: "follow",
    });
    const standings = yield standingsCall.text();
    const dataObject = JSON.parse(standings);
    const collectedStandings = dataObject["standings"]["results"];
    return collectedStandings;
});
const leagueWeeks = () => __awaiter(void 0, void 0, void 0, function* () {
    let eventCurrent = [];
    const bootStrap = yield (0, node_fetch_1.default)(`${constants_1.api_url}bootstrap-static/`, {
        method: "GET",
        redirect: "follow",
    });
    const bootStrapData = yield bootStrap.text();
    const bootStrapObject = JSON.parse(bootStrapData);
    const events = bootStrapObject["events"];
    events.forEach((event) => {
        const eventDate = new Date(event["deadline_time"]);
        const eventMonth = eventDate.getMonth();
        if (eventMonth === currentMonth) {
            eventCurrent.push(event["id"]);
        }
    });
    return eventCurrent;
});
function monthlyStandings() {
    return __awaiter(this, void 0, void 0, function* () {
        //Get standings
        const collectedStandings = yield rawMonthlyStandings();
        //Get current event
        const eventCurrentArray = yield leagueWeeks();
        // Get weekly cost
        const userList = collectedStandings.map((e) => e.entry);
        if (eventCurrentArray.length > 0 && userList.length > 0) {
            const costObject = yield getCostObject(eventCurrentArray, userList);
            const dataCombined = costObject.map((e) => {
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
                    entry: entry,
                    entry_name: entry_name,
                    cost: cost,
                    weeks: e.weeks,
                    costArray: e.costArray,
                };
            });
            return dataCombined.sort((a, b) => {
                return b["event_total"] - a["event_total"];
            });
        }
        return [];
    });
}
exports.monthlyStandings = monthlyStandings;
