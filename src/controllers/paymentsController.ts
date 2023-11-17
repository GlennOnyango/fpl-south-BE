import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import Payment from "../models/paymentModel";
import { updateWeeksByUserId } from "./weeksController";
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
      error: "Unauthorized headers",
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

      if (!decoded.admin) {
        return res.status(401).json({
          status: "error",
          error: "Unauthorized",
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

      const PaymentModel = new Payment(
        payment.phone,
        payment.weeks,
        payment.months,
        payment.amount,
        payment.mpesaToken,
        payment.approved,
        payment.userId,
        payment._id,
        payment.adminId
      );

      const paymentResult = await PaymentModel.save();

      if (paymentResult.modifiedCount === 1) {
        const paymentIdUpdate = req.body.paymentId;

        const paymentUpdate = await Payment.findById(paymentIdUpdate);

        req.body.paymentUpdate = paymentUpdate;

        //update weeks

        if (paymentUpdate.weeks.length > 0) {
          updateWeeksByUserId(req, res, next);
        }
      }

      //
    }
  );
};

export const getMyPayments = (req: any, res: any, next: any) => {
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

export const getPaymentsByUserId = (req: any, res: any, next: any) => {
  if (!req.headers.authorization) {
    return res.status(401).json({
      status: "error",
      error: "Unauthorized",
    });
  }

  if (!req.params.userId) {
    return res.status(422).json({
      status: "error",
      error: "User id is required",
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

      if (!decoded.admin) {
        return res.status(401).json({
          status: "error",
          error: "Unauthorized",
        });
      }

      const payments = await Payment.findByUserId(req.params.userId);

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
