import jwt from "jsonwebtoken";

import { weeklyStandings } from "../stats/weekly";
import { monthlyStandings } from "../stats/monthly";

export const getWeeklyRank = (req: any, res: any, next: any) => {
  const bearerToken = req.headers.authorization.split(" ")[1];

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
 
      res.status(200).json({
        status: "success",
        data: standings,
      });

      //
    }
  );
};


export const getMonthlyRank = (req: any, res: any, next: any) => {
  const bearerToken = req.headers.authorization.split(" ")[1];

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

      res.status(200).json({
        status: "success",
        data: standings,
      });

      //
    }
  );
};