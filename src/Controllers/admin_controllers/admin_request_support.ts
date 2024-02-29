import { NextFunction, Request, Response } from "express";
// import RequestModel from "../../models/request";
import Provider from "../../db/models/provider";

export const request_support = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { support_message } = req.body;
    await Provider.update({
        support_message
    },
    {
        where:{
            scheduled_status:"no",
        }
    })
    return res.status(200).json({
        status: true,
        message: "Successfull !!!",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
