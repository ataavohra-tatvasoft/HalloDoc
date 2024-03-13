import { Request, Response, NextFunction } from "express";
import RequestModel from "../../db/models/request_2";
import User from "../../db/models/user_2";
import Requestor from "../../db/models/requestor_2";
import Notes from "../../db/models/notes_2";
import Order from "../../db/models/order_2";
import Region from "../../db/models/region_2";
import Profession from "../../db/models/profession_2";
import statusCodes from "../../public/status_codes";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import twilio from "twilio";
import * as crypto from "crypto";
import { Op } from "sequelize";
import Documents from "../../db/models/documents_2";
import dotenv from "dotenv";
import path, { dirname } from "path";
import fs from "fs";

/** Configs */
dotenv.config({ path: `.env` });

/**                              Admin in Dashboard                                       */
/**Admin SignUp */
export const admin_signup = async (
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
      message: statusCodes[500],
    });
  }
};

/**Admin Create Request */
export const admin_create_request = async (
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
      requestId: request_data.request_id,
      //  requested_by: "Admin",
      description: AdminNotes,
      typeOfNote: "admin_notes",
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
      message: statusCodes[500],
    });
  }
};

export const region_without_thirdparty_API = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const regions = await Region.findAll({
      attributes: ["region_name"],
    });
    if (!regions) {
      res.status(500).json({ error: "Error fetching region data" });
    }
    return res.status(200).json({
      status: "Successfull",
      regions: regions,
      confirmation_no: confirmation_no,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const region_with_thirdparty_API = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    var headers = new Headers();
    headers.append("X-CSCAPI-KEY", "API_KEY");

    // var requestOptions = {
    //   method: "GET",
    //   headers: headers,
    //   redirect: "follow",
    // };

    fetch("https://api.countrystatecity.in/v1/states", {
      method: "GET",
      headers: headers,
      redirect: "follow",
    })
      .then((response) => response.text())
      .then((result) => {
        const states = result;
        res.status(200).json({
          status: "Successful",
          confirmation_no: confirmation_no,
          data: states,
        });
      })
      .catch((error) => console.log("error", error));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const requests_by_request_state = async (
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
              note_id: note.noteId,
              type_of_note: note.typeOfNote,
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
              note_id: note.noteId,
              type_of_note: note.typeOfNote,
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
              note_id: note.noteId,
              type_of_note: note.typeOfNote,
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

/**Admin Request Actions */
export const view_case_for_request = async (
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
            "business_name",
            "address_1",
          ],
          where: {
            type_of_user: "patient",
          },
        },
        {
          model: Notes,
          attributes: ["requestId", "noteId", "description", "typeOfNote"],
          where: {
            typeOfNote: "patient_notes",
          },
        },
      ],
    });
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    const formattedRequest: any = {
      request_id: request.request_id,
      request_state: request.request_state,
      confirmation_no: request.confirmation_no,
      // requested_date: request.requested_date.toISOString().split("T")[0],
      patient_data: {
        user_id: request.Patient.user_id,
        patient_notes: request.Notes?.map((note) => ({
          note_id: note.noteId,
          type_of_note: note.typeOfNote,
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
        DOB: request.Patient.dob
        .toISOString()
        .split("T")[0],
        mobile_no: request.Patient.mobile_no,
        email: request.Patient.email,
        location_information: {
          region: request.Patient.state,
          business_name: request.Patient.business_name,
          room: request.Patient.address_1 + " " + request.Patient.address_2,
        },
      },
    };
    formattedResponse.data.push(formattedRequest);

    return res.status(200).json({
      ...formattedResponse,
    });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const view_notes_for_request = async (
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
      return res.status(404).json({ error: "Request not found" });
    }
    const transfer_notes_list = await Notes.findAll({
      where: {
        requestId: request.request_id,
        typeOfNote: "transfer_notes",
      },
      attributes: ["requestId", "noteId", "description", "typeOfNote"],
    });
    const physician_notes_list = await Notes.findAll({
      where: {
        requestId: request.request_id,
        typeOfNote: "physician_notes",
      },
      attributes: ["requestId", "noteId", "description", "typeOfNote"],
    });
    const admin_notes_list = await Notes.findAll({
      where: {
        requestId: request.request_id,
        typeOfNote: "admin_notes",
      },
      attributes: ["requestId", "noteId", "description", "typeOfNote"],
    });
    const formattedRequest: any = {
      confirmation_no: confirmation_no,
      transfer_notes: {
        notes: transfer_notes_list?.map((note) => ({
          note_id: note.noteId,
          type_of_note: note.typeOfNote,
          description: note.description,
        })),
      },
      physician_notes: {
        notes: physician_notes_list?.map((note) => ({
          note_id: note.noteId,
          type_of_note: note.typeOfNote,
          description: note.description,
        })),
      },
      admin_notes: {
        notes: admin_notes_list?.map((note) => ({
          note_id: note.noteId,
          type_of_note: note.typeOfNote,
          description: note.description,
        })),
      },
    };

    formattedResponse.data.push(formattedRequest);
    return res.status(200).json({
      ...formattedResponse,
    });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const save_view_notes_for_request = async (
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
      return res.status(404).json({ error: "Request not found" });
    }
    const notes_status = await Notes.findOne({
      where: {
        requestId: request.request_id,
        typeOfNote: "admin_notes",
      },
    });
    if (notes_status) {
      status = await Notes.update(
        {
          description: new_note,
        },
        {
          where: {
            requestId: request.request_id,
            typeOfNote: "admin_notes",
          },
        }
      );
    } else {
      status = await Notes.create({
        requestId: request.request_id,
        typeOfNote: "admin_notes",
        description: new_note,
      });
    }
    return res.status(200).json({
      status: true,
      confirmation_no: confirmation_no,
      message: "Successfull !!!",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const cancel_case_for_request_view_data = async (
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
      return res.status(404).json({ error: "Request not found" });
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
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const cancel_case_for_request = async (
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
      return res.status(404).json({ error: "Request not found" });
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
        requestId: request.request_id,
        typeOfNote: "admin_cancellation_notes",
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
            requestId: request.request_id,
            typeOfNote: "admin_cancellation_notes",
          },
        }
      );
    } else {
      Notes.create({
        requestId: request.request_id,
        typeOfNote: "admin_cancellation_notes",
        description: additional_notes,
        reason: reason,
      });
    }

    return res.status(200).json({
      status: true,
      confirmation_no: confirmation_no,
      message: "Successfull !!!",
    });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// export const assign_request_regions = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { state } = req.params;

//     if (state === "new") {
//       // Use distinct query to get unique regions
//       const physicians = await User.findAll({
//         where: {
//           type_of_user: "provider",
//           role: "physician",
//         },
//         attributes: ["state", "firstname", "lastname"],
//       });

//       if (!physicians) {
//         return res.status(200).json({
//           status: true,
//           message: "No physicians found.", // Include an empty regions array
//         });
//       }

//       // Extract unique regions from physicians
//       const uniqueRegions = Array.from(
//         new Set(physicians.map((p) => p.state))
//       );

//       return res.status(200).json({
//         status: true,
//         message: "Successfull !!!",
//         regions: uniqueRegions, // Include the unique regions array
//       });
//     }
//   } catch (error) {
//     console.error("Error in fetching Physicians:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
export const assign_request_region_physician = async (
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
        message: "Physician not found !!!",
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
    console.error("Error in fetching Physicians:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const assign_request = async (
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
      return res.status(404).json({ error: "Provider not found" });
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
      message: "Successfull !!!",
    });
  } catch (error) {
    console.error("Error in Assigning Request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const block_case_for_request_view = async (
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
      return res.status(404).json({ error: "Request not found" });
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
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const block_case_for_request = async (
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
      return res.status(404).json({ error: "Request not found" });
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
      message: "Successfull !!!",
    });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// Send Mail and Download All remaining in View Uploads
export const view_uploads_view_data = async (
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
      return res.status(404).json({ error: "Request not found" });
    }

    const formattedRequest: any = {
      request_id: request.request_id,
      request_state: request.request_state,
      confirmationNo: request.confirmation_no,
      patient_data: {
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
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const view_uploads_upload = async (
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
      return res.status(404).json({ error: "Request not found" });
    }

    const newDocument = await Documents.create({
      request_id: request.request_id,
      document_path: file.path,
    });
    if (!newDocument) {
      return res.status(404).json({ error: "Failed to upload!!!" });
    }
    return res.status(200).json({
      status: true,
      confirmation_no: confirmation_no,
      message: "Upload successful",
    });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const view_uploads_actions_delete = async (
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
      return res.status(404).json({ error: "Request not found" });
    }
    const delete_status = await Documents.destroy({
      where: {
        request_id: request.request_id,
        document_id,
      },
    });
    if (!delete_status) {
      return res.status(404).json({ error: "Error while deleting" });
    }
    return res.status(200).json({
      status: true,
      confirmation_no,
      message: "Successfull !!!",
    });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const view_uploads_actions_download = async (
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
      return res.status(404).json({ error: "Request not found" });
    }

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    let filePath = document.document_path;

    if (!path.isAbsolute(filePath)) {
      filePath = path.join(__dirname, "uploads", filePath);
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${document.document_path}"}`
    );

    res.download(filePath, (error) => {
      if (error) {
        console.error("Error sending file:", error);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        return res.status(200).json({
          status: true,
          confirmation_no: confirmation_no,
          message: "Successfull downloaded file!!!",
        });
      }
    });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const view_uploads_delete_all = async (
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
      return res.status(404).json({ error: "Request not found" });
    }

    const deletedCount = await Documents.destroy({
      where: {
        request_id: request.request_id,
      },
    });

    if (deletedCount === 0) {
      return res.status(200).json({ message: "No documents to delete" });
    }

    return res.status(200).json({
      status: true,
      confirmation_no: confirmation_no,
      message: `Successfully deleted ${deletedCount} document(s)`,
    });
  } catch (error) {
    console.error("Error deleting documents:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const view_uploads_download_all = async (
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
      return res.status(404).json({ error: "Request not found" });
    }

    const documents = request.Documents;

    if (documents.length === 0) {
      return res
        .status(200)
        .json({ message: "No documents available for download" });
    }

    const validPaths = documents.filter((file) =>
      fs.existsSync(file.document_path)
    );

    if (validPaths.length === 0) {
      return res
        .status(404)
        .json({ error: "No valid files found for download" });
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
    console.error("Error fetching documents:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const professions_for_send_orders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const professions = await Profession.findAll({
      attributes: ["profession_name"],
    });
    if (!professions) {
      res.status(500).json({ error: "Error fetching region data" });
    }
    return res
      .status(200)
      .json({ status: "Successfull", professions: professions });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const send_orders_for_request = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no, state } = req.params;
    const {
      profession,
      businessName,
      businessContact,
      email,
      faxNumber,
      orderDetails,
      numberOfRefill,
    } = req.body;
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
        return res.status(404).json({ error: "Request not found" });
      }
      await Order.create({
        requestId: request.request_id,
        request_state: state,
        profession,
        businessName,
        businessContact,
        email,
        faxNumber,
        orderDetails,
        numberOfRefill,
      });
      return res.status(200).json({
        status: true,
        confirmation_no: confirmation_no,
        message: "Successfull !!!",
      });
    }
  } catch (error) {
    console.error("Error in Sending Order:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
// export const transfer_request_regions = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { state } = req.params;

//     if (state === "pending") {
//       // Use distinct query to get unique regions
//       const physicians = await User.findAll({
//         where: {
//           type_of_user: "provider",
//           role: "physician",
//         },
//         attributes: ["region", "firstname", "lastname"],
//       });

//       if (!physicians) {
//         return res.status(200).json({
//           status: true,
//           message: "No physicians found.", // Include an empty regions array
//         });
//       }

//       // Extract unique regions from physicians
//       const uniqueRegions = Array.from(
//         new Set(physicians.map((p) => p.state))
//       );

//       return res.status(200).json({
//         status: true,
//         message: "Successfull !!!",
//         regions: uniqueRegions, // Include the unique regions array
//       });
//     }
//   } catch (error) {
//     console.error("Error in fetching Physicians:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
export const transfer_request_region_physicians = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { region } = req.query as { region: string };
    var i = 1;
    const formattedResponse: any = {
      status: true,
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
        message: "Physician not found !!!",
      });
    }
    for (const physician of physicians) {
      const formattedRequest: any = {
        sr_no: i,
        firstname: physician.firstname,
        lastname: physician.lastname,
      };
      i++;
      formattedResponse.data.push(formattedRequest);
    }
    return res.status(200).json({
      status: true,
      message: "Successfull !!!",
      ...formattedResponse,
    });
  } catch (error) {
    console.error("Error in fetching Physicians:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const transfer_request = async (
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
      return res.status(404).json({ error: "Provider not found" });
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
      return res.status(404).json({ error: "Request not found" });
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
      requestId: request.request_id,
      physician_name: firstname + " " + lastname,
      description,
      typeOfNote: "transfer_notes",
    });
    return res.status(200).json({
      status: true,
      confirmation_no: confirmation_no,
      message: "Successfull !!!",
    });
  } catch (error) {
    console.error("Error in transfering request:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const clear_case_for_request = async (
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
        return res.status(404).json({ error: "Request not found" });
      }
      await Notes.destroy({
        where: {
          requestId: request.request_id,
        },
      });
      await Order.destroy({
        where: {
          requestId: request.request_id,
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
        message: "Successfull !!!",
      });
    } catch {
      res.status(404).json({ error: "Invalid State !!!" });
    }
  } catch (error) {
    console.error("Error deleting request:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const send_agreement = async (
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
        message: "Invalid email address and mobile number",
        errormessage: statusCodes[400],
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
        message: "Invalid request case",
        errormessage: statusCodes[400],
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
        message: "Error while sending agreement to your mail",
        errormessage: statusCodes[200],
      });
    }
    return res.status(200).json({
      confirmation_no: confirmation_no,
      message: "Agreement sent to your email",
      errormessage: statusCodes[200],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error sending Agreement",
      errormessage: statusCodes[500],
    });
  }
};
export const update_agreement = async (
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
      return res.status(404).json({ error: "Request not found" });
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
        message: "Error while updating !!!",
      });
    }
    return res.status(200).json({
      status: true,
      confirmation_no: confirmation_no,
      message: "Successfull !!!",
    });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const close_case_for_request_view_details = async (
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
      return res.status(404).json({ error: "Request not found" });
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
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const close_case_for_request = async (
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
      return res.status(404).json({ error: "Request not found" });
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
      message: "Successfull !!!",
    });
  } catch (error) {
    console.error("Error closing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const close_case_for_request_edit = async (
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
      return res.status(404).json({ error: "Request not found" });
    }
    const patient_data = await User.findOne({
      where: { user_id: request.patient_id },
    });
    if (!patient_data) {
      return res.status(404).json({ error: "Patient not found" });
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
      message: "Successfull !!!",
    });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const close_case_for_request_actions_download = async (
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
      return res.status(404).json({ error: "Request not found" });
    }

    const document = await Documents.findOne({
      where: {
        request_id: request.request_id,
        document_id: document_id,
      },
    });

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    let filePath = document.document_path;

    if (!path.isAbsolute(filePath)) {
      filePath = path.join(__dirname, "uploads", filePath);
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${document.document_path}"}`
    );

    res.download(filePath, (error) => {
      if (error) {
        console.error("Error sending file:", error);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        console.log("File downloaded successfully");
        return res.status(200).json({
          status: true,
          confirmation_no: confirmation_no,
          message: "File downloaded successfully",
        });
      }
    });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**Admin Request Support */
export const request_support = async (
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
      message: "Successfull !!!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**Admin Send Link */
export const admin_send_link = async (
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
        .json({ status: false, message: "User not found!!!" });
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
      message: "Create Request link sent successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
