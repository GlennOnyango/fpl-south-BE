import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import Payment from "../models/paymentModel";
import WeeksModel from "../models/weeksModel";
import MonthsModel from "../models/monthsModel";

export const postCreatePayment = (req: any, res: any, next: any) => {
  if (!req.headers.authorization) {
    return res.status(401).json({
      status: "error",
      error: "Unauthorized",
    });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: "error",
      error: errors.array(),
    });
  }

  const bearerToken = req.headers.authorization.split(" ")[1];

  jwt.verify(
    bearerToken,
    process.env.JWT_SECRET as string,
    (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({
          status: "error",
          error: err,
        });
      }

      const amount = req.body.amount;
      const phone = req.body.phone;
      const weeks: number[] = req.body.weeks;
      const months: number[] = req.body.months;
      const mpesaToken = req.body.mpesaToken;
      const approved = false;
      const userId = decoded.userId;

      const payment = new Payment(
        phone,
        weeks,
        months,
        amount,
        mpesaToken,
        approved,
        userId
      );

      payment.save().then((result: any) => {
        res.status(200).json({
          status: "Payment created successfully",
        });
      });

      //
    }
  );
};

export const getPayments = (req: any, res: any, next: any) => {
  if (!req.headers.authorization) {
    return res.status(401).json({
      status: "error",
      error: "Unauthorized",
    });
  }

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

      const payments = await Payment.fetchAll();

      if (payments.length === 0) {
        return res.status(500).json({
          status: "error",
          error: "No payments found",
        });
      }

      res.status(200).json({
        status: "success",
        data: payments,
      });

      //
    }
  );
};

//To check later
export const postApprovePayment = (req: any, res: any, next: any) => {
  if (!req.headers.authorization) {
    return res.status(401).json({
      status: "error",
      error: "Unauthorized",
    });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: "error",
      error: errors.array(),
    });
  }

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

      const paymentId = req.body.paymentId;

      const payment = await Payment.findById(paymentId);

      if (!payment) {
        return res.status(500).json({
          status: "error",
          error: "Payment not found",
        });
      }

      payment.approved = true;
      payment.adminId = decoded.userId;

      payment
        .save()
        .then((result: any) => {
          if (payment.weeks.length > 1) {
            WeeksModel.fetchByUserId(payment.userId)
              .then((weeks: any) => {
                payment.weeks.forEach((week: number) => {
                  weeks.weeks[week - 1].approved = true;
                });

                const weeksModel = new WeeksModel(
                  weeks.weeks,
                  payment.userId,
                  weeks._id
                );

                weeksModel
                  .save()
                  .then((result: any) => {
                    next();
                  })
                  .catch((err: any) => {
                    res.status(500).json({
                      status: "error",
                      error: err,
                    });
                  });
              })
              .catch((err: any) => {
                res.status(500).json({
                  status: "error",
                  error: err,
                });
              });
          }

          if (payment.months.length > 1) {
            MonthsModel.fetchByUserId(payment.userId)
              .then((monthsModelUser: any) => {
                monthsModelUser.map((month: any) => {
                  if (payment.months.includes(month.month)) {
                    month.approved = true;
                  }

                  return month;
                });

                const monthsModel = new MonthsModel(
                  monthsModelUser,
                  payment.userId,
                  monthsModelUser._id
                );

                monthsModel
                  .save()
                  .then((result: any) => {
                    next();
                  })
                  .catch((err: any) => {
                    res.status(500).json({
                      status: "error",
                      error: err,
                    });
                  });
              })
              .catch((err: any) => {
                res.status(500).json({
                  status: "error",
                  error: err,
                });
              });
          }
          res.status(200).json({
            status: "Payment approved successfully",
            
          });
        })
        .catch((err: any) => {
          res.status(500).json({
            status: "error",
            error: err,
          });
        });

      //
    }
  );
};

export const getPaymentsByUserId = (req: any, res: any, next: any) => {
  if (!req.headers.authorization) {
    return res.status(401).json({
      status: "error",
      error: "Unauthorized",
    });
  }

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

      const payments = await Payment.findByUserId(decoded.userId);

      if (payments.length === 0) {
        return res.status(500).json({
          status: "error",
          error: "No payments found",
        });
      }

      res.status(200).json({
        status: "success",
        data: payments,
      });

      //
    }
  );
};

export const editPayment = (req: any, res: any, next: any) => {
  if (!req.headers.authorization) {
    return res.status(401).json({
      status: "error",
      error: "Unauthorized",
    });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: "error",
      error: errors.array(),
    });
  }

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

      const paymentId = req.body.paymentId;

      const payment = await Payment.findById(paymentId);

      if (!payment) {
        return res.status(500).json({
          status: "error",
          error: "Payment not found",
        });
      }

      payment.approved = true;
      payment.adminId = decoded.userId;

      payment.save().then((result: any) => {
        res.status(200).json({
          status: "Payment approved successfully",
        });
      });

      //
    }
  );
};
