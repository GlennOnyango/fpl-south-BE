import jwt from "jsonwebtoken";
import { weeklyTeamId } from "../stats/weekly";
import User from "../models/userModel";
import { monthlyTeamId } from "../stats/monthly";
import MonthsModel from "../models/monthsModel";
import WeeksModel from "../models/weeksModel";

export const getWeeklyPaidUser = (req: any, res: any, next: any) => {
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

      const teamIds = await weeklyTeamId();

      if (teamIds.length === 0) {
        return res.status(500).json({
          status: "error",
          error: "No standings found",
        });
      }
      const registeredUsers = await User.findUsersByTeamId(teamIds);

      const userIds = registeredUsers.map((user: User) => user._id);

      const weekModelArray = await WeeksModel.fetchByuserIds(userIds);

      const openToPlay = weekModelArray.map((weekModel: WeeksModel) => {
        if (weekModel.weeks[gameWeek - 1].approved) {
          return weekModel;
        }
      });

      res.status(200).json({
        status: "success",
        data: openToPlay,
      });

      //
    }
  );
};

export const getMonthlyPaidUser = (req: any, res: any, next: any) => {
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

      const standings = await monthlyTeamId();

      if (standings.length === 0) {
        return res.status(500).json({
          status: "error",
          error: "No standings found",
        });
      }

      const registeredUsers = await User.findUsersByTeamId(standings);

      const userIds = registeredUsers.map((user: User) => user._id);

      const monthModelArray = await MonthsModel.fetchByUserIds(userIds);

      const openToPlay = monthModelArray.map((monthModel: MonthsModel) => {
        if (monthModel.months[gameMonth - 1].approved) {
          return monthModel;
        }
      });

      res.status(200).json({
        status: "success",
        data: openToPlay,
      });

      //
    }
  );
};
