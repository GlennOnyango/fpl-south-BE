import { api_url } from "../constants";
import fetch from "node-fetch";

const date = new Date();
const currentMonth = date.getMonth();

const months = [6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5];

const getCostObject = async (eventIdArray: number[], userList: number[]) => {
  return Promise.all(
    userList.map(async (user: number) => {
      const userCostArray = eventIdArray.map(async (event: number) => {
        const userCost = await fetch(
          `${api_url}entry/${user}/event/${event}/picks/`,
          {
            method: "GET",
            redirect: "follow",
          }
        );
        const userCostData = await userCost.text();
        const userCostObject = JSON.parse(userCostData);

        if (userCostObject["detail"] === "Not found.") {
          return 0;
        }

        return userCostObject["entry_history"]["event_transfers_cost"];
      });
      const userCost = await Promise.all(userCostArray);
      const userCostTotal = userCost.reduce(
        (total: number, currentValue: any) => {
          return total + currentValue;
        },
        0
      );
      return {
        id: user,
        cost: userCostTotal,
        weeks: eventIdArray,
        costArray: userCost,
      };
    })
  );
};

const rawMonthlyStandings = async () => {
  // Get standings
  const standingsCall = await fetch(
    `${api_url}leagues-classic/264658/standings/?page_new_entries=1&page_standings=1&phase=${
      months[currentMonth] + 1
    }`,
    {
      method: "GET",
      redirect: "follow",
    }
  );

  const standings = await standingsCall.text();
  const dataObject = JSON.parse(standings);
  const collectedStandings = dataObject["standings"]["results"];
  return collectedStandings;
};

const leagueWeeks = async () => {
  let eventCurrent: number[] = [];
  const bootStrap = await fetch(`${api_url}bootstrap-static/`, {
    method: "GET",
    redirect: "follow",
  });

  const bootStrapData = await bootStrap.text();
  const bootStrapObject = JSON.parse(bootStrapData);
  const events = bootStrapObject["events"];
  events.forEach((event: any) => {
    const eventDate = new Date(event["deadline_time"]);
    const eventMonth = eventDate.getMonth();
    if (eventMonth === currentMonth) {
      eventCurrent.push(event["id"]);
    }
  });
  return eventCurrent;
};

export async function monthlyStandings() {
  //Get standings
  const collectedStandings = await rawMonthlyStandings();
  //Get current event
  const eventCurrentArray = await leagueWeeks();
  // Get weekly cost
  const userList = collectedStandings.map((e: any) => e.entry);

  if (eventCurrentArray.length > 0 && userList.length > 0) {
    const costObject = await getCostObject(eventCurrentArray, userList);

    const dataCombined = costObject.map((e: any) => {
      const entry = e.id;
      const cost = e.cost;
      const index = collectedStandings.findIndex((e: any) => e.entry === entry);
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

    return dataCombined.sort((a: any, b: any) => {
      return b["event_total"] - a["event_total"];
    });
  }
  return [];
}
