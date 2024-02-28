import { Request, Response, NextFunction } from "express";
import RequestModel from "../../db/models/request";
import statusCodes from "../../public/status_codes";
import Note from "../../db/models/notes";
import Patient from "../../db/models/patient";
// import Provider from "../../db/models/provider";
// import Admin from "../../db/models/admin";
// import Requestor from "../../db/models/requestor";
import dotenv from "dotenv";
dotenv.config({ path: `.env` });

export const create_request = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      body: {
        FirstName,
        LastName,
        DOB,
        PhoneNumber,
        Email,
        Street,
        City,
        State,
        Zip,
        Room,
        PhysicianNotes,
        AdminNotes,
      },
    } = req;
    const patient_data = await Patient.create({
      firstname: FirstName,
      lastname: LastName,
      dob: DOB,
      mobile_number: PhoneNumber,
      email: Email,
      street: Street,
      city: City,
      state: State,
      zip: Zip,
      address: Room,
    });
    const request_data = await RequestModel.create({
      request_state: "new",
      patient_id: patient_data.patient_id,
      requested_by: "Admin",
      requested_date: new Date(),
    });
    const physician_note = await Note.create({
      requestId: request_data.request_id,
      //  requested_by: "physician",
      description: PhysicianNotes,
      typeOfNote: "physician",
    });

    const admin_note = await Note.create({
      requestId: request_data.request_id,
      //  requested_by: "Admin",
      description: AdminNotes,
      typeOfNote: "admin",
    });

    if (!patient_data && !request_data && !physician_note && !admin_note) {
      return res.status(400).json({
        status: false,
        message: "Failed To Create Request!!!",
      });
    }

    if (patient_data && request_data && physician_note && admin_note) {
      return res.status(200).json({
        status: true,
        message: "Created Request Successfully !!!",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: false,
      errormessage: "Internal server error" + error.message,
      message: statusCodes[500],
    });
  }
};
