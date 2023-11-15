import jwt from "jsonwebtoken";
import { weeklyStandings } from "../stats/weekly";
import User from "../models/userModel";
import WeeksModel from "../models/weeksModel";
import { monthlyStandings } from "../stats/monthly";
import MonthsModel from "../models/monthsModel";

type weeksObject = {
  week: number;
  approved: boolean;
};

type monthsObject = {
  month: number;
  approved: boolean;
};

export const getWeeklyRankOpen = (req: any, res: any, next: any) => {
  const bearerToken = req.headers.authorization.split(" ")[1];

  const gameWeek = req.params.gameWeek;

  jwt.verify(
    bearerToken,
    process.env.JWT_SECRET as string,
    async (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({
          status: "error",
          error: err,
        });
      }

      const standings = await weeklyStandings();

      if (standings.length === 0) {
        return res.status(500).json({
          status: "error",
          error: "No standings found",
        });
      }

      const openToPlay = standings.map((userStanding) => {
        User.findByTeamId(userStanding.id)
          .then((userDoc: any) => {
            WeeksModel.fetchByUserId(userDoc._id)
              .then((weekModelData: any) => {
                const userWeek = weekModelData.weeks.find(
                  (week: weeksObject) => {
                    return week.week === gameWeek;
                  }
                );

                if (userWeek.approved) {
                  return userStanding;
                }
              })
              .catch((err: any) => {
                res.status(500).json({
                  status: "error",
                  error: err,
                  source: "weeksModel",
                });
              });
          })
          .catch((err: any) => {
            res.status(500).json({
              status: "error",
              error: err,
              source: "userModel",
            });
          });
      });

      res.status(200).json({
        status: "success",
        data: openToPlay,
      });

      //
    }
  );
};

export const getMonthlyRankOpen = (req: any, res: any, next: any) => {
  const bearerToken = req.headers.authorization.split(" ")[1];

  const gameMonth = req.params.gameMonth;

  jwt.verify(
    bearerToken,
    process.env.JWT_SECRET as string,
    async (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({
          status: "error",
          error: err,
        });
      }

      const standings = await monthlyStandings();

      if (standings.length === 0) {
        return res.status(500).json({
          status: "error",
          error: "No standings found",
        });
      }

      const openToPlay = standings.map((userStanding) => {
        User.findByTeamId(userStanding.id)
          .then((userDoc: any) => {
            MonthsModel.fetchByUserId(userDoc._id)
              .then((monthModelData: any) => {
                const month = monthModelData.months.find(
                  (monthObject: monthsObject) => monthObject.month === gameMonth
                );

                if (month.approved) {
                  return userStanding;
                }
              })
              .catch((err: any) => {
                res.status(500).json({
                  status: "error",
                  error: err,
                  source: "monthsModel",
                });
              });
          })
          .catch((err: any) => {
            res.status(500).json({
              status: "error",
              error: err,
              source: "userModel",
            });
          });
      });

      res.status(200).json({
        status: "success",
        data: openToPlay,
      });

      //
    }
  );
};
