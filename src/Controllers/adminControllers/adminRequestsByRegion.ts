import { NextFunction, Request, Response } from "express";
import RequestModel from "../../Models/request";

export const getRequestsByRegion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { state, region } = req.params;
    const requests = await RequestModel.findAll({
      where: { request_state: state, region: region },
    });
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
