import { validationResult } from "express-validator";
import Payment from "../models/paymentModel";
import { updateWeeksByUserId } from "./weeksController";

export const postCreatePayment = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: "error",
      error: errors.array()[0].msg,
    });
  }

  const amount = req.body.amount;
  const phone = req.body.phone;
  const weeks: number[] = req.body.weeks;
  const months: number[] = req.body.months;
  const mpesaToken = req.body.mpesaToken;
  const approved = false;
  const userId = req.userId;

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
};

export const getPayments = async (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: "error",
      error: errors.array()[0].msg,
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
};

//To check later
export const postApprovePayment = async (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: "error",
      error: errors.array()[0].msg,
    });
  }

  const admin = req.admin;
  const userId = req.userId;

  if (admin) {
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
  payment.adminId = userId;

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
};

export const getMyPayments = async (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: "error",
      error: errors.array()[0].msg,
    });
  }

  const userId = req.userId;

  const payments = await Payment.findByUserId(userId);

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
};

export const getPaymentsByUserId = async(req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: "error",
      error: errors.array()[0].msg,
    });
  }

  const userId = req.userId;
  const admin = req.admin;

  if (admin) {
    return res.status(401).json({
      status: "error",
      error: "Unauthorized",
    });
  }

  const payments = await Payment.findByUserId(userId);

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

};

export const editPayment = async(req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: "error",
      error: errors.array()[0].msg,
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
  payment.adminId = req.userId;

  payment.save().then((result: any) => {
    res.status(200).json({
      status: "Payment approved successfully",
    });
  });

};

