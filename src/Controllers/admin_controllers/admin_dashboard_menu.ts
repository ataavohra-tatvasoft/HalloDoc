import { Request, Response, NextFunction } from "express";
import RequestModel from "../../db/models/request_2";
import User from "../../db/models/user_2";
import Requestor from "../../db/models/requestor_2";
import Notes from "../../db/models/notes_2";
import Order from "../../db/models/order_2";
import Business from "../../db/models/business_2";
import { Controller } from "../../interfaces/common_interface";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import twilio from "twilio";
import * as crypto from "crypto";
import { MEDIUMINT, Op } from "sequelize";
import Documents from "../../db/models/documents_2";
import dotenv from "dotenv";
import path, { dirname } from "path";
import fs from "fs";
import message_constants from "../../public/message_constants";

/** Configs */
dotenv.config({ path: `.env` });

/**                              Admin in Dashboard                                       */
/**Admin SignUp */
export const admin_signup: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    body: {
      Email,
      Confirm_Email,
      Password,
      Confirm_Password,
      Status,
      Role,
      FirstName,
      LastName,
      MobileNumber,
      Zip,
      Billing_MobileNumber,
      Address_1,
      Address_2,
      City,
      State,
      Country_Code,
    },
  } = req;
  const hashedPassword: string = await bcrypt.hash(Password, 10);
  try {
    const adminData = await User.create({
      type_of_user: "admin",
      email: Email,
      password: hashedPassword,
      status: Status,
      role: Role,
      firstname: FirstName,
      lastname: LastName,
      mobile_no: MobileNumber,
      zip: Zip,
      billing_mobile_no: Billing_MobileNumber,
      address_1: Address_1,
      address_2: Address_2,
      city: City,
      state: State,
      country_code: Country_Code,
    });

    if (!adminData) {
      return res.status(400).json({
        status: false,
        message: "Failed To SignUp!!!",
      });
    }

    if (adminData) {
      return res.status(200).json({
        status: true,
        message: "SignedUp Successfully !!!",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: false,
      errormessage: "Internal server error  " + error.message,
      message: message_constants.ISE,
    });
  }
};

/**Admin Create Request */
export const admin_create_request: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      body: {
        FirstName,
        LastName,
        PhoneNumber,
        Email,
        DOB,
        Street,
        City,
        State,
        Zip,
        Room,
        AdminNotes,
      },
    } = req;
    // const today = new Date();
    // console.log(today,today.getFullYear(),today.getFullYear().toString(),today.getFullYear().toString().slice(-2));
    const patient_data = await User.create({
      type_of_user: "patient",
      firstname: FirstName,
      lastname: LastName,
      mobile_no: PhoneNumber,
      email: Email,
      dob: new Date(DOB),
      street: Street,
      city: City,
      state: State,
      zip: Zip,
      address_1: Room,
    });
    if (!patient_data) {
      return res.status(400).json({
        status: false,
        message: "Failed To Create Patient!!!",
      });
    }

    const today = new Date();
    const year = today.getFullYear().toString().slice(-2); // Last 2 digits of year
    const month = String(today.getMonth() + 1).padStart(2, "0"); // 0-padded month
    const day = String(today.getDate()).padStart(2, "0"); // 0-padded day

    const todaysRequestsCount: any = await RequestModel.count({
      where: {
        createdAt: {
          [Op.gte]: `${today.toISOString().split("T")[0]}`, // Since midnight today
          [Op.lt]: `${today.toISOString().split("T")[0]}T23:59:59.999Z`, // Until the end of today
        },
      },
    });

    const confirmation_no = `${patient_data.state.slice(
      0,
      2
    )}${year}${month}${day}${LastName.slice(0, 2)}${FirstName.slice(
      0,
      2
    )}${String(todaysRequestsCount + 1).padStart(4, "0")}`;
    const request_data = await RequestModel.create({
      request_state: "new",
      patient_id: patient_data.user_id,
      requested_by: "admin",
      requested_date: new Date(),
      confirmation_no: confirmation_no,
    });
    const admin_note = await Notes.create({
      request_id: request_data.request_id,
      //  requested_by: "Admin",
      description: AdminNotes,
      type_of_note: "admin_notes",
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
      errormessage: "Internal server error " + error.message,
      message: message_constants.ISE,
    });
  }
};

/**Old API for request */
export const requests_by_request_state: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { state, firstname, lastname, region, requestor, page, pageSize } =
      req.query as {
        state: string;
        firstname: string;
        lastname: string;
        region: string;
        requestor: string;
        page: string;
        pageSize: string;
      };
    const pageNumber = parseInt(page) || 1;
    const limit = parseInt(pageSize) || 10;
    const offset = (pageNumber - 1) * limit;

    const whereClause_patient = {
      type_of_user: "patient",
      ...(firstname && { firstname: { [Op.like]: `%${firstname}%` } }),
      ...(lastname && { lastname: { [Op.like]: `%${lastname}%` } }),
      ...(region && { state: region }),
    };

    switch (state) {
      case "new": {
        const formattedResponse: any = {
          status: true,
          data: [],
        };
        const { count, rows: requests } = await RequestModel.findAndCountAll({
          where: {
            cancellation_status: "no",
            block_status: "no",
            request_state: state,
            ...(requestor ? { requested_by: requestor } : {}),
          },
          attributes: [
            "request_id",
            "request_state",
            "confirmation_no",
            "requested_by",
            "requested_date",
            "patient_id",
          ],
          include: [
            {
              as: "Patient",
              model: User,
              attributes: [
                "type_of_user",
                "user_id",
                "firstname",
                "lastname",
                "dob",
                "mobile_no",
                "address_1",
                "address_2",
              ],
              where: whereClause_patient,
            },
            {
              model: Requestor,
              attributes: ["user_id", "first_name", "last_name"],
            },
            {
              model: Notes,
              attributes: ["noteId", "typeOfNote", "description"],
            },
          ],
          limit,
          offset,
        });

        var i = offset + 1;
        for (const request of requests) {
          const formattedRequest: any = {
            sr_no: i,
            request_id: request.request_id,
            request_state: request.request_state,
            confirmationNo: request.confirmation_no,
            requestor: request.requested_by,
            requested_date: request.requested_date.toISOString().split("T")[0],
            patient_data: {
              user_id: request.Patient.user_id,
              name: request.Patient.firstname + " " + request.Patient.lastname,
              DOB: request.Patient.dob.toISOString().split("T")[0],
              mobile_no: request.Patient.mobile_no,
              address:
                request.Patient.address_1 + " " + request.Patient.address_2,
            },
            requestor_data: {
              user_id: request.Requestor?.user_id || null,
              first_name:
                request.Requestor?.first_name ||
                null + " " + request.Requestor?.last_name ||
                null,
              last_name: request.Requestor?.last_name || null,
            },
            notes: request.Notes?.map((note) => ({
              note_id: note.note_id,
              type_of_note: note.type_of_note,
              description: note.description,
            })),
          };
          i++;
          formattedResponse.data.push(formattedRequest);
        }

        return res.status(200).json({
          ...formattedResponse,
          totalPages: Math.ceil(count / limit),
          currentPage: pageNumber,
          total_count: count,
        });
      }
      case "pending":
      case "active": {
        const formattedResponse: any = {
          status: true,
          data: [],
        };
        const requests = await RequestModel.findAndCountAll({
          where: {
            cancellation_status: "no",
            block_status: "no",
            request_state: state,
            ...(requestor ? { requested_by: requestor } : {}),
          },
          attributes: [
            "request_id",
            "request_state",
            "confirmation_no",
            "requested_by",
            "requested_date",
            "date_of_service",
            "physician_id",
            "patient_id",
          ],
          include: [
            {
              as: "Patient",
              model: User,
              attributes: [
                "user_id",
                "type_of_user",
                "firstname",
                "lastname",
                "dob",
                "mobile_no",
                "address_1",
                "state",
              ],
              where: whereClause_patient,
            },
            {
              as: "Physician",
              model: User,
              attributes: [
                "user_id",
                "type_of_user",
                "firstname",
                "lastname",
                "dob",
                "mobile_no",
                "address_1",
                "address_2",
              ],
              where: {
                type_of_user: "provider",
                role: "physician",
              },
            },
            {
              model: Requestor,
              attributes: ["user_id", "first_name", "last_name"],
            },
            {
              model: Notes,
              attributes: ["noteId", "typeOfNote", "description"],
            },
          ],
          limit,
          offset,
        });

        var i = offset + 1;
        for (const request of requests.rows) {
          const formattedRequest: any = {
            sr_no: i,
            request_id: request.request_id,
            request_state: request.request_state,
            confirmationNo: request.confirmation_no,
            requestor: request.requested_by,
            requested_date: request.requested_date.toISOString().split("T")[0],
            date_of_service: request.date_of_service
              .toISOString()
              .split("T")[0],
            patient_data: {
              user_id: request.Patient.user_id,
              name: request.Patient.firstname + " " + request.Patient.lastname,
              DOB: request.Patient.dob.toISOString().split("T")[0],
              mobile_no: request.Patient.mobile_no,
              address:
                request.Patient.address_1 + " " + request.Patient.address_2,
            },
            physician_data: {
              user_id: request.Physician.user_id,
              name:
                request.Physician.firstname + " " + request.Physician.lastname,
              DOB: request.Physician.dob.toISOString().split("T")[0],
              mobile_no: request.Physician.mobile_no,
              address:
                request.Physician.address_1 + " " + request.Physician.address_2,
            },
            requestor_data: {
              user_id: request.Requestor?.user_id || null,
              first_name:
                request.Requestor?.first_name ||
                null + " " + request.Requestor?.last_name ||
                null,
              last_name: request.Requestor?.last_name || null,
            },
            notes: request.Notes?.map((note) => ({
              note_id: note.note_id,
              type_of_note: note.type_of_note,
              description: note.description,
            })),
          };
          i++;
          formattedResponse.data.push(formattedRequest);
        }

        return res.status(200).json({
          ...formattedResponse,
          totalPages: Math.ceil(requests.count / limit),
          currentPage: pageNumber,
          total_count: requests.count,
        });
      }
      case "conclude": {
        const formattedResponse: any = {
          status: true,
          data: [],
        };
        const requests = await RequestModel.findAndCountAll({
          where: {
            cancellation_status: "no",
            block_status: "no",
            request_state: state,
            ...(requestor ? { requested_by: requestor } : {}),
          },
          attributes: [
            "request_id",
            "request_state",
            "confirmation_no",
            "requested_by",
            "requested_date",
            "date_of_service",
            "physician_id",
            "patient_id",
          ],
          include: [
            {
              as: "Patient",
              model: User,
              attributes: [
                "user_id",
                "type_of_user",
                "firstname",
                "lastname",
                "dob",
                "mobile_no",
                "address_1",
                "state",
              ],
              where: whereClause_patient,
            },
            {
              as: "Physician",
              model: User,
              attributes: [
                "user_id",
                "type_of_user",
                "firstname",
                "lastname",
                "dob",
                "mobile_no",
                "address_1",
                "address_2",
              ],
              where: {
                type_of_user: "provider",
                role: "physician",
              },
            },
          ],
          limit,
          offset,
        });

        var i = offset + 1;
        for (const request of requests.rows) {
          const formattedRequest: any = {
            sr_no: i,
            request_id: request.request_id,
            request_state: request.request_state,
            confirmationNo: request.confirmation_no,
            requestor: request.requested_by,
            requested_date: request.requested_date.toISOString().split("T")[0],
            date_of_service: request.date_of_service
              .toISOString()
              .split("T")[0],
            patient_data: {
              user_id: request.Patient.user_id,
              name: request.Patient.firstname + " " + request.Patient.lastname,
              DOB: request.Patient.dob.toISOString().split("T")[0],
              mobile_no: request.Patient.mobile_no,
              address:
                request.Patient.address_1 + " " + request.Patient.address_2,
            },
            physician_data: {
              user_id: request.Physician.user_id,
              name:
                request.Physician.firstname + " " + request.Physician.lastname,
              DOB: request.Physician.dob.toISOString().split("T")[0],
              mobile_no: request.Physician.mobile_no,
              address:
                request.Physician.address_1 + " " + request.Physician.address_2,
            },
          };
          i++;
          formattedResponse.data.push(formattedRequest);
        }

        return res.status(200).json({
          ...formattedResponse,
          totalPages: Math.ceil(requests.count / limit),
          currentPage: pageNumber,
          total_count: requests.count,
        });
      }
      case "toclose": {
        const formattedResponse: any = {
          status: true,
          data: [],
        };
        const requests = await RequestModel.findAndCountAll({
          where: {
            cancellation_status: "no",
            block_status: "no",
            request_state: state,
            ...(requestor ? { requested_by: requestor } : {}),
          },
          attributes: [
            "request_id",
            "request_state",
            "confirmation_no",
            "requested_by",
            "requested_date",
            "date_of_service",
            "physician_id",
            "patient_id",
          ],
          include: [
            {
              as: "Patient",
              model: User,
              attributes: [
                "user_id",
                "type_of_user",
                "firstname",
                "lastname",
                "dob",
                "address_1",
                "state",
              ],
              where: whereClause_patient,
            },
            {
              as: "Physician",
              model: User,
              attributes: [
                "user_id",
                "type_of_user",
                "firstname",
                "lastname",
                "dob",
                "mobile_no",
                "address_1",
                "address_2",
              ],
              where: {
                type_of_user: "provider",
                role: "physician",
              },
            },
            {
              model: Notes,
              attributes: ["noteId", "typeOfNote", "description"],
            },
          ],
          limit,
          offset,
        });

        var i = offset + 1;
        for (const request of requests.rows) {
          const formattedRequest: any = {
            sr_no: i,
            request_id: request.request_id,
            request_state: request.request_state,
            confirmationNo: request.confirmation_no,
            requestor: request.requested_by,
            requested_date: request.requested_date.toISOString().split("T")[0],
            date_of_service: request.date_of_service
              .toISOString()
              .split("T")[0],
            patient_data: {
              user_id: request.Patient.user_id,
              name: request.Patient.firstname + " " + request.Patient.lastname,
              DOB: request.Patient.dob.toISOString().split("T")[0],
              address:
                request.Patient.address_1 + " " + request.Patient.address_2,
              region: request.Patient.state,
            },
            physician_data: {
              user_id: request.Physician.user_id,
              name:
                request.Physician.firstname + " " + request.Physician.lastname,
              DOB: request.Physician.dob.toISOString().split("T")[0],
              mobile_no: request.Physician.mobile_no,
              address:
                request.Physician.address_1 + " " + request.Physician.address_2,
            },
            notes: request.Notes?.map((note) => ({
              note_id: note.note_id,
              type_of_note: note.type_of_note,
              description: note.description,
            })),
          };
          i++;
          formattedResponse.data.push(formattedRequest);
        }

        return res.status(200).json({
          ...formattedResponse,
          totalPages: Math.ceil(requests.count / limit),
          currentPage: pageNumber,
          total_count: requests.count,
        });
      }
      case "unpaid": {
        const formattedResponse: any = {
          status: true,
          data: [],
        };
        const requests = await RequestModel.findAndCountAll({
          where: {
            cancellation_status: "no",
            block_status: "no",
            request_state: state,
            ...(requestor ? { requested_by: requestor } : {}),
          },
          attributes: [
            "request_id",
            "request_state",
            "confirmation_no",
            "requested_date",
            "requested_by",
            "date_of_service",
            "physician_id",
            "patient_id",
          ],
          include: [
            {
              as: "Patient",
              model: User,
              attributes: [
                "user_id",
                "type_of_user",
                "firstname",
                "lastname",
                "mobile_no",
                "address_1",
                "address_2",
              ],
              where: whereClause_patient,
            },
            {
              as: "Physician",
              model: User,
              attributes: [
                "user_id",
                "type_of_user",
                "dob",
                "firstname",
                "lastname",
              ],
              where: {
                type_of_user: "provider",
                role: "physician",
              },
            },
          ],
          limit,
          offset,
        });

        var i = offset + 1;
        for (const request of requests.rows) {
          const formattedRequest: any = {
            sr_no: i,
            request_id: request.request_id,
            request_state: request.request_state,
            requestor: request.requested_by,
            confirmationNo: request.confirmation_no,
            requested_date: request.requested_date.toISOString().split("T")[0],
            date_of_service: request.date_of_service
              .toISOString()
              .split("T")[0],
            patient_data: {
              user_id: request.Patient.user_id,
              name: request.Patient.firstname + " " + request.Patient.lastname,
              mobile_no: request.Patient.mobile_no,
              address:
                request.Patient.address_1 + " " + request.Patient.address_2,
            },
            physician_data: {
              user_id: request.Physician.user_id,
              name:
                request.Physician.firstname + " " + request.Physician.lastname,
              DOB: request.Physician.dob.toISOString().split("T")[0],
            },
          };
          i++;
          formattedResponse.data.push(formattedRequest);
        }

        return res.status(200).json({
          status: true,
          ...formattedResponse,
          totalPages: Math.ceil(requests.count / limit),
          currentPage: pageNumber,
          total_count: requests.count,
        });
        // return res.status(200).json({
        //   formattedResponse,
        // });
      }
      default: {
        res.status(500).json({ message: "Invalid State !!!" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @function manage_requests_by_State
 * @param req - Express request object.
 * @param res - Express response object used to send the response.
 * @param next - Express next function to pass control to the next middleware.
 * @returns - Returns a Promise that resolves to an Express response object.
 * @throws - Throws an error if there's an issue in the execution of the function.
 * @description This function handles various actions related to requests based on their state.
 */
export const manage_requests_by_State: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { state, firstname, lastname, region, requestor, page, pageSize } =
      req.query as {
        state: string;
        firstname: string;
        lastname: string;
        region: string;
        requestor: string;
        page: string;
        pageSize: string;
      };
    const pageNumber = parseInt(page) || 1;
    const limit = parseInt(pageSize) || 10;
    const offset = (pageNumber - 1) * limit;

    const whereClausePatient = {
      type_of_user: "patient",
      ...(firstname && { firstname: { [Op.like]: `%${firstname}%` } }),
      ...(lastname && { lastname: { [Op.like]: `%${lastname}%` } }),
      ...(region && { state: region }),
    };

    const handleRequestState = async (additionalAttributes?: any) => {
      const formattedResponse: any = {
        status: true,
        data: [],
      };
      const { count, rows: requests } = await RequestModel.findAndCountAll({
        where: {
          cancellation_status: "no",
          block_status: "no",
          request_state: state,
          ...(requestor ? { requested_by: requestor } : {}),
        },
        attributes: [
          "request_id",
          "request_state",
          "confirmation_no",
          "requested_by",
          "requested_date",
          "date_of_service",
          "physician_id",
          "patient_id",
          ...(additionalAttributes || []),
        ],
        include: [
          {
            as: "Patient",
            model: User,
            attributes: [
              "user_id",
              "type_of_user",
              "firstname",
              "lastname",
              "dob",
              "mobile_no",
              "address_1",
              "state",
            ],
            where: whereClausePatient,
          },
          ...(state !== "new"
            ? [
                {
                  as: "Physician",
                  model: User,
                  attributes: [
                    "user_id",
                    "type_of_user",
                    "firstname",
                    "lastname",
                    "dob",
                    "mobile_no",
                    "address_1",
                    "address_2",
                  ],
                  where: {
                    type_of_user: "provider",
                    role: "physician",
                  },
                },
              ]
            : []),
          {
            model: Requestor,
            attributes: ["user_id", "first_name", "last_name"],
          },
          {
            model: Notes,
            attributes: ["note_id", "type_of_note", "description"],
          },
        ],
        limit,
        offset,
      });

      var i = offset + 1;
      for (const request of requests) {
        const formattedRequest: any = {
          sr_no: i,
          request_id: request.request_id,
          request_state: request.request_state,
          confirmationNo: request.confirmation_no,
          requestor: request.requested_by,
          requested_date: request.requested_date.toISOString().split("T")[0],
          ...(state !== "new"
            ? {
                date_of_service: request.date_of_service
                  .toISOString()
                  .split("T")[0],
              }
            : {}),
          patient_data: {
            user_id: request.Patient.user_id,
            name: request.Patient.firstname + " " + request.Patient.lastname,
            DOB: request.Patient.dob.toISOString().split("T")[0],
            mobile_no: request.Patient.mobile_no,
            address:
              request.Patient.address_1 + " " + request.Patient.address_2,
            ...(state === "toclose" ? { region: request.Patient.state } : {}),
          },
          ...(state !== "new"
            ? {
                physician_data: {
                  user_id: request.Physician.user_id,
                  name:
                    request.Physician.firstname +
                    " " +
                    request.Physician.lastname,
                  DOB: request.Physician.dob.toISOString().split("T")[0],
                  mobile_no: request.Physician.mobile_no,
                  address:
                    request.Physician.address_1 +
                    " " +
                    request.Physician.address_2,
                },
              }
            : {}),
          requestor_data: {
            user_id: request.Requestor?.user_id || null,
            first_name:
              request.Requestor?.first_name ||
              null + " " + request.Requestor?.last_name ||
              null,
            last_name: request.Requestor?.last_name || null,
          },
          notes: request.Notes?.map((note) => ({
            note_id: note.note_id,
            type_of_note: note.type_of_note,
            description: note.description,
          })),
        };
        i++;
        formattedResponse.data.push(formattedRequest);
      }

      return res.status(200).json({
        ...formattedResponse,
        totalPages: Math.ceil(count / limit),
        currentPage: pageNumber,
        total_count: count,
      });
    };

    switch (state) {
      case "new":
      case "pending":
      case "active":
      case "conclude":
      case "toclose":
      case "unpaid":
        return await handleRequestState(
          state === "unpaid"
            ? ["date_of_service", "physician_id", "patient_id"]
            : undefined
        );
      default:
        return res.status(500).json({ message: message_constants.IS });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: message_constants.ISE });
  }
};
//Below two API's are combined in above API
export const requests_by_request_state_counts: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const request_state = [
      "new",
      "pending",
      "active",
      "conclude",
      "toclose",
      "unpaid",
    ];
    const formattedResponse: any = {
      status: true,
      data: [],
    };
    for (const state of request_state) {
      const { count } = await RequestModel.findAndCountAll({
        where: {
          cancellation_status: "no",
          block_status: "no",
          request_state: state,
        },
      });
      console.log(count);
      const formattedRequest: any = {
        request_state: state,
        counts: count,
      };
      formattedResponse.data.push(formattedRequest);
    }

    return res.status(200).json({
      ...formattedResponse,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const requests_by_request_state_refactored: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { state, firstname, lastname, region, requestor, page, pageSize } =
      req.query as {
        state: string;
        firstname: string;
        lastname: string;
        region: string;
        requestor: string;
        page: string;
        pageSize: string;
      };
    const pageNumber = parseInt(page) || 1;
    const limit = parseInt(pageSize) || 10;
    const offset = (pageNumber - 1) * limit;

    const whereClause_patient = {
      type_of_user: "patient",
      ...(firstname && { firstname: { [Op.like]: `%${firstname}%` } }),
      ...(lastname && { lastname: { [Op.like]: `%${lastname}%` } }),
      ...(region && { state: region }),
    };

    const handleRequestState = async (additionalAttributes?: any) => {
      const formattedResponse: any = {
        status: true,
        data: [],
      };
      const { count, rows: requests } = await RequestModel.findAndCountAll({
        where: {
          cancellation_status: "no",
          block_status: "no",
          request_state: state,
          ...(requestor ? { requested_by: requestor } : {}),
        },
        attributes: [
          "request_id",
          "request_state",
          "confirmation_no",
          "requested_by",
          "requested_date",
          "date_of_service",
          "physician_id",
          "patient_id",
          ...(additionalAttributes || []),
        ],
        include: [
          {
            as: "Patient",
            model: User,
            attributes: [
              "user_id",
              "type_of_user",
              "firstname",
              "lastname",
              "dob",
              "mobile_no",
              "address_1",
              "state",
            ],
            where: whereClause_patient,
          },
          ...(state !== "new"
            ? [
                {
                  as: "Physician",
                  model: User,
                  attributes: [
                    "user_id",
                    "type_of_user",
                    "firstname",
                    "lastname",
                    "dob",
                    "mobile_no",
                    "address_1",
                    "address_2",
                  ],
                  where: {
                    type_of_user: "provider",
                    role: "physician",
                  },
                },
              ]
            : []),
          {
            model: Requestor,
            attributes: ["user_id", "first_name", "last_name"],
          },
          {
            model: Notes,
            attributes: ["note_id", "type_of_note", "description"],
          },
        ],
        limit,
        offset,
      });

      var i = offset + 1;
      for (const request of requests) {
        const formattedRequest: any = {
          sr_no: i,
          request_id: request.request_id,
          request_state: request.request_state,
          confirmationNo: request.confirmation_no,
          requestor: request.requested_by,
          requested_date: request.requested_date.toISOString().split("T")[0],
          ...(state !== "new"
            ? {
                date_of_service: request.date_of_service
                  .toISOString()
                  .split("T")[0],
              }
            : {}),
          patient_data: {
            user_id: request.Patient.user_id,
            name: request.Patient.firstname + " " + request.Patient.lastname,
            DOB: request.Patient.dob.toISOString().split("T")[0],
            mobile_no: request.Patient.mobile_no,
            address:
              request.Patient.address_1 + " " + request.Patient.address_2,
            ...(state === "toclose" ? { region: request.Patient.state } : {}),
          },
          ...(state !== "new"
            ? {
                physician_data: {
                  user_id: request.Physician.user_id,
                  name:
                    request.Physician.firstname +
                    " " +
                    request.Physician.lastname,
                  DOB: request.Physician.dob.toISOString().split("T")[0],
                  mobile_no: request.Physician.mobile_no,
                  address:
                    request.Physician.address_1 +
                    " " +
                    request.Physician.address_2,
                },
              }
            : {}),
          requestor_data: {
            user_id: request.Requestor?.user_id || null,
            first_name:
              request.Requestor?.first_name ||
              null + " " + request.Requestor?.last_name ||
              null,
            last_name: request.Requestor?.last_name || null,
          },
          notes: request.Notes?.map((note) => ({
            note_id: note.note_id,
            type_of_note: note.type_of_note,
            description: note.description,
          })),
        };
        i++;
        formattedResponse.data.push(formattedRequest);
      }

      return res.status(200).json({
        ...formattedResponse,
        totalPages: Math.ceil(count / limit),
        currentPage: pageNumber,
        total_count: count,
      });
    };

    switch (state) {
      case "new":
        return await handleRequestState();
      case "pending":
      case "active":
      case "conclude":
        return await handleRequestState();
      case "toclose":
        return await handleRequestState();
      case "unpaid":
        return await handleRequestState([
          "date_of_service",
          "physician_id",
          "patient_id",
        ]);
      default:
        return res.status(500).json({ message: "Invalid State !!!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

/**Admin Request Actions */

/**
 * @description Given below functions are Express controllers that allows viewing request by confirmation number.
 */
export const view_case_for_request: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const formattedResponse: any = {
      status: true,
      data: [],
    };
    const request = await RequestModel.findOne({
      where: {
        confirmation_no: confirmation_no,
        block_status: "no",
        cancellation_status: "no",
      },
      attributes: ["request_id", "request_state", "confirmation_no"],
      include: [
        {
          as: "Patient",
          model: User,
          attributes: [
            "firstname",
            "lastname",
            "dob",
            "mobile_no",
            "email",
            "state",
            "business_id",
            "address_1",
          ],
          where: {
            type_of_user: "patient",
          },
        },
        {
          model: Notes,
          attributes: ["request_id", "note_id", "description", "type_of_note"],
          where: {
            type_of_note: "patient_notes",
          },
        },
      ],
    });
    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }
    const business_data = await Business.findOne({
      where: {
        business_id: request.Patient.business_id,
      },
    });
    if (!business_data) {
      return res.status(404).json({
        message: message_constants.BNF,
      });
    }
    const formattedRequest: any = {
      request_id: request.request_id,
      request_state: request.request_state,
      confirmation_no: request.confirmation_no,
      // requested_date: request.requested_date.toISOString().split("T")[0],
      patient_data: {
        user_id: request.Patient.user_id,
        patient_notes: request.Notes?.map((note) => ({
          note_id: note.note_id,
          type_of_note: note.type_of_note,
          description: note.description,
        })),
        first_name: request.Patient.firstname,
        last_name: request.Patient.lastname,
        // DOB: request.Patient.dob
        //   .toISOString()
        //   .split("T")[0]
        //   .split("-")
        //   .map(Number)
        //   .reverse()
        //   .join("-"),
        DOB: request.Patient.dob.toISOString().split("T")[0],
        mobile_no: request.Patient.mobile_no,
        email: request.Patient.email,
        location_information: {
          region: request.Patient.state,
          business_name: business_data?.business_name,
          room: request.Patient.address_1 + " " + request.Patient.address_2,
        },
      },
    };
    formattedResponse.data.push(formattedRequest);

    return res.status(200).json({
      ...formattedResponse,
    });
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};

/**
 * @description Given below functions are Express controllers that allows viewing and saving notes for a request identified by the confirmation number.
 */
export const view_notes_for_request: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const formattedResponse: any = {
      status: true,
      data: [],
    };
    const request = await RequestModel.findOne({
      where: {
        confirmation_no: confirmation_no,
        block_status: "no",
        cancellation_status: "no",
      },
    });
    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }
    const transfer_notes_list = await Notes.findAll({
      where: {
        request_id: request.request_id,
        type_of_note: "transfer_notes",
      },
      attributes: ["request_id", "note_id", "description", "type_of_note"],
    });
    const physician_notes_list = await Notes.findAll({
      where: {
        request_id: request.request_id,
        type_of_note: "physician_notes",
      },
      attributes: ["request_id", "note_id", "description", "type_of_note"],
    });
    const admin_notes_list = await Notes.findAll({
      where: {
        request_id: request.request_id,
        type_of_note: "admin_notes",
      },
      attributes: ["request_id", "note_id", "description", "type_of_note"],
    });
    const formattedRequest: any = {
      confirmation_no: confirmation_no,
      transfer_notes: {
        notes: transfer_notes_list?.map((note) => ({
          note_id: note.note_id,
          type_of_note: note.type_of_note,
          description: note.description,
        })),
      },
      physician_notes: {
        notes: physician_notes_list?.map((note) => ({
          note_id: note.note_id,
          type_of_note: note.type_of_note,
          description: note.description,
        })),
      },
      admin_notes: {
        notes: admin_notes_list?.map((note) => ({
          note_id: note.note_id,
          type_of_note: note.type_of_note,
          description: note.description,
        })),
      },
    };

    formattedResponse.data.push(formattedRequest);
    return res.status(200).json({
      ...formattedResponse,
    });
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};
export const save_view_notes_for_request: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const { new_note } = req.body;
    var status;
    const request = await RequestModel.findOne({
      where: {
        confirmation_no: confirmation_no,
        block_status: "no",
        cancellation_status: "no",
      },
    });
    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }
    const notes_status = await Notes.findOne({
      where: {
        request_id: request.request_id,
        type_of_note: "admin_notes",
      },
    });
    if (notes_status) {
      status = await Notes.update(
        {
          description: new_note,
        },
        {
          where: {
            request_id: request.request_id,
            type_of_note: "admin_notes",
          },
        }
      );
    } else {
      status = await Notes.create({
        request_id: request.request_id,
        type_of_note: "admin_notes",
        description: new_note,
      });
    }
    return res.status(200).json({
      status: true,
      confirmation_no: confirmation_no,
      message: "Successfull !!!",
    });
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};

/**
 * @description Given below are Express controllers that allows canceling a case for a request identified by the confirmation number.
 */
export const cancel_case_for_request_view_data: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const formattedResponse: any = {
      status: true,
      data: [],
    };
    const request = await RequestModel.findOne({
      where: {
        confirmation_no: confirmation_no,
        request_state: "new",
        block_status: "no",
        cancellation_status: "no",
      },

      include: [
        {
          as: "Patient",
          model: User,
          attributes: ["firstname", "lastname"],
          where: {
            type_of_user: "patient",
          },
        },
      ],
    });
    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }

    const formattedRequest: any = {
      confirmation_no: request.confirmation_no,
      patient_data: {
        first_name: request.Patient.firstname,
        last_name: request.Patient.lastname,
      },
    };

    formattedResponse.data.push(formattedRequest);
    return res.status(200).json({
      ...formattedResponse,
    });
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};
export const cancel_case_for_request: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const { reason, additional_notes } = req.body;
    const request = await RequestModel.findOne({
      where: {
        confirmation_no: confirmation_no,
        request_state: "new",
        block_status: "no",
        cancellation_status: "no",
      },
    });
    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }
    await RequestModel.update(
      {
        cancellation_status: "yes",
      },
      {
        where: {
          request_id: request.request_id,
          confirmation_no: confirmation_no,
        },
      }
    );
    const notes_status = await Notes.findOne({
      where: {
        request_id: request.request_id,
        type_of_note: "admin_cancellation_notes",
      },
    });
    if (notes_status) {
      Notes.update(
        {
          description: additional_notes,
          reason: reason,
        },
        {
          where: {
            request_id: request.request_id,
            type_of_note: "admin_cancellation_notes",
          },
        }
      );
    } else {
      Notes.create({
        request_id: request.request_id,
        type_of_note: "admin_cancellation_notes",
        description: additional_notes,
        reason: reason,
      });
    }

    return res.status(200).json({
      status: true,
      confirmation_no: confirmation_no,
      message: message_constants.Success,
    });
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};

/**
 * @description Given below functions are Express controllers that allows viewing and assigning requests to a physician.
 */
export const assign_request_region_physician: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const { region } = req.query as { region: string };
    var i = 1;
    const formattedResponse: any = {
      status: true,
      message: "Successfull !!!",
      confirmation_no: confirmation_no,
      data: [],
    };
    const physicians = await User.findAll({
      attributes: ["state", "role", "firstname", "lastname"],
      where: {
        type_of_user: "provider",
        role: "physician",
        ...(region ? { state: region } : {}),
        scheduled_status: "no",
      },
    });
    if (!physicians) {
      return res.status(200).json({
        status: false,
        message: message_constants.PhNF,
      });
    }
    for (const physician of physicians) {
      const formattedRequest: any = {
        sr_no: i,
        confirmation_no: confirmation_no,
        firstname: physician.firstname,
        lastname: physician.lastname,
      };
      i++;
      formattedResponse.data.push(formattedRequest);
    }
    return res.status(200).json({
      ...formattedResponse,
    });
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};
export const assign_request: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const { firstname, lastname, assign_req_description } = req.body;
    const provider = await User.findOne({
      where: {
        firstname,
        lastname,
        type_of_user: "provider",
        role: "physician",
        scheduled_status: "no",
      },
    });
    if (!provider) {
      return res.status(404).json({ error: message_constants.PrNF });
    }
    const physician_id = provider.user_id;
    await RequestModel.update(
      {
        physician_id: physician_id,
        assign_req_description,
      },
      {
        where: {
          confirmation_no: confirmation_no,
        },
      }
    );
    await User.update(
      {
        scheduled_status: "yes",
      },
      {
        where: {
          user_id: physician_id,
        },
      }
    );
    return res.status(200).json({
      status: true,
      confirmation_no: confirmation_no,
      message: message_constants.Success,
    });
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};

/**
 * @description Given below are Express controllers that allows blocking a case for a request identified by the confirmation number and viewing the corresponding patient data.
 */
export const block_case_for_request_view: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const formattedResponse: any = {
      status: true,
      confirmation_no: confirmation_no,
      data: [],
    };
    const request = await RequestModel.findOne({
      where: {
        confirmation_no: confirmation_no,
        request_state: "new",
        block_status: "no",
        cancellation_status: "no",
      },
      include: [
        {
          as: "Patient",
          model: User,
          attributes: ["firstname", "lastname"],
          where: {
            type_of_user: "patient",
          },
        },
      ],
    });
    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }

    const formattedRequest: any = {
      confirmation_no: confirmation_no,
      patient_data: {
        user_id: request.Patient.user_id,
        firstname: request.Patient.firstname,
        lastname: request.Patient.lastname,
      },
    };
    formattedResponse.data.push(formattedRequest);

    return res.status(200).json({
      ...formattedResponse,
    });
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};
export const block_case_for_request_post: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const { reason_for_block } = req.body;

    const request = await RequestModel.findOne({
      where: {
        confirmation_no: confirmation_no,
        request_state: "new",
        block_status: "no",
        cancellation_status: "no",
      },
    });
    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }
    await RequestModel.update(
      {
        block_status: "yes",
        block_status_reason: reason_for_block,
      },
      {
        where: {
          confirmation_no: confirmation_no,
          request_state: "new",
        },
      }
    );
    return res.status(200).json({
      status: true,
      confirmation_no: confirmation_no,
      message: message_constants.Success,
    });
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};

/**
 * @description These functions handles various actions related to uploads for a request.
 */
export const view_uploads_view_data: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const formattedResponse: any = {
      status: true,
      data: [],
    };
    const request = await RequestModel.findOne({
      where: {
        confirmation_no: confirmation_no,
        block_status: "no",
        cancellation_status: "no",
      },

      include: [
        {
          as: "Patient",
          model: User,
          attributes: ["firstname", "lastname"],
          where: {
            type_of_user: "patient",
          },
        },
        {
          model: Documents,
          attributes: [
            "request_id",
            "document_id",
            "document_path",
            "createdAt",
          ],
        },
      ],
    });
    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }

    const formattedRequest: any = {
      request_id: request.request_id,
      request_state: request.request_state,
      confirmationNo: request.confirmation_no,
      patientData: {
        user_id: request.Patient.user_id,
        name: request.Patient.firstname + " " + request.Patient.lastname,
      },
      documents: request.Documents?.map((document) => ({
        document_id: document.document_id,
        document_path: document.document_path,
        createdAt: document.createdAt.toISOString().split("T")[0],
      })),
    };
    formattedResponse.data.push(formattedRequest);
    return res.status(200).json({
      ...formattedResponse,
    });
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};
export const view_uploads_upload: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    console.log("Uploaded file details:", req.file);
    const file = req.file;
    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
        block_status: "no",
        cancellation_status: "no",
      },
    });

    if (!request) {
      return res.status(404).json({ error: message_constants.ISE });
    }

    const newDocument = await Documents.create({
      request_id: request.request_id,
      document_path: file.path,
    });
    if (!newDocument) {
      return res.status(404).json({ error: message_constants.FTU });
    }
    return res.status(200).json({
      status: true,
      confirmation_no: confirmation_no,
      message: message_constants.UpS,
    });
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};
export const view_uploads_actions_delete: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no, document_id } = req.params;
    // const fileURL = file.path;
    const request = await RequestModel.findOne({
      where: {
        confirmation_no: confirmation_no,
        block_status: "no",
        cancellation_status: "no",
      },
      include: [
        {
          model: Documents,
          attributes: [
            "request_id",
            "document_id",
            "document_path",
            "createdAt",
          ],
        },
      ],
    });
    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }
    const delete_status = await Documents.destroy({
      where: {
        request_id: request.request_id,
        document_id,
      },
    });
    if (!delete_status) {
      return res.status(404).json({ error: message_constants.EWD });
    }
    return res.status(200).json({
      status: true,
      confirmation_no,
      message: message_constants.Success,
    });
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};
export const view_uploads_actions_download: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no, document_id } = req.params;

    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
        block_status: "no",
        cancellation_status: "no",
      },
      include: [
        {
          model: Documents,
          attributes: ["request_id", "document_id", "document_path"],
        },
      ],
    });

    const document = await Documents.findOne({
      where: {
        document_id: document_id,
      },
      attributes: ["document_id", "document_path"],
    });
    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }

    if (!document) {
      return res.status(404).json({ error: message_constants.DNF });
    }

    let filePath = document.document_path;

    if (!path.isAbsolute(filePath)) {
      filePath = path.join(__dirname, "uploads", filePath);
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: message_constants.FNF });
    }

    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${document.document_path}"}`
    );

    res.download(filePath, (error) => {
      if (error) {
        res.status(500).json({ error: message_constants.ISE });
      } else {
        return res.status(200).json({
          status: true,
          confirmation_no: confirmation_no,
          message: message_constants.Success,
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};
export const view_uploads_delete_all: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
        block_status: "no",
        cancellation_status: "no",
      },
    });

    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }

    const deletedCount = await Documents.destroy({
      where: {
        request_id: request.request_id,
      },
    });

    if (deletedCount === 0) {
      return res.status(200).json({ message: message_constants.NDF });
    }

    return res.status(200).json({
      status: true,
      confirmation_no: confirmation_no,
      message: `Successfully deleted ${deletedCount} document(s)`,
    });
  } catch (error) {
    console.error("Error deleting documents:", error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};
export const view_uploads_download_all: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
        block_status: "no",
        cancellation_status: "no",
      },
      include: [
        {
          as: "Documents",
          model: Documents,
          attributes: ["document_id", "document_path"],
        },
      ],
    });

    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }

    const documents = request.Documents;

    if (documents.length === 0) {
      return res.status(200).json({ message: message_constants.NDF });
    }

    const validPaths = documents.filter((file) =>
      fs.existsSync(file.document_path)
    );

    if (validPaths.length === 0) {
      return res.status(404).json({ error: message_constants.NVFD });
    }

    for (const file of validPaths) {
      const filePath = file.document_path;
      const filename = path.basename(filePath);

      res.setHeader("Content-Type", "application/octet-stream");
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
      res.download(filePath, (error) => {
        if (error) {
          console.error("Error sending file:", error);
          // Handle errors appropriately (e.g., log the error, send an error response)
        }
      });
    }

    res.status(200).json({
      confirmation_no: confirmation_no,
      message: `Successfully initiated download(s) for ${validPaths.length} document(s)`,
    });
  } catch (error) {
    return res.status(500).json({ error: message_constants.ISE });
  }
};
// Send Mail and Download All remaining in View Uploads

/**
 * @description These functions handles viewing and sending orders for a request.
 */
export const business_name_for_send_orders: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const profession = req.query as { profession: string };
    const whereClause = {
      type_of_user: "vendor",
      // profession: profession
      // ...(profession && { profession: profession }),
    };
    const businesses = await User.findAll({
      attributes: ["business_name"],
      where: whereClause,
    });
    if (!businesses) {
      res.status(500).json({ error: message_constants.EFBD });
    }
    return res
      .status(200)
      .json({ status: message_constants.Success, businesses: businesses });
  } catch (error) {
    return res.status(500).json({ error: message_constants.ISE });
  }
};
export const view_send_orders_for_request: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { profession, business } = req.query as {
      profession: string;
      business: string;
    };
    const formattedResponse: any = {
      status: true,
      data: [],
    };
    const vendor = await User.findOne({
      attributes: ["business_contact", "business_id", "email", "fax_number"],
      where: {
        type_of_user: "vendor",
        profession: profession,
      },
    });
    if (!vendor) {
      return res.status(404).json({ error: message_constants.VNF });
    }
    const business_data = await Business.findOne({
      where: {
        business_id: vendor?.business_id,
      },
    });
    const formattedRequest: any = {
      business_contact: business_data?.business_contact,
      email: vendor?.email,
      fax_number: vendor?.fax_number,
    };
    formattedResponse.data.push(formattedRequest);
    return res.status(200).json({
      ...formattedResponse,
    });
  } catch (error) {
    return res.status(500).json({ error: message_constants.ISE });
  }
};
export const send_orders_for_request: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no, state } = req.params;
    const { email } = req.query as {
      business_contact: string;
      email: string;
    };
    const { order_details, number_of_refill } = req.body;
    if (state == "active" || "conclude" || "toclose") {
      const request = await RequestModel.findOne({
        where: {
          confirmation_no: confirmation_no,
          request_state: state,
          block_status: "no",
          cancellation_status: "no",
        },
      });
      if (!request) {
        return res.status(404).json({ error: message_constants.RNF });
      }
      const vendor = await User.findOne({
        where: {
          email,
        },
      });
      if (!vendor) {
        return res.status(404).json({ error: message_constants.VNF });
      }
      await Order.create({
        request_id: request.request_id,
        user_id: vendor.user_id,
        request_state: state,
        order_details,
        number_of_refill,
      });
      return res.status(200).json({
        status: true,
        confirmation_no: confirmation_no,
        message: message_constants.Success,
      });
    }
  } catch (error) {
    return res.status(500).json({ error: message_constants.ISE });
  }
};

/**
 * @description Given below functions are Express controllers that allows viewing and transfer request to a different physician.
 */
export const transfer_request_region_physicians: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const {confirmation_no} = req.params;
    const { region } = req.query as { region: string };
    var i = 1;
    const formattedResponse: any = {
      status: true,
      // confirmation_no: confirmation_no,
      data: [],
    };
    const physicians = await User.findAll({
      attributes: ["state", "role", "firstname", "lastname"],
      where: {
        type_of_user: "provider",
        role: "physician",
        ...(region ? { state: region } : {}),
        scheduled_status: "no",
      },
    });
    if (!physicians) {
      return res.status(200).json({
        status: false,
        message: message_constants.PhNF,
      });
    }
    for (const physician of physicians) {
      const formattedRequest: any = {
        sr_no: i,
        // firstname: physician.firstname,
        // lastname: physician.lastname,
        physician_name: physician.firstname + " " + physician.lastname,
      };
      i++;
      formattedResponse.data.push(formattedRequest);
    }
    return res.status(200).json({
      status: true,
      message: message_constants.Success,
      ...formattedResponse,
    });
  } catch (error) {
    return res.status(500).json({ error: message_constants.ISE });
  }
};
export const transfer_request: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const { firstname, lastname, description } = req.body;
    const provider = await User.findOne({
      where: {
        firstname,
        lastname,
        type_of_user: "provider",
        role: "physician",
      },
    });
    if (!provider) {
      return res.status(404).json({ error: message_constants.PrNF });
    }
    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
        block_status: "no",
        cancellation_status: "no",
        close_case_status: "no",
      },
    });
    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }
    // const physician_id = provider.user_id;
    await RequestModel.update(
      {
        // physician_id: physician_id,
        transfer_request_status: "pending",
      },
      {
        where: {
          confirmation_no: confirmation_no,
        },
      }
    );
    await Notes.create({
      request_id: request.request_id,
      physician_name: firstname + " " + lastname,
      description,
      type_of_note: "transfer_notes",
    });
    return res.status(200).json({
      status: true,
      confirmation_no: confirmation_no,
      message: "Successfull !!!",
    });
  } catch (error) {
    return res.status(500).json({ error: message_constants.ISE });
  }
};

/**
 * @description Given below functions are Express controllers that allows clearing case/request.
 */
export const clear_case_for_request: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    try {
      const request = await RequestModel.findOne({
        where: { confirmation_no },
        attributes: ["confirmation_no", "request_id"],
      });
      if (!request) {
        return res.status(404).json({ error: message_constants.RNF });
      }
      await Notes.destroy({
        where: {
          request_id: request.request_id,
        },
      });
      await Order.destroy({
        where: {
          request_id: request.request_id,
        },
      });
      await RequestModel.destroy({
        where: {
          confirmation_no: confirmation_no,
        },
      });
      await Documents.destroy({
        where: {
          request_id: request.request_id,
        },
      });
      return res.status(200).json({
        status: true,
        confirmation_no: confirmation_no,
        message: message_constants.Success,
      });
    } catch {
      res.status(404).json({ error: message_constants.IS });
    }
  } catch (error) {
    return res.status(500).json({ error: message_constants.ISE });
  }
};

/**
 * @description This function handles sending and updating agreements for a request.
 */
export const send_agreement: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const { mobile_no, email } = req.body;
    const user = await User.findOne({
      where: {
        email: email,
        mobile_no: mobile_no,
        type_of_user: "patient",
      },
      attributes: ["user_id", "email", "mobile_no"],
    });
    if (!user) {
      return res.status(400).json({
        message: message_constants.IEM,
        errormessage: message_constants.UA,
      });
    }
    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
        patient_id: user.user_id,
        block_status: "no",
        cancellation_status: "no",
        close_case_status: "no",
      },
      include: {
        as: "Patient",
        model: User,
        attributes: ["email", "mobile_no"],
        where: {
          type_of_user: "patient",
        },
      },
    });
    if (!request) {
      return res.status(400).json({
        message: message_constants.IS,
        errormessage: message_constants.UA,
      });
    }
    // const resetToken = uuid();
    const resetToken = crypto.createHash("sha256").update(email).digest("hex");

    const resetUrl = `http://localhost:7000/admin/dashboard/requests/${confirmation_no}/actions/updateagreement`;
    const mailContent = `
          <html>
          <form action = "${resetUrl}" method="POST"> 
          <p>Tell us that you accept the agreement or not:</p>
          <br>
          <br>
          <p>Your token is: </p>
          <p>${resetToken} </p>
          <br>
          <br>
          <label for="agreement_status">Agreement_Status:</label>
          <br>
          <select id="agreement_status" name= "agreement_status">
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          </select>
          <br>
          <br>
          <button type = "submit">Submit Response</button>
          </form>
          </html>
        `;

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      debug: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const info = await transporter.sendMail({
      from: "vohraatta@gmail.com",
      to: email,
      subject: "Agreement",
      html: mailContent,
    });
    if (!info) {
      res.status(500).json({
        message: message_constants.EWSA,
        errormessage: message_constants.OK,
      });
    }
    return res.status(200).json({
      confirmation_no: confirmation_no,
      message: message_constants.ASE,
      errormessage: message_constants.OK,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: message_constants.ESA,
      errormessage: message_constants.ISE,
    });
  }
};
export const update_agreement: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const { agreement_status } = req.body;
    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
      },
    });
    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }
    const update_status = await RequestModel.update(
      { agreement_status },
      {
        where: {
          confirmation_no,
        },
      }
    );
    if (!update_status) {
      res.status(200).json({
        status: true,
        message: message_constants.EWU,
      });
    }
    return res.status(200).json({
      status: true,
      confirmation_no: confirmation_no,
      message: message_constants.Success,
    });
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};

/**
 * @description These functions handles various actions related to closing a case for a request, including viewing details, editing patient data, and downloading documents.
 */
export const close_case_for_request: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const request = await RequestModel.findOne({
      where: {
        confirmation_no: confirmation_no,
        request_state: "toclose",
        close_case_status: "no",
        block_status: "no",
        cancellation_status: "no",
      },
      include: [
        {
          as: "Patient",
          model: User,
          attributes: ["firstname", "lastname", "dob", "mobile_no", "email"],
        },
      ],
    });
    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }
    await RequestModel.update(
      {
        close_case_status: "yes",
      },
      {
        where: {
          confirmation_no: confirmation_no,
          request_state: "toclose",
        },
      }
    );
    return res.status(200).json({
      status: true,
      confirmation_no: confirmation_no,
      message: message_constants.Success,
    });
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};
export const close_case_for_request_view_details: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const formattedResponse: any = {
      status: true,
      data: [],
    };
    const request = await RequestModel.findOne({
      where: {
        confirmation_no: confirmation_no,
        request_state: "toclose",
        close_case_status: "no",
        block_status: "no",
        cancellation_status: "no",
      },
      include: [
        {
          as: "Patient",
          model: User,
          attributes: [
            "user_id",
            "firstname",
            "lastname",
            "dob",
            "mobile_no",
            "email",
          ],
        },
        {
          model: Documents,
          attributes: [
            "request_id",
            "document_id",
            "document_path",
            "createdAt",
          ],
        },
      ],
      attributes: ["request_id", "confirmation_no"],
    });
    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }
    const formattedRequest: any = {
      request_id: request.request_id,
      confirmation_no: request.confirmation_no,
      patient_data: {
        user_id: request.Patient.user_id,
        first_name: request.Patient.firstname,
        last_name: request.Patient.lastname,
        DOB: request.Patient.dob.toISOString().split("T")[0],
        mobile_no: request.Patient.mobile_no,
        email: request.Patient.email,
        documents: request.Documents?.map((document) => ({
          document_id: document.document_id,
          document_path: document.document_path,
          upload_date: document.createdAt.toISOString().split("T")[0],
        })),
      },
    };
    formattedResponse.data.push(formattedRequest);

    return res.status(200).json({
      ...formattedResponse,
    });
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};
export const close_case_for_request_edit: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const { firstname, lastname, dob, mobile_no, email } = req.body;
    const request = await RequestModel.findOne({
      where: {
        confirmation_no: confirmation_no,
        request_state: "toclose",
        close_case_status: "no",
      },
    });
    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }
    const patient_data = await User.findOne({
      where: { user_id: request.patient_id },
    });
    if (!patient_data) {
      return res.status(404).json({ error: message_constants.PaNF });
    }
    await User.update(
      {
        firstname,
        lastname,
        dob,
        mobile_no,
        email,
      },
      {
        where: {
          user_id: request.patient_id,
          type_of_user: "patient",
        },
      }
    );
    return res.status(200).json({
      status: true,
      confirmation_no: confirmation_no,
      message: message_constants.Success,
    });
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};
export const close_case_for_request_actions_download: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no, document_id } = req.params;
    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
        request_state: "toclose",
        block_status: "no",
        cancellation_status: "no",
      },
      include: [
        {
          model: Documents,
          attributes: ["request_id", "document_id", "document_path"],
        },
      ],
    });

    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }

    const document = await Documents.findOne({
      where: {
        request_id: request.request_id,
        document_id: document_id,
      },
    });

    if (!document) {
      return res.status(404).json({ error: message_constants.DNF });
    }

    let filePath = document.document_path;

    if (!path.isAbsolute(filePath)) {
      filePath = path.join(__dirname, "uploads", filePath);
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: message_constants.FNF });
    }

    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${document.document_path}"}`
    );

    res.download(filePath, (error) => {
      if (error) {
        res.status(500).json({ error: message_constants.ISE });
      } else {
        return res.status(200).json({
          status: true,
          confirmation_no: confirmation_no,
          message: message_constants.DoS,
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};

/**Admin Request Support */
/**
 * @description Given below functions are Express controllers that allows request support.
 */
export const request_support: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { support_message } = req.body;
    await User.update(
      {
        support_message,
      },
      {
        where: {
          scheduled_status: "no",
          type_of_user: "provider",
          role: "physician",
        },
      }
    );
    return res.status(200).json({
      status: true,
      message: message_constants.Success,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: message_constants.ISE });
  }
};

/**Admin Send Link */
/**
 * @description Given below functions are Express controllers that allows sending link to create a request.
 */
export const admin_send_link: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstname, lastname, mobile_no, email } = req.body;
    const user = await User.findOne({
      where: {
        firstname,
        lastname,
        mobile_no,
        email,
        type_of_user: "patient",
      },
    });
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: message_constants.UNF });
    }

    const create_request_link = "https://localhost:3000/createRequest";

    if (email) {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: false,
        debug: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailContent = `
        <html>
        <p>Given below is a create request link for patient</p>
        </br>
        </br>
        </br>
        <p> ${create_request_link}</p>
        </form>
        </html>
      `;

      const info = await transporter.sendMail({
        from: "vohraatta@gmail.com",
        to: email,
        subject: "Create Request Link",
        html: mailContent,
      });

      console.log("Email sent: %s", info.messageId);
    }

    if (mobile_no) {
      const accountSid = "AC755f57f9b0f3440c6d2a207bd5678bdd";
      const authToken = "a795f37433f7542bea73622828e66841";
      const client = twilio(accountSid, authToken);

      client.messages
        .create({
          body: `Link for creating request for patient. Link :- ${create_request_link}`,
          from: "+15187597839",
          to: "+91" + mobile_no,
        })
        .then((message) => console.log(message.sid))
        .catch((error) => console.error(error));
    }

    return res.status(200).json({
      status: true,
      message: message_constants.CRLS,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: message_constants.ISE });
  }
};
