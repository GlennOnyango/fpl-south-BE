import { weeklyStandings, getBootStrap } from "../stats/weekly";
import { leagueWeeks, monthlyStandings } from "../stats/monthly";
import { validationResult } from "express-validator";

export const getWeeklyRank = async (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: "error",
      error: errors.array()[0].msg,
    });
  }

  const eventCurrent = await getBootStrap();
  const standings = await weeklyStandings();

  if (standings.length === 0) {
    return res.status(500).json({
      status: "error",
      error: "No standings found",
    });
  }

  res.status(200).json({
    status: "success",
    data: standings,
    event: eventCurrent,
  });
};

export const getMonthlyRank = async (req: any, res: any, next: any) => {
  const eventWeeks = await leagueWeeks();
  const standings = await monthlyStandings();

  if (standings.length === 0) {
    return res.status(500).json({
      status: "error",
      error: "No standings found",
    });
  }

  res.status(200).json({
    status: "success",
    data: standings,
    event: eventWeeks,
  });
};
