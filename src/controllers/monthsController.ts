import jwt from "jsonwebtoken";
import MonthsModel from "../models/monthsModel";

//get months using userId
export const getMonthsByUserId = (req: any, res: any, next: any) => {
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

      MonthsModel.fetchByUserId(userId)
        .then((monthsModelData: any) => {
          res.status(200).json({
            status: "success",
            data: monthsModelData,
          });
        })
        .catch((err: any) => {
          res.status(500).json({
            status: "error",
            error: err,
            source: "monthsModel",
          });
        });
    }
  );
};

//get months using userId
export const getMyMonths = (req: any, res: any, next: any) => {
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

      MonthsModel.fetchByUserId(decoded.userId)
        .then((monthsModelData: any) => {
          res.status(200).json({
            status: "success",
            data: monthsModelData,
          });
        })
        .catch((err: any) => {
          res.status(500).json({
            status: "error",
            error: err,
            source: "monthsModel",
          });
        });
    }
  );
};

//update months using userId
export const updateMonthsByUserId = (req: any, res: any, next: any) => {
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

      //fetch months by userId
      const monthsModelData = await MonthsModel.fetchByUserId(userId);

      monthsModelData.months.map((month: any) => {
        if (paymentUpdate.months.includes(month.month)) {
          month.approved = true;
        }

        return month;
      });

      const monthsModel = new MonthsModel(
        monthsModelData.months,
        monthsModelData.userId,
        monthsModelData._id
      );

      monthsModel
        .save()
        .then(async (result: any) => {
          //fetch months by userId
          const monthsUpdate = await MonthsModel.fetchByUserId(userId);

          res.status(200).json({
            status: "success",
            months: monthsUpdate.months,
            weeks: req.body.weeks,
            paymentUpdate: paymentUpdate,
          });
        })
        .catch((err: any) => {
          res.status(500).json({
            status: "error",
            error: err,
            source: "monthsModel",
          });
        });
    }
  );
};
