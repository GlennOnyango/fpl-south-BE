import jwt from "jsonwebtoken";
import WeeksModel from "../models/weeksModel";
import { updateMonthsByUserId } from "./monthsController";
import { validationResult } from "express-validator";

//get weeks using userId
export const getWeeksByUserId = (req: any, res: any, next: any) => {
  const bearerToken = req.headers.authorization.split(" ")[1];

  const userId = req.params.userId;

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

      WeeksModel.fetchByUserId(userId)
        .then((weeksModelData: any) => {
          res.status(200).json({
            status: "success",
            data: weeksModelData,
          });
        })
        .catch((err: any) => {
          res.status(500).json({
            status: "error",
            error: err,
            source: "weeksModel",
          });
        });
    }
  );
};

export const getMyWeeks = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: "error",
      error: errors.array()[0].msg,
    });
  }

  const userId = req.userId;

  WeeksModel.fetchByUserId(userId)
    .then((weeksModelData: any) => {
      res.status(200).json({
        status: "success",
        data: weeksModelData,
      });
    })
    .catch((err: any) => {
      res.status(500).json({
        status: "error",
        error: err,
        source: "weeksModel",
      });
    });
};

//update weeks using userId
export const updateWeeksByUserId = (req: any, res: any, next: any) => {
  const bearerToken = req.headers.authorization.split(" ")[1];

  const paymentUpdate = req.body.paymentUpdate;
  const userId = paymentUpdate.userId;

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

      //fetch weeks by userId

      const weeksModelData = await WeeksModel.fetchByUserId(userId);

      //update weeks
      paymentUpdate.weeks.forEach((week: number) => {
        weeksModelData.weeks[week - 1].approved = true;
      });

      const weeksModel = new WeeksModel(
        weeksModelData.weeks,
        weeksModelData.userId,
        weeksModelData._id
      );

      weeksModel
        .save()
        .then(async (result: any) => {
          //fetch weeks by userId

          const weeksUpdate = await WeeksModel.fetchByUserId(userId);
          req.body.weeks = weeksUpdate.weeks;

          //update months
          if (paymentUpdate.months.length > 0) {
            updateMonthsByUserId(req, res, next);
          }
        })
        .catch((err: any) => {
          res.status(500).json({
            status: "error",
            error: err,
            source: "weeksModel",
          });
        });
    }
  );
};
