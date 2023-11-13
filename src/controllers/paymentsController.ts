import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import Payment from "../models/paymentModel";

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

      payment.save().then((result: any) => {
        res.status(200).json({
          status: "Payment approved successfully",
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
} 

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
}