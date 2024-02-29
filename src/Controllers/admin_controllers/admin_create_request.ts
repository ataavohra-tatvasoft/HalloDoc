import { Request, Response, NextFunction } from "express";
import RequestModel from "../../db/models/request";
import statusCodes from "../../public/status_codes";
import Note from "../../db/models/notes";
import Patient from "../../db/models/patient";
import dotenv from "dotenv";
import { Op } from "sequelize";
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
        AdminNotes,
      },
    } = req;
    // const today = new Date();
    // console.log(today,today.getFullYear(),today.getFullYear().toString(),today.getFullYear().toString().slice(-2));
    const patient_data = await Patient.create({
      firstname: FirstName,
      lastname: LastName,
      dob: new Date(DOB),
      mobile_number: PhoneNumber,
      email: Email,
    });

    const today = new Date();
    const year = today.getFullYear().toString().slice(-2); // Last 2 digits of year
    const month = String(today.getMonth() + 1).padStart(2, "0"); // 0-padded month
    const day = String(today.getDate()).padStart(2, "0"); // 0-padded day

    const todaysRequestsCount = await RequestModel.count({
      where: {
        createdAt: {
          [Op.gte]: `${today.toISOString().split("T")[0]}`, // Since midnight today
          [Op.lt]: `${today.toISOString().split("T")[0]}T23:59:59.999Z`, // Until the end of today
        },
      },
    });

    const confirmation_no = `${patient_data.region.slice(
      0,
      2
    )}${year}${month}${day}${LastName.slice(0, 2)}${FirstName.slice(
      0,
      2
    )}${String(todaysRequestsCount + 1).padStart(4, "0")}`;
    const request_data = await RequestModel.create({
      request_state: "new",
      patient_id: patient_data.patient_id,
      requested_by: "Admin",
      requested_date: new Date(),
      confirmation_no: confirmation_no,
    });
    const admin_note = await Note.create({
      requestId: request_data.request_id,
      //  requested_by: "Admin",
      description: AdminNotes,
      typeOfNote: "admin",
    });

    if (!patient_data && !request_data && !admin_note) {
      return res.status(400).json({
        status: false,
        message: "Failed To Create Request!!!",
      });
    }

    if (patient_data && request_data && admin_note) {
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
