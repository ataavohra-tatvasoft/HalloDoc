import { NextFunction, Request, Response } from "express";
import RequestModel from "../../db/models/request";
import Patient from "../../db/models/patient";
import Requestor from "../../db/models/requestor";
import Provider from "../../db/models/provider";

export const requests_by_region = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { state, region } = req.params;
    if(region=="All Regions"){
      res.redirect('/dashboard/requests/:state');
    }
    if (state == "new") {
      const requests = await RequestModel.findAll({
        where: { request_state: state },
        attributes: ["requested_date"],
        include: [
          {
            model: Patient,
            attributes: [
              "patient_id",
              "firstname",
              "lastname",
              "dob",
              "mobile_number",
              "address",
            ],
            where: {
              region: region,
            },
          },
          {
            model: Requestor,
            attributes: ["user_id", "first_name", "last_name"],
          },
        ],
      });

      res.json(requests);
    }
    if (state == "pending") {
      const requests = await RequestModel.findAll({
        where: { request_state: state },
        attributes: ["requested_date", "notes_symptoms", "date_of_service"],
        include: [
          {
            model: Patient,
            attributes: [
              "patient_id",
              "firstname",
              "lastname",
              "dob",
              "mobile_number",
              "address",
            ],
            where: {
              region: region,
            },
          },
          {
            model: Requestor,
            attributes: ["user_id", "first_name", "last_name"],
          },
          {
            model: Provider,
            where: { role: "physician" },
            attributes: ["provider_id", "firstname", "lastname"],
          },
        ],
      });
      res.json(requests);
    }
    if (state == "active") {
      const requests = await RequestModel.findAll({
        where: { request_state: state },
        attributes: ["requested_date", "notes_symptoms", "date_of_service"],
        include: [
          {
            model: Patient,
            attributes: [
              "patient_id",
              "firstname",
              "lastname",
              "dob",
              "mobile_number",
              "address",
            ],
            where: {
              region: region,
            },
          },
          {
            model: Requestor,
            attributes: ["user_id", "first_name", "last_name"],
          },
          {
            model: Provider,
            where: { role: "physician" },
            attributes: ["provider_id", "firstname", "lastname"],
          },
        ],
      });
      res.json(requests);
    }
    if (state == "conclude") {
      const requests = await RequestModel.findAll({
        where: { request_state: state },
        attributes: ["requested_date", "date_of_service"],
        include: [
          {
            model: Patient,
            attributes: [
              "patient_id",
              "firstname",
              "lastname",
              "dob",
              "mobile_number",
              "address",
            ],
            where: {
              region: region,
            },
          },
          {
            model: Provider,
            where: { role: "physician" },
            attributes: ["provider_id", "firstname", "lastname"],
          },
        ],
      });
      res.json(requests);
    }
    if (state == "toclose") {
      const requests = await RequestModel.findAll({
        where: { request_state: state },
        attributes: ["date_of_service", "notes_symptoms"],
        include: [
          {
            model: Patient,
            attributes: [
              "patient_id",
              "firstname",
              "lastname",
              "dob",
              "address",
              "region",
            ],
            where: {
              region: region,
            },
          },
          {
            model: Provider,
            where: { role: "physician" },
            attributes: ["provider_id", "firstname", "lastname"],
          },
        ],
      });
      res.json(requests);
    }
    if (state == "unpaid") {
      const requests = await RequestModel.findAll({
        where: { request_state: state },
        attributes: ["date_of_service"],
        include: [
          {
            model: Patient,
            attributes: [
              "patient_id",
              "firstname",
              "lastname",
              "mobile_number",
              "address",
            ],
            where: {
              region: region,
            },
          },
          {
            model: Provider,
            where: { role: "physician" },
            attributes: ["provider_id", "firstname", "lastname"],
          },
        ],
      });
      res.json(requests);
    } else {
      res.status(500).json({ message: "Invalid State !!!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
