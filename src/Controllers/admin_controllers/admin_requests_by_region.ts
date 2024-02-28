import { NextFunction, Request, Response } from "express";
import RequestModel from "../../db/models/request";
import Patient from "../../db/models/patient";

export const requests_by_region = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { state, region } = req.params;
    const requests = await RequestModel.findAll({
      where: { request_state: state },
      include: {
        model: Patient,
        attributes: ["region"],
        where:{
          region:region
        }
      },
    });
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
